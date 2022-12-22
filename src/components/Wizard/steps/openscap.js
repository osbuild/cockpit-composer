/* eslint-disable no-unused-vars */
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

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
    fields: [
      {
        component: "text-field-custom",
        name: "customizations.openscap.datastream",
        className: "pf-u-w-75",
        type: "text",
        label: <FormattedMessage defaultMessage="Datastream" />,
      },
      {
        component: "text-field-custom",
        name: "customizations.openscap.profile_id",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="Profile ID" />,
      },
    ],
  };
};

export default openscap;
