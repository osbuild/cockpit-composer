import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  personalStepsTitle: {
    defaultMessage: "Personal",
  },
  buttonsAdd: {
    defaultMessage: "Add key",
  },
  buttonsRemove: {
    defaultMessage: "Remove key",
  },
  buttonsRemoveAll: {
    defaultMessage: "Remove all keys",
  },
});

const groups = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="SSH keys" />,
    name: "sshkeys",
    substepOf: intl.formatMessage(messages.personalStepsTitle),
    nextStep: "timezone",
    fields: [
      {
        component: "field-array",
        name: "customizations.sshkey",
        buttonLabels: {
          add: intl.formatMessage(messages.buttonsAdd),
          remove: intl.formatMessage(messages.buttonsRemove),
          removeAll: intl.formatMessage(messages.buttonsRemoveAll),
        },
        fields: [
          {
            component: "text-field-custom",
            name: "key",
            className: "pf-u-w-50",
            type: "text",
            label: <FormattedMessage defaultMessage="Key" />,
            autoFocus: true,
          },
          {
            component: "text-field-custom",
            name: "user",
            className: "pf-u-w-50",
            type: "text",
            label: <FormattedMessage defaultMessage="User" />,
          },
        ],
      },
    ],
  };
};

export default groups;
