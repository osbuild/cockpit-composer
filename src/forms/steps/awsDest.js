/* eslint-disable react/display-name */
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  awsStepsTitle: {
    id: "wizard.aws.title",
    defaultMessage: "Upload to AWS",
  },
  awsImageNamePopoverBody: {
    id: "wizard.aws.imageName.popoverBody",
    defaultMessage:
      "Provide a file name to be used for the image file that will be uploaded.",
  },
  awsImageNamePopoverAria: {
    id: "wizard.aws.imageName.popoverAria",
    defaultMessage: "Image name help",
  },
  awsBucketPopoverBody: {
    id: "wizard.aws.bucket.popoverBody",
    defaultMessage:
      "Provide the S3 bucket name to which the image file will be uploaded before being imported into EC2. " +
      "The bucket must already exist in the Region where you want to import your image. " +
      "You can find a list of buckets on the <strong>S3 buckets</strong> page in the Amazon S3 storage service in the AWS console.",
  },
  awsBucketPopoverAria: {
    id: "wizard.aws.bucket.popoverAria",
    defaultMessage: "S3 bucket help",
  },
  awsRegionPopoverBody: {
    id: "wizard.aws.region.popoverBody",
    defaultMessage:
      "Provide the AWS Region where you want to import your image. This must be the same region where the S3 bucket exists.",
  },
  awsRegionPopoverAria: {
    id: "wizard.aws.region.popoverAria",
    defaultMessage: "Region help",
  },
});

const awsDest = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Destination" />,
    name: "aws-dest",
    substepOf: intl.formatMessage(messages.awsStepsTitle),
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
            bodyContent={intl.formatMessage(messages.awsImageNamePopoverBody)}
            aria-label={intl.formatMessage(messages.awsImageNamePopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.awsImageNamePopoverAria)}
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
        label: <FormattedMessage defaultMessage="Amazon S3 bucket" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.awsBucketPopoverBody, {
              strong: (str) => <strong>{str}</strong>,
            })}
            aria-label={intl.formatMessage(messages.awsBucketPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.awsBucketPopoverAria)}
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
        label: <FormattedMessage defaultMessage="AWS region" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.awsRegionPopoverBody)}
            aria-label={intl.formatMessage(messages.awsRegionPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.awsRegionPopoverAria)}
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

export default awsDest;
