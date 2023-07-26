/* eslint-disable no-unused-vars */
import React from "react";
import { Button, Popover } from "@patternfly/react-core";
import {
  ExternalLinkSquareAltIcon,
  HelpIcon,
  OutlinedQuestionCircleIcon,
} from "@patternfly/react-icons";
import { defineMessages, FormattedMessage } from "react-intl";

import {
  componentTypes,
  validatorTypes,
} from "@data-driven-forms/react-form-renderer";
import nextStepMapper from "./imageOutputStepMapper";

const messages = defineMessages({
  imageOutput: {
    id: "wizard.imageOutput.title",
    defaultMessage: "Image output",
  },
  imageOutputType: {
    id: "wizard.imageOutput.type",
    defaultMessage: "Image output type",
  },
  awsPopoverBody: {
    id: "wizard.imageOutput.uploadAWS.popoverBody",
    defaultMessage:
      "Image Builder can upload images you create to an S3 bucket in AWS and then import them into EC2. When the image build is complete " +
      "and the upload action is successful, the image file is available in the AMI section of EC2. Most of the values required to upload " +
      "the image can be found in the {console}. " +
      "{br}{br}" +
      "This upload process requires that you have an Identity and Access Management (IAM) role named {vmimport} to ensure that the image can " +
      "be imported from the S3 bucket into EC2. For more details, refer to the {role}. ",
  },
  awsPopoverAria: {
    id: "wizard.imageOutput.uploadAWS.popoverAria",
    defaultMessage: "Upload to AWS help",
  },
  azurePopoverBody: {
    id: "wizard.imageOutput.uploadAzure.popoverBody",
    defaultMessage:
      "Image Builder can upload images you create to a Blob container in {azure}. When the image build is complete " +
      "and the upload action is successful, the image file is available in the Storage account and Blob container that you specified.",
  },
  azurePopoverAria: {
    id: "wizard.imageOutput.uploadAzure.popoverAria",
    defaultMessage: "Upload to Azure help",
  },
  vmwarePopoverBody: {
    id: "wizard.imageOutput.uploadVMware.popoverBody",
    defaultMessage:
      "Image Builder can upload images you create to VMware vSphere. " +
      "When the image build is complete and the upload action is successful, " +
      "the image file is available in the Cluster on the vSphere instance that you specified.",
  },
  vmwarePopoverAria: {
    id: "wizard.imageOutput.uploadVMware.popoverAria",
    defaultMessage: "Upload to VMware help",
  },
  ociPopoverBody: {
    id: "wizard.imageOutput.uploadOCI.popoverBody",
    defaultMessage:
      "Image Builder can upload images you create to an OCI bucket in OCI and register it as a custom image. " +
      "When the image build is complete and the upload action is successful, the image should be available under custom images. " +
      "Most of the values required to upload the image can be found in the {console}." +
      "{br}{br}" +
      "This upload process requires that you have an Identity and Access Management (IAM) with attached policy " +
      "to manage custom images to ensure that the image can be imported as a custom image from the bucket. " +
      "For more details, refer to the {policy}.",
  },
  ociPopoverAria: {
    id: "wizard.imageOutput.uploadOCI.popoverAria",
    defaultMessage: "Upload to OCI help",
  },
  imageSizeLabel: {
    id: "wizard.imageOutput.imageSize.label",
    defaultMessage: "Image Size",
  },
  imageSizePopoverBody: {
    id: "wizard.imageOutput.imageSize.popoverBody",
    defaultMessage:
      "Set the size that you want the image to be when instantiated. The total package size and target " +
      "destination of your image should be considered when setting the image size.",
  },
  imageSizePopoverAria: {
    id: "wizard.imageOutput.imageSize.popoverAria",
    defaultMessage: "Image size help",
  },
  imageSizeInputHelp: {
    id: "wizard.imageOutput.imageSize.inputHelp",
    defaultMessage: "Minimum image size is {size}GB.",
  },
  blueprintSelect: {
    defaultMessage: "Select a blueprint",
  },
});

