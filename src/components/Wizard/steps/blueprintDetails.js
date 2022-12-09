import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  blueprintDetailsStep: {
    defaultMessage: "Details",
  },
});

const blueprintDetails = (intl) => {
  return {
    id: "wizard-image-output",
    title: intl.formatMessage(messages.blueprintDetailsStep),
    name: "blueprint-details",
    nextStep: "packages",
    fields: [
      {
        component: "text-field-custom",
        name: "blueprint.name",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="Name" />,
      },
      {
        component: "text-field-custom",
        name: "blueprint.description",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="Description" />,
      },
    ],
  };
};

export default blueprintDetails;
