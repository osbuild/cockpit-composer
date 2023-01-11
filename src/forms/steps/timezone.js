import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import timezoneFields from "../schemas/timezone";

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
    ...timezoneFields,
  };
};

export default firewall;
