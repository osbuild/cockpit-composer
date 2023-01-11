import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import kernelFields from "../schemas/kernel";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
});

const kernel = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Kernel" />,
    name: "kernel",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "filesystem",
    ...kernelFields,
  };
};

export default kernel;
