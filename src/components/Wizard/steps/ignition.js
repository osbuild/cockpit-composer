/* eslint-disable no-unused-vars */
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  customizationsStepsTitle: {
    id: "wizard.customizations.title",
    defaultMessage: "Customizations",
  },
});

const ignition = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Ignition" />,
    name: "ignition",
    nextStep: "review",
    fields: [
      {
        component: "text-field-custom",
        name: "customizations.ignition.firstboot.url",
        className: "pf-u-w-75",
        type: "text",
        label: <FormattedMessage defaultMessage="Firstboot URL" />,
      },
      {
        component: "text-field-custom",
        name: "customizations.ignition.embedded.url",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="Embedded URL" />,
      },
      {
        component: "upload-file",
        name: "customizations.ignition.embedded.data",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="Embedded Data" />,
      },
    ],
  };
};

export default ignition;
