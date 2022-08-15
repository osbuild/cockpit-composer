import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { Button } from "@patternfly/react-core";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import { startCompose, fetchingComposeTypes } from "../../core/actions/composes";
import { blueprintsUpdate } from "../../core/actions/blueprints";
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
  users,
} from "./steps";
import MemoizedImageCreator from "./ImageCreator";
import { hostnameValidator, ostreeValidator } from "./validators";
import "./CreateImageWizard.css";

const messages = defineMessages({
  createImage: {
    id: "wizard.createImage",
    defaultMessage: "Create image",
  },
});

const CreateImageWizard = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
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

  const handleSaveBlueprint = (formProps) => {
    const { formValues, setIsSaving, setHasSaved } = formProps;
    setIsSaving(true);
    const blueprintData = stateToBlueprint(formValues);
    dispatch(blueprintsUpdate(blueprintData));
    setIsSaving(false);
    setHasSaved(true);
  };

  const handleBuildImage = async (formProps) => {
    const { formValues } = formProps;

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
      formValues["blueprint-name"],
      formValues["image-output-type"],
      formValues["image-size"],
      ostreeSettings,
      uploadSettings
    );
    setIsWizardOpen(false);
  };

  const handleSubmit = (action, formProps) => {
    if (action === "build") {
      handleBuildImage(formProps);
    } else if (action === "save") {
      handleSaveBlueprint(formProps);
    }
  };

  const blueprintToState = (blueprint) => {
    const formState = {};
    formState["blueprint-name"] = blueprint.name;
    formState["blueprint-description"] = blueprint.description;
    formState["blueprint-groups"] = blueprint.groups;
    if (blueprint.customizations) {
      formState["customizations-hostname"] = blueprint.customizations.hostname;
      formState["customizations-install-device"] = blueprint.customizations.installation_device;
      formState["customizations-users"] = [];
      if (blueprint.customizations.user?.length) {
        blueprint.customizations.user.forEach((user) => {
          const formUser = {
            username: user.name,
            password: user.password,
            "is-admin": user.groups?.includes("wheel"),
            "ssh-key": user.key,
          };
          formState["customizations-users"].push(formUser);
        });
      }
    }
    formState["selected-packages"] = blueprint.packages.map((pkg) => pkg.name);

    return formState;
  };

  const stateToBlueprint = (formValues) => {
    const formattedPacks = formValues?.["selected-packages"]?.map((pkg) => ({ name: pkg, version: "*" }));
    const customizations = {};
    customizations.hostname = formValues?.["customizations-hostname"];
    customizations.installation_device = formValues?.["customizations-install-device"];
    customizations.user = [];
    if (formValues["customizations-users"]?.length) {
      formValues["customizations-users"].forEach((formUser) => {
        const bpUser = {
          name: formUser.username,
          password: formUser.password,
          groups: formUser["is-admin"] ? ["wheel"] : [],
          key: formUser["ssh-key"],
        };
        customizations.user.push(bpUser);
      });
    }

    const blueprintData = {
      name: formValues?.["blueprint-name"],
      description: formValues?.["blueprint-description"],
      modules: [],
      packages: formattedPacks,
      groups: formValues?.["blueprint-groups"],
      customizations,
    };

    return blueprintData;
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleOpen}
        isDisabled={!props.blueprint?.name || !props.imageTypes?.length}
        aria-label={intl.formatMessage(messages.createImage)}
      >
        <FormattedMessage id="wizard.createImage" defaultMessage="Create image" />
      </Button>
      {isWizardOpen && (
        <MemoizedImageCreator
          onClose={handleClose}
          onSubmit={(action, formValues) => handleSubmit(action, formValues)}
          customValidatorMapper={{ hostnameValidator, ostreeValidator }}
          schema={{
            fields: [
              {
                component: componentTypes.WIZARD,
                name: "create-image-wizard",
                id: "create-image-wizard",
                isDynamic: true,
                inModal: true,
                showTitles: true,
                title: intl.formatMessage(messages.createImage),
                buttonLabels: {
                  submit: intl.formatMessage(messages.createImage),
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
                  users,
                  packages,
                  review,
                ],
                crossroads: ["image-output-type", "image-upload"],
              },
            ],
          }}
          initialValues={blueprintToState(props.blueprint)}
          blueprint={props.blueprint}
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
  blueprint: PropTypes.object,
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
