import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  customizationsStepsTitle: {
    id: "wizard.customizations.title",
    defaultMessage: "Customizations",
  },
});

const fdo = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="FIDO device onboarding" />,
    name: "fdo",
    substepOf: intl.formatMessage(messages.customizationsStepsTitle),
    nextStep: "system",
    fields: [
      {
        component: "text-field-custom",
        name: "customizations-manufacturing-server-url",
        className: "pf-u-w-75",
        type: "text",
        label: <FormattedMessage defaultMessage="Manufacturing server URL" />,
      },
      {
        component: "text-field-custom",
        name: "customizations-diun-pub-key-insecure",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="DIUN public key insecure" />,
      },
      {
        component: "text-field-custom",
        name: "customizations-diun-pub-key-hash",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="DIUN public key hash" />,
      },
      {
        component: "text-field-custom",
        name: "customizations-diun-pub-key-root-certs",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="DIUN public key root certs" />,
      },
    ],
  };
};

export default fdo;
