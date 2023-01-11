import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import servicesFields from "../schemas/services";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
});

const services = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Services" />,
    name: "services",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "firewall",
    ...servicesFields,
  };
};

export default services;
