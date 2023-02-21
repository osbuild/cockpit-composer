/* eslint-disable no-unused-vars */
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import ignitionFields from "../schemas/ignition";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
});

const ignition = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Ignition" />,
    name: "ignition",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "review-blueprint",
    ...ignitionFields,
  };
};

export default ignition;
