import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import otherFields from "../schemas/other";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
  installDevicePopoverBody: {
    defaultMessage: "Specify which device the image will be installed onto.",
  },
  installDevicePopoverAria: {
    defaultMessage: "Installation Device help",
  },
});

const other = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Other" />,
    name: "other",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "fdo",
    ...otherFields(intl),
  };
};

export default other;
