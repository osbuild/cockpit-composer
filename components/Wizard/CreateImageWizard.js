import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import { Button } from "@patternfly/react-core";
import { startCompose, fetchingComposeTypes } from "../../core/actions/composes";

import ImageCreator from "./ImageCreator";
import {
  imageOutput,
  awsAuth,
  awsDest,
  azureAuth,
  azureDest,
  vmwareAuth,
  vmwareDest,
  ociAuth,
  ociDest,
  ostreeSettings,
  details,
  packages,
  review,
} from "./steps";

import { ostreeValidator } from "./validators";

import "./CreateImageWizard.css";

import BlueprintApi from "../../data/BlueprintApi";
import * as composer from "../../core/composer";
import { updateBlueprintComponents } from "../../core/actions/blueprints";

const CreateImageWizard = (props) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleClose = () => {
    setIsWizardOpen(false);
  };

  useEffect(() => {
    // refactor since this currently gets called for each button
    props.fetchingComposeTypes();
  }, []);

  const handleOpen = () => {
    setIsWizardOpen(true);
  };

  const updateBlueprintComponents = (packageList) => {
    // All packages are converted to most current version
    const packages = packageList.map((pkg) => ({ name: pkg, version: "*" }));
    // Any modules in the blueprint should have already been added to package list
    const modules = [];
    // TODO components should be removed from redux action parameters, it is unnecessary
    const components = [];
    // TODO concept of pending changes will eventually be removed, pass empty object for now
    const pendingChange = {};
    props.updateBlueprintComponents(props.blueprintName, components, packages, modules, pendingChange);
  };

  const handleSubmit = async (formValues) => {
    updateBlueprintComponents(formValues["selected-packages"]);
    const depsolveResult = await composer.depsolveBlueprint(props.blueprintName);
    const workspaceBlueprint = depsolveResult.blueprints[0].blueprint;
    await BlueprintApi.handleCommitBlueprint(workspaceBlueprint);

    // startCompose(props.blueprint.name, composeType, imageSize, ostree, upload);

    let uploadSettings;
    if (formValues["image-upload"]) {
      if (formValues["image-output-type"] === "ami") {
        uploadSettings = {
          image_name: formValues["aws-image-name"],
          provider: "aws",
          settings: {
            accessKeyID: formValues["aws-access-key"],
            secretAccessKey: formValues["aws-secret-access-key"],
            bucket: formValues["aws-s3-bucket"],
            region: formValues["aws-region"],
          },
        };
      } else if (formValues["image-output-type"] === "vhd") {
        uploadSettings = {
          image_name: formValues["azure-image-name"],
          provider: "azure",
          settings: {
            storageAccount: formValues["azure-storage-account"],
            storageAccessKey: formValues["azure-storage-access-key"],
            container: formValues["azure-storage-container"],
          },
        };
      } else if (formValues["image-output-type"] === "vmdk") {
        uploadSettings = {
          image_name: formValues["vmware-image-name"],
          provider: "vmware",
          settings: {
            username: formValues["vmware-username"],
            password: formValues["vmware-password"],
            host: formValues["vmware-host"],
            cluster: formValues["vmware-cluster"],
            dataCenter: formValues["vmware-data-center"],
            dataStore: formValues["vmware-data-store"],
          },
        };
      } else if (formValues["image-output-type"] === "oci") {
        uploadSettings = {
          image_name: formValues["oci-image-name"],
          provider: "oci",
          settings: {
            user: formValues["oci-user-ocid"],
            privateKey: formValues["oci-private-key"],
            fingerprint: formValues["oci-fingerprint"],
            filename: formValues["oci-private-key-filename"],
            bucket: formValues["oci-bucket"],
            namespace: formValues["oci-bucket-namespace"],
            region: formValues["oci-bucket-region"],
            compartment: formValues["oci-bucket-compartment"],
            tenancy: formValues["oci-bucket-tenancy"],
          },
        };
      }
    }

    let ostreeSettings;
    const ostreeImageTypes = [
      "fedora-iot-commit",
      "edge-commit",
      "edge-container",
      "edge-installer",
      "edge-raw-image",
      "edge-simplified-installer",
    ];
    if (ostreeImageTypes.includes(formValues["image-output-type"])) {
      ostreeSettings = {
        parent: formValues["ostree-parent-commit"],
        ref: formValues["ostree-ref"],
        url: formValues["ostree-repo-url"],
      };
    }

    props.startCompose(
      props.blueprintName,
      formValues["image-output-type"],
      formValues["image-size"],
      ostreeSettings,
      uploadSettings
    );
    setIsWizardOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleOpen} aria-label="Create image">
        Create image
      </Button>
      {isWizardOpen && (
        <ImageCreator
          onClose={handleClose}
          onSubmit={(formValues) => handleSubmit(formValues)}
          customValidatorMapper={{ ostreeValidator }}
          schema={{
            fields: [
              {
                component: componentTypes.WIZARD,
                name: "create-image-wizard",
                id: "create-image-wizard",
                isDynamic: true,
                inModal: true,
                showTitles: true,
                title: "Create image",
                buttonLabels: {
                  submit: "Create image",
                },
                fields: [
                  imageOutput,
                  awsAuth,
                  awsDest,
                  azureAuth,
                  azureDest,
                  ociAuth,
                  ociDest,
                  vmwareAuth,
                  vmwareDest,
                  ostreeSettings,
                  details,
                  packages,
                  review,
                ],
                crossroads: ["image-output-type", "image-upload"],
              },
            ],
          }}
          blueprintName={props.blueprintName}
          imageTypes={props.imageTypes}
        />
      )}
    </>
  );
};

CreateImageWizard.propTypes = {
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  fetchingComposeTypes: PropTypes.func,
  startCompose: PropTypes.func,
  blueprintName: PropTypes.string,
  updateBlueprintComponents: PropTypes.func,
};

CreateImageWizard.defaultProps = {
  updateBlueprintComponents() {},
};

const mapStateToProps = (state) => ({
  imageTypes: state.composes.composeTypes,
});

const mapDispatchToProps = (dispatch) => ({
  fetchingComposeTypes: () => {
    dispatch(fetchingComposeTypes());
  },
  startCompose: (blueprintName, composeType, imageSize, ostree, upload) => {
    dispatch(startCompose(blueprintName, composeType, imageSize, ostree, upload));
  },
  updateBlueprintComponents: (blueprintId, components, packages, modules, pendingChange) => {
    dispatch(updateBlueprintComponents(blueprintId, components, packages, modules, pendingChange));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateImageWizard);
