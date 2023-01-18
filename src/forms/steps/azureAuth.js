import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  azureStepsTitle: {
    id: "wizard.azure.title",
    defaultMessage: "Upload to Azure",
  },
  storageAccountPopoverBody: {
    id: "wizard.azure.storageAccount.popoverBody",
    defaultMessage:
      "Provide the name of a storage account. You can find storage accounts on the " +
      "<strong>Storage accounts</strong> page in the Azure portal.",
  },
  storageAccountPopoverAria: {
    id: "wizard.azure.storageAccount.popoverAria",
    defaultMessage: "Storage account help",
  },
  storageAccessKeyPopoverBody: {
    id: "wizard.azure.storageAccessKey.popoverBody",
    defaultMessage:
      "Provide the access key for the desired storage account. You can find the access key on the " +
      "<strong>Access keys</strong> page of the storage account. You can find storage accounts on the " +
      "<strong>Storage accounts</strong> page in the Azure portal.",
  },
  storageAccessKeyPopoverAria: {
    id: "wizard.azure.storageAccessKey.popoverAria",
    defaultMessage: "Storage access key help",
  },
});

const azureAuth = (intl) => {
  return {
    title: (
      <FormattedMessage
        id="wizard.azure.authTitle"
        defaultMessage="Authentication"
      />
    ),
    name: "azure-auth",
    substepOf: intl.formatMessage(messages.azureStepsTitle),
    nextStep: "azure-dest",
    fields: [
      {
        component: "text-field-custom",
        name: "image.upload.settings.storageAccount",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Storage account" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(
              messages.storageAccountPopoverBody,
              {
                strong: (str) => <strong>{str}</strong>,
              }
            )}
            aria-label={intl.formatMessage(messages.storageAccountPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(
                messages.storageAccountPopoverAria
              )}
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
        name: "image.upload.settings.storageAccessKey",
        className: "pf-u-w-50",
        type: "password",
        label: <FormattedMessage defaultMessage="Storage access key" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(
              messages.storageAccessKeyPopoverBody,
              {
                strong: (str) => <strong>{str}</strong>,
              }
            )}
            aria-label={intl.formatMessage(
              messages.storageAccessKeyPopoverAria
            )}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(
                messages.storageAccessKeyPopoverAria
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

export default azureAuth;
