import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";

const messages = defineMessages({
  vmwareStepsTitle: {
    defaultMessage: "Upload to VMware",
  },
});

const vmwareAuth = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Authentication" />,
    name: "vmware-auth",
    substepOf: intl.formatMessage(messages.vmwareStepsTitle),
    nextStep: "vmware-dest",
    fields: [
      {
        component: "text-field-custom",
        name: "image.upload.settings.username",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Username" />,
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
        name: "image.upload.settings.password",
        className: "pf-u-w-50",
        type: "password",
        label: <FormattedMessage defaultMessage="Password" />,
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

export default vmwareAuth;
