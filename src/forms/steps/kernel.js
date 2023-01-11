import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

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
    fields: [
      {
        component: "text-field-custom",
        name: "customizations.kernel.append",
        className: "pf-u-w-75",
        type: "text",
        label: <FormattedMessage defaultMessage="Append" />,
        helperText: (
          <FormattedMessage defaultMessage="Enter kernel commandline arguments." />
        ),
      },
      {
        component: "text-field-custom",
        name: "customizations.kernel.name",
        className: "pf-u-w-75",
        type: "text",
        label: <FormattedMessage defaultMessage="Name" />,
        helperText: <FormattedMessage defaultMessage="Enter kernel name." />,
      },
    ],
  };
};

export default kernel;
