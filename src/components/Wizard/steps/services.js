import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  systemStepsTitle: {
    defaultMessage: "System",
  },
});

const services = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Services" />,
    name: "services",
    substepOf: intl.formatMessage(messages.systemStepsTitle),
    nextStep: "firewall",
    fields: [
      {
        component: "text-input-group-with-chips",
        name: "customizations.services.enabled",
        label: <FormattedMessage defaultMessage="Enabled services" />,
        className: "pf-u-w-75",
      },
      {
        component: "text-input-group-with-chips",
        name: "customizations.services.disabled",
        label: <FormattedMessage defaultMessage="Disabled services" />,
        className: "pf-u-w-75",
      },
    ],
  };
};

export default services;
