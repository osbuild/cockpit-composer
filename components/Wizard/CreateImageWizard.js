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
  details,
  packages,
  review,
} from "./steps";
import "./CreateImageWizard.css";

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

  const handleSubmit = (formValues) => {
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

    props.startCompose(
      props.blueprintName,
      formValues["image-output-type"],
      formValues["image-size"],
      undefined,
      uploadSettings
    );
    setIsWizardOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleOpen}>
        Create image (new)
      </Button>
      {isWizardOpen && (
        <ImageCreator
          onClose={handleClose}
          onSubmit={(formValues) => handleSubmit(formValues)}
          schema={{
            fields: [
              {
                component: componentTypes.WIZARD,
                name: "cockpit-composer-wizard",
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
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateImageWizard);
