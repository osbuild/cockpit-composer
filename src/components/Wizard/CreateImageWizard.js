import React, { useEffect, useState } from "react";
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
  gcp,
  ostreeSettings,
  reviewImage,
} from "../../forms/steps";
import { ostreeValidator } from "../../forms/validators";
import "./CreateImageWizard.css";
import { selectAllImageTypes, createImage } from "../../slices/imagesSlice";
import {
  selectAllBlueprintNames,
  selectBlueprintByName,
} from "../../slices/blueprintsSlice";
import { blueprintToFormState } from "../../helpers";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import { componentMapper } from "@data-driven-forms/pf4-component-mapper";
import ImageOutputSelect from "../../forms/components/ImageOutputSelect";
import Packages from "../../forms/components/Packages";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import UploadOCIFile from "../../forms/components/UploadOCIFile";
import UploadFile from "../../forms/components/UploadFile";
import BlueprintSelect from "../../forms/components/BlueprintSelect";
import { FormSpy, useFormApi } from "@data-driven-forms/react-form-renderer";

const messages = defineMessages({
  createImage: {
    defaultMessage: "Create image",
  },
  createButton: {
    defaultMessage: "Create",
  },
});

const BlueprintListener = () => {
  const { getState, change } = useFormApi();
  const { blueprintName } = getState().values;
  if (!blueprintName) return null;

  const blueprint = useSelector((state) =>
    selectBlueprintByName(state, blueprintName)
  );
  const blueprintForm = blueprintToFormState(blueprint);

  useEffect(() => {
    change("blueprint", blueprintForm?.blueprint);
  }, [blueprintName]);

  return null;
};

const BlueprintListenerWrapper = () => (
  <FormSpy subscription={{ values: true }}>
    {() => <BlueprintListener />}
  </FormSpy>
);

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
    if (formValues?.image?.isUpload) {
      if (formValues?.image?.type === "ami") {
        uploadSettings = {
          image_name: formValues.image.upload.image_name,
          provider: "aws",
          settings: {
            accessKeyID: formValues.image.upload.settings.accessKeyID,
            secretAccessKey: formValues.image.upload.settings.secretAccessKey,
            bucket: formValues.image.upload.settings.bucket,
            region: formValues.image.upload.settings.region,
          },
        };
      } else if (formValues?.image?.type === "vhd") {
        uploadSettings = {
          image_name: formValues.image.upload.image_name,
          provider: "azure",
          settings: {
            storageAccount: formValues.image.upload.settings.storageAccount,
            storageAccessKey: formValues.image.upload.settings.storageAccessKey,
            container: formValues.image.upload.settings.container,
          },
        };
      } else if (
        formValues?.image?.type === "vmdk" ||
        formValues?.image?.type === "ova"
      ) {
        uploadSettings = {
          image_name: formValues.image.upload.image_name,
          provider: "vmware",
          settings: {
            username: formValues.image.upload.settings.username,
            password: formValues.image.upload.settings.password,
            host: formValues.image.upload.settings.host,
            cluster: formValues.image.upload.settings.cluster,
            dataCenter: formValues.image.upload.settings.dataCenter,
            dataStore: formValues.image.upload.settings.dataStore,
            folder: formValues.image.upload.settings.folder,
          },
        };
      } else if (formValues?.image?.type === "oci") {
        uploadSettings = {
          image_name: formValues.image.upload.image_name,
          provider: "oci",
          settings: {
            user: formValues.image.upload.settings.user,
            private_key: formValues.image.upload.settings.privateKey,
            fingerprint: formValues.image.upload.settings.fingerprint,
            filename: formValues.image.upload.settings.filename,
            bucket: formValues.image.upload.settings.bucket,
            namespace: formValues.image.upload.settings.namespace,
            region: formValues.image.upload.settings.region,
            compartment: formValues.image.upload.settings.compartment,
            tenancy: formValues.image.upload.settings.tenancy,
          },
        };
      } else if (formValues?.image?.type === "gce") {
        // credentials are uploaded as a json file that should be
        // base64 encoded before being sent to osbuild-composer
        const credentialsEncoded = window.btoa(
          formValues.image.upload.settings.credentials
        );
        uploadSettings = {
          image_name: formValues.image.upload.image_name,
          provider: "gcp",
          settings: {
            region: formValues.image.upload.settings.region,
            bucket: formValues.image.upload.settings.bucket,
            credentials: credentialsEncoded,
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
    if (ostreeImageTypes.includes(formValues?.image?.type)) {
      ostreeSettings = {
        parent: formValues?.image?.ostree?.parent,
        ref: formValues?.image?.ostree?.ref,
        url: formValues?.image?.ostree?.url,
      };
    }

    const imageArgs = {
      blueprintName: formValues?.blueprintName,
      type: formValues?.image?.type,
      size: formValues?.image?.size,
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
        <FormRenderer
          initialValues={
            props.blueprint ? blueprintToFormState(props.blueprint) : {}
          }
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
                onKeyDown: (event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                },
                fields: [
                  imageOutput(intl),
                  awsAuth(intl),
                  awsDest(intl),
                  azureAuth(intl),
                  azureDest(intl),
                  gcp(intl),
                  ociAuth(intl),
                  ociDest(intl),
                  vmwareAuth(intl),
                  vmwareDest(intl),
                  ostreeSettings(intl),
                  reviewImage(intl),
                ],
                crossroads: ["image.isUpload", "image.type"],
              },
            ],
          }}
          FormTemplate={(props) => (
            <Pf4FormTemplate {...props} showFormControls={false} />
          )}
          onSubmit={(fields, formAPI) => handleBuildImage(fields, formAPI)}
          validatorMapper={{ ostreeValidator }}
          componentMapper={{
            ...componentMapper,
            "image-output-select": {
              component: ImageOutputSelect,
              imageTypes: imageTypes,
            },
            "package-selector": {
              component: Packages,
            },
            "text-field-custom": TextFieldCustom,
            "upload-oci-file": UploadOCIFile,
            "blueprint-select": {
              component: BlueprintSelect,
              blueprintNames: blueprintNames,
            },
            "blueprint-listener": BlueprintListenerWrapper,
            "upload-file": UploadFile,
          }}
          onCancel={handleClose}
        />
      )}
    </>
  );
};

CreateImageWizard.propTypes = {
  blueprint: PropTypes.object,
};

export default CreateImageWizard;
