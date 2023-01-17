import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@patternfly/react-core";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
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
  review,
} from "../../forms/steps";
import MemoizedImageCreator from "./ImageCreator";
import { ostreeValidator } from "../../forms/validators";
import "./CreateImageWizard.css";
import { selectAllImageTypes, createImage } from "../../slices/imagesSlice";
import { selectAllBlueprintNames } from "../../slices/blueprintsSlice";
import { blueprintToFormState } from "../../helpers";

const messages = defineMessages({
  createImage: {
    defaultMessage: "Create image",
  },
  createButton: {
    defaultMessage: "Create",
  },
});

const CreateImageWizard = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const blueprintNames = useSelector((state) => selectAllBlueprintNames(state));
  const getImageTypes = () =>
    useSelector((state) => selectAllImageTypes(state));
  const imageTypes = getImageTypes();

  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleClose = () => {
    setIsWizardOpen(false);
  };

  const handleOpen = () => {
    setIsWizardOpen(true);
  };

  const handleBuildImage = async (fields, formAPI) => {
    const formValues = formAPI.getState().values;

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
      "iot-commit",
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

    const imageArgs = {
      blueprintName: formValues.blueprint.name,
      type: formValues["image-output-type"],
      size: formValues["image-size"],
      ostree: ostreeSettings,
      upload: uploadSettings,
    };

    dispatch(createImage(imageArgs));
    setIsWizardOpen(false);
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleOpen}
        isDisabled={!imageTypes?.length}
        aria-label={intl.formatMessage(messages.createImage)}
      >
        <FormattedMessage defaultMessage="Create image" />
      </Button>
      {isWizardOpen && (
        <MemoizedImageCreator
          onClose={handleClose}
          onSubmit={(fields, formAPI) => handleBuildImage(fields, formAPI)}
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
                title: intl.formatMessage(messages.createImage),
                buttonLabels: {
                  submit: intl.formatMessage(messages.createButton),
                },
                fields: [
                  imageOutput(intl),
                  awsAuth(intl),
                  awsDest(intl),
                  azureAuth(intl),
                  azureDest(intl),
                  ociAuth(intl),
                  ociDest(intl),
                  vmwareAuth(intl),
                  vmwareDest(intl),
                  ostreeSettings(intl),
                  review(intl),
                ],
                crossroads: ["image-output-type", "image-upload"],
              },
            ],
          }}
          initialValues={
            props.blueprint ? blueprintToFormState(props.blueprint) : {}
          }
          blueprint={props.blueprint}
          blueprintNames={blueprintNames}
          imageTypes={imageTypes}
        />
      )}
    </>
  );
};

CreateImageWizard.propTypes = {
  blueprint: PropTypes.object,
};

export default CreateImageWizard;
