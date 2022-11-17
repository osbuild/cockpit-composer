import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";

const messages = defineMessages({
  vmwareStepsTitle: {
    id: "wizard.vmware.title",
    defaultMessage: "Upload to VMWare",
  },
});

const vmwareAuth = (intl) => {
  return {
    title: (
      <FormattedMessage
        id="wizard.vmware.authTitle"
        defaultMessage="Authentication"
      />
    ),
    name: "vmware-auth",
    substepOf: intl.formatMessage(messages.vmwareStepsTitle),
    nextStep: "vmware-dest",
    fields: [
      {
        component: "text-field-custom",
        name: "vmware-username",
        className: "pf-u-w-50",
        type: "text",
        label: (
          <FormattedMessage
            id="wizard.vmware.username.label"
            defaultMessage="Username"
          />
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
        name: "vmware-password",
        className: "pf-u-w-50",
        type: "password",
        label: (
          <FormattedMessage
            id="wizard.vmware.password.label"
            defaultMessage="Password"
          />
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

export default vmwareAuth;
