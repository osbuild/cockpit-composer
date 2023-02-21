import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  imageNamePopoverBody: {
    defaultMessage:
      "Provide a file name to be used for the image file that will be uploaded.",
  },
  imageNamePopoverAria: {
    defaultMessage: "Image name help",
  },
  bucketPopoverBody: {
    defaultMessage:
      "Provide the name of the bucket where the image will be uploaded. This bucket must already exist.",
  },
  bucketPopoverAria: {
    defaultMessage: "Bucket help",
  },
  regionPopoverBody: {
    defaultMessage:
      "Provide the region where the bucket is located. This region can be a regular Google storage region, but also a dual or multi region.",
  },
  regionPopoverAria: {
    defaultMessage: "Region help",
  },
  credentialsPopoverBody: {
    defaultMessage:
      "The credentials file is a JSON file downloaded from GCP. The credentials are used to determine the GCP project to upload the image to.",
  },
  credentialsPopoverAria: {
    defaultMessage: "Credentials help",
  },
});

const gcp = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="GCP" />,
    name: "gcp",
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
        name: "image.upload.settings.region",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Storage region" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.regionPopoverBody)}
            aria-label={intl.formatMessage(messages.regionPopoverAria)}
          >
            <Button variant="plain">
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
        name: "image.upload.settings.bucket",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Bucket" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.bucketPopoverBody)}
            aria-label={intl.formatMessage(messages.bucketPopoverAria)}
          >
            <Button variant="plain">
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
        component: "upload-file",
        name: "image.upload.settings.credentials",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Credentials" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.credentialsPopoverBody)}
            aria-label={intl.formatMessage(messages.credentialsPopoverAria)}
          >
            <Button variant="plain">
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

export default gcp;
