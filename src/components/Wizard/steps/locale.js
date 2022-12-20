import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  personalStepsTitle: {
    defaultMessage: "Personal",
  },
});

const firewall = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Locale" />,
    name: "locale",
    substepOf: intl.formatMessage(messages.personalStepsTitle),
    nextStep: "other",
    fields: [
      {
        component: "text-field-custom",
        name: "customizations.locale.keyboard",
        className: "pf-u-w-50",
        type: "text",
        label: <FormattedMessage defaultMessage="Keyboard" />,
      },
      {
        component: "text-input-group-with-chips",
        name: "customizations.locale.languages",
        label: <FormattedMessage defaultMessage="Languages" />,
        className: "pf-u-w-75",
      },
    ],
  };
};

export default firewall;
