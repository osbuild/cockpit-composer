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
  accessKeyPopoverBody: {
    id: "wizard.aws.accessKey.popoverBody",
    defaultMessage:
      "You can create and find existing Access key IDs on the <strong>Identity and Access Management (IAM)</strong> page in the AWS console.",
  },
  accessKeyPopoverAria: {
    id: "wizard.aws.accessKey.popoverAria",
    defaultMessage: "Access key help",
  },
  secretAccessKeyPopoverBody: {
    id: "wizard.aws.secretAccessKey.popoverBody",
    defaultMessage:
      "You can view the Secret access key only when you create a new Access key ID on the " +
      "<strong>Identity and Access Management (IAM)</strong> page in the AWS console.",
  },
  secretAccessKeyPopoverAria: {
    id: "wizard.aws.secretAccessKey.popoverAria",
    defaultMessage: "Secret access key help",
  },
});

const awsAuth = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Authentication" />,
    name: "aws-auth",
    substepOf: intl.formatMessage(messages.awsStepsTitle),
    nextStep: "aws-dest",
    fields: [
      {
        component: "text-field-custom",
        name: "image.upload.settings.accessKeyID",
        className: "pf-u-w-50",
        type: "password",
        label: <FormattedMessage defaultMessage="Access key ID" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.accessKeyPopoverBody, {
              strong: (str) => <strong>{str}</strong>,
            })}
            aria-label={intl.formatMessage(messages.accessKeyPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.accessKeyPopoverAria)}
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
        name: "image.upload.settings.secretAccessKey",
        className: "pf-u-w-50",
        type: "password",
        label: <FormattedMessage defaultMessage="Secret access key" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(
              messages.secretAccessKeyPopoverBody,
              {
                strong: (str) => <strong>{str}</strong>,
              }
            )}
            aria-label={intl.formatMessage(messages.secretAccessKeyPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(
                messages.secretAccessKeyPopoverAria
              )}
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

export default awsAuth;
