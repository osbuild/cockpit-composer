import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  ociTitle: {
    id: "wizard.oci.title",
    defaultMessage: "Upload to OCI",
  },
  imageNamePopoverBody: {
    id: "wizard.oci.imageName.popoverBody",
    defaultMessage:
      "Provide a file name to be used for the image file that will be uploaded.",
  },
  imageNamePopoverAria: {
    id: "wizard.oci.imageName.popoverAria",
    defaultMessage: "Image name help",
  },
  bucketPopoverBody: {
    id: "wizard.oci.bucket.popoverBody",
    defaultMessage:
      "Provide the bucket name to which the image file will be uploaded before being imported as a custom " +
      "image. The bucket must already exist in the Region where you want to import your image. You can find a " +
      "list of buckets on the <strong>OCI buckets</strong> page in the OCI storage service in the OCI console.",
  },
  bucketPopoverAria: {
    id: "wizard.oci.bucket.popoverAria",
    defaultMessage: "OCI bucket help",
  },
  namespacePopoverBody: {
    id: "wizard.oci.namespace.popoverBody",
    defaultMessage:
      "Provide the namespace of the OCI bucket your uploading to. You can find the namespace in the bucket details.",
  },
  namespacePopoverAria: {
    id: "wizard.oci.namespace.popoverAria",
    defaultMessage: "Bucket namespace help",
  },
  regionPopoverBody: {
    id: "wizard.oci.region.popoverBody",
    defaultMessage:
      "Provide the region of the Bucket region your uploading to. You can find the region in the bucket details.",
  },
  regionPopoverAria: {
    id: "wizard.oci.region.popoverAria",
    defaultMessage: "Bucket region help",
  },
  compartmentPopoverBody: {
    id: "wizard.oci.compartment.popoverBody",
    defaultMessage:
      "Provide the compartment of the OCI bucket compartment your uploading to. You can find the compartment in the bucket details.",
  },
  compartmentPopoverAria: {
    id: "wizard.oci.compartment.popoverAria",
    defaultMessage: "Bucket compartment help",
  },
  tenancyPopoverBody: {
    id: "wizard.oci.tenancy.popoverBody",
    defaultMessage:
      "Provide the tenancy of the OCI bucket your uploading to. You can find the tenancy in the bucket details.",
  },
  tenancyPopoverAria: {
    id: "wizard.oci.tenancy.popoverAria",
    defaultMessage: "Bucket tenancy help",
  },
});

const ociDest = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Destination" />,
    name: "oci-dest",
    substepOf: intl.formatMessage(messages.ociTitle),
    nextStep: "review-image",
    fields: [
      {
        component: "text-field-custom",
        name: "image.upload.image_name",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Image name" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.imageNamePopoverBody)}
            aria-label={intl.formatMessage(messages.imageNamePopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.imageNamePopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        autoFocus: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "text-field-custom",
        name: "image.upload.settings.bucket",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="OCI bucket" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.bucketPopoverBody, {
              strong: (str) => <strong>{str}</strong>,
            })}
            aria-label={intl.formatMessage(messages.bucketPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.bucketPopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "text-field-custom",
        name: "image.upload.settings.namespace",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Bucket namespace" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.namespacePopoverBody)}
            aria-label={intl.formatMessage(messages.namespacePopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.namespacePopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "text-field-custom",
        name: "image.upload.settings.region",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Bucket region" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.regionPopoverBody)}
            aria-label={intl.formatMessage(messages.regionPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.regionPopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "text-field-custom",
        name: "image.upload.settings.compartment",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Bucket compartment" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.compartmentPopoverBody)}
            aria-label={intl.formatMessage(messages.compartmentPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.compartmentPopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
      {
        component: "text-field-custom",
        name: "image.upload.settings.tenancy",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Bucket tenancy" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.tenancyPopoverBody)}
            aria-label={intl.formatMessage(messages.tenancyPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.tenancyPopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        isRequired: true,
        validate: [
          {
            type: validatorTypes.REQUIRED,
          },
        ],
      },
    ],
  };
};

export default ociDest;
