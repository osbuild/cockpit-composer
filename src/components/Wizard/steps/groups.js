import { dataTypes } from "@data-driven-forms/react-form-renderer";
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
  buttonsAdd: {
    defaultMessage: "Add group",
  },
  buttonsRemove: {
    defaultMessage: "Remove group",
  },
  buttonsRemoveAll: {
    defaultMessage: "Remove all groups",
  },
});

const groups = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Groups" />,
    name: "groups",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "sshkeys",
    fields: [
      {
        component: "field-array",
        name: "customizations.group",
        buttonLabels: {
          add: intl.formatMessage(messages.buttonsAdd),
          remove: intl.formatMessage(messages.buttonsRemove),
          removeAll: intl.formatMessage(messages.buttonsRemoveAll),
        },
        fields: [
          {
            component: "text-field-custom",
            name: "name",
            className: "pf-u-w-50",
            type: "text",
            label: <FormattedMessage defaultMessage="Group name" />,
            autoFocus: true,
          },
          {
            component: "text-field-custom",
            name: "gid",
            className: "pf-u-w-50",
            type: "integer",
            dataType: dataTypes.INTEGER,
            label: <FormattedMessage defaultMessage="Group ID" />,
          },
        ],
      },
    ],
  };
};

export default groups;
