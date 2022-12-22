import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
});

const firewall = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Timezone" />,
    name: "timezone",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "locale",
    fields: [
      {
        component: "text-field-custom",
        name: "customizations.timezone.timezone",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Timezone" />,
      },
      {
        component: "text-input-group-with-chips",
        name: "customizations.timezone.ntpservers",
        label: <FormattedMessage defaultMessage="NTP servers" />,
        className: "pf-u-w-75",
      },
    ],
  };
};

export default firewall;
