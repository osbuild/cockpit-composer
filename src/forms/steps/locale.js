import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import localeFields from "../schemas/locale";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
});

const firewall = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Locale" />,
    name: "locale",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "other",
    ...localeFields,
  };
};

export default firewall;
