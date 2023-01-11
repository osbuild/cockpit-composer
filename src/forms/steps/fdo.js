/* eslint-disable no-unused-vars */
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import fdoFields from "../schemas/fdo";

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
    nextStep: "openscap",
    ...fdoFields,
  };
};

export default fdo;