const imageOutput = (intl) => {
  return {
    id: "wizard-image-output",
    title: intl.formatMessage(messages.imageOutput),
    name: "image-output",
    nextStep: ({ values }) => nextStepMapper(values),
    fields: [
      {
        component: "blueprint-select",
        name: "blueprintName",
        label: intl.formatMessage(messages.blueprintSelect),
      },
      {
        component: "blueprint-listener",
        name: "listener",
        hideField: true,
      },
      {
        component: "image-output-select",
        name: "image.type",
        label: intl.formatMessage(messages.imageOutputType),
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        name: "image.isUpload",
        component: componentTypes.CHECKBOX,
        label: (
          <>
            <FormattedMessage
              id="wizard.imageOutput.uploadAWS"
              defaultMessage="Upload to AWS"
            />
            <Popover
              bodyContent={intl.formatMessage(messages.awsPopoverBody, {
                console: (
                  <Button
                    component="a"
                    variant="link"
                    icon={<ExternalLinkSquareAltIcon />}
                    iconPosition="right"
                    isInline
                    href="https://console.aws.amazon.com/console/home"
                    target="_blank"
                  >
                    AWS Management Console
                  </Button>
                ),
                br: <br />,
                vmimport: <code>vmimport</code>,
                role: (
                  <Button
                    component="a"
                    variant="link"
                    icon={<ExternalLinkSquareAltIcon />}
                    iconPosition="right"
                    isInline
                    href="https://docs.aws.amazon.com/vm-import/latest/userguide/vmie_prereqs.html#vmimport-role"
                    target="_blank"
                  >
                    AWS Required Service Role
                  </Button>
                ),
              })}
              aria-label={intl.formatMessage(messages.awsPopoverAria)}
            >
              <Button
                className="upload-checkbox-popover-button"
                variant="plain"
                aria-label={intl.formatMessage(messages.awsPopoverAria)}
              >
                <OutlinedQuestionCircleIcon />
              </Button>
            </Popover>
          </>
        ),
        condition: {
          when: "image.type",
          is: "ami",
        },
      },
      {
        name: "image.isUpload",
        component: componentTypes.CHECKBOX,
        label: (
          <>
            <FormattedMessage
              id="wizard.imageOutput.uploadAzure"
              defaultMessage="Upload to Azure"
            />
            <Popover
              bodyContent={intl.formatMessage(messages.azurePopoverBody, {
                azure: (
                  <Button
                    component="a"
                    target="_blank"
                    variant="link"
                    icon={<ExternalLinkSquareAltIcon />}
                    iconPosition="right"
                    isInline
                    href="https://portal.azure.com/"
                  >
                    Microsoft Azure
                  </Button>
                ),
              })}
              aria-label={intl.formatMessage(messages.azurePopoverAria)}
            >
              <Button
                className="upload-checkbox-popover-button"
                variant="plain"
                aria-label={intl.formatMessage(messages.azurePopoverAria)}
              >
                <OutlinedQuestionCircleIcon />
              </Button>
            </Popover>
          </>
        ),
        condition: {
          when: "image.type",
          is: "vhd",
        },
      },
      {
        name: "image.isUpload",
        component: componentTypes.CHECKBOX,
        label: <FormattedMessage defaultMessage="Upload to GCP" />,
        condition: {
          when: "image.type",
          is: "gce",
        },
      },
      {
        name: "image.isUpload",
        component: componentTypes.CHECKBOX,
        label: (
          <>
            <FormattedMessage
              id="wizard.imageOutput.uploadVMware"
              defaultMessage="Upload to VMware"
            />
            <Popover
              bodyContent={intl.formatMessage(messages.vmwarePopoverBody)}
              aria-label={intl.formatMessage(messages.vmwarePopoverAria)}
            >
              <Button
                className="upload-checkbox-popover-button"
                variant="plain"
                aria-label={intl.formatMessage(messages.vmwarePopoverAria)}
              >
                <OutlinedQuestionCircleIcon />
              </Button>
            </Popover>
          </>
        ),
        condition: {
          when: "image.type",
          is: ["vmdk", "ova"],
        },
      },
      {
        name: "image.isUpload",
        component: componentTypes.CHECKBOX,
        label: (
          <>
            <FormattedMessage
              id="wizard.imageOutput.uploadOCI"
              defaultMessage="Upload to OCI"
            />
            <Popover
              bodyContent={intl.formatMessage(messages.ociPopoverBody, {
                console: (
                  <Button
                    component="a"
                    target="_blank"
                    variant="link"
                    icon={<ExternalLinkSquareAltIcon />}
                    iconPosition="right"
                    isInline
                    href="https://cloud.oracle.com"
                  >
                    OCI Management Console
                  </Button>
                ),
                br: <br />,
                policy: (
                  <Button
                    component="a"
                    className="pf-icon"
                    target="_blank"
                    variant="link"
                    icon={<ExternalLinkSquareAltIcon />}
                    iconPosition="right"
                    isInline
                    href="https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/commonpolicies.htm#manage-custom-images"
                  >
                    OCI Required IAM Policy
                  </Button>
                ),
              })}
              aria-label={intl.formatMessage(messages.ociPopoverAria)}
            >
              <Button
                className="upload-checkbox-popover-button"
                variant="plain"
                aria-label={intl.formatMessage(messages.ociPopoverAria)}
              >
                <OutlinedQuestionCircleIcon />
              </Button>
            </Popover>
          </>
        ),
        condition: {
          when: "image.type",
          is: "oci",
        },
      },
      {
        component: "text-field-custom",
        name: "image.size",
        className: "pf-u-w-50",
        type: "number",
        label: intl.formatMessage(messages.imageSizeLabel),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.imageSizePopoverBody)}
            aria-label={intl.formatMessage(messages.imageSizePopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.imageSizePopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        helperText: intl.formatMessage(messages.imageSizeInputHelp, {
          size: "2",
        }),
        initializeOnMount: true,
        initialValue: 2,
        isRequired: true,
        autoFocus: true,
        condition: {
          when: "image.type",
          is: [
            "",
            "iot-commit",
            "edge-commit",
            "edge-container",
            "edge-installer",
            "image-installer",
          ],
          notMatch: true,
        },
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
          {
            type: validatorTypes.MIN_NUMBER_VALUE,
            includeThreshold: true,
            value: 2,
            message: intl.formatMessage(messages.imageSizeInputHelp, {
              size: "2",
            }),
          },
        ],
        resolveProps: (props, { meta, input }, formOptions) => {
          const imageType = formOptions.getState().values["image.type"];
          if (imageType === "ami") {
            return {
              initialValue: 6,
              helperText: intl.formatMessage(messages.imageSizeInputHelp, {
                size: "6",
              }),
              validate: [
                {
                  type: validatorTypes.REQUIRED,
                },
                {
                  type: validatorTypes.MIN_NUMBER_VALUE,
                  includeThreshold: true,
                  value: 6,
                  message: intl.formatMessage(messages.imageSizeInputHelp, {
                    size: "6",
                  }),
                },
              ],
            };
          }
          if (imageType === "edge-simplified-installer") {
            return {
              initialValue: 10,
              helperText: intl.formatMessage(messages.imageSizeInputHelp, {
                size: "10",
              }),
              validate: [
                {
                  type: validatorTypes.REQUIRED,
                },
                {
                  type: validatorTypes.MIN_NUMBER_VALUE,
                  includeThreshold: true,
                  value: 6,
                  message: intl.formatMessage(messages.imageSizeInputHelp, {
                    size: "10",
                  }),
                },
              ],
            };
          }
        },
      },
    ],
  };
};

export default imageOutput;
