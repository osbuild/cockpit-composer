/* eslint-disable no-unused-vars */
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import openscapFields from "../schemas/openscap";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
});

const openscap = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="OpenSCAP" />,
    name: "openscap",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "ignition",
    ...openscapFields,
  };
};

export default openscap;
