import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
  buttonsAdd: {
    defaultMessage: "Add user",
  },
  buttonsRemove: {
    defaultMessage: "Remove user",
  },
  buttonsRemoveAll: {
    defaultMessage: "Remove all users",
  },
});

const users = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Users" />,
    name: "users",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "groups",
    fields: [
      {
        component: "field-array",
        name: "customizations.user",
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
            label: <FormattedMessage defaultMessage="Username" />,
            isRequired: true,
            autoFocus: true,
            validate: [
              {
                type: "required",
              },
            ],
          },
          {
            component: "text-field-custom",
            name: "password",
            className: "pf-u-w-50",
            type: "password",
            label: <FormattedMessage defaultMessage="Password" />,
          },
          {
            component: "textarea",
            name: "key",
            className: "pf-u-w-50 pf-u-h-25vh",
            type: "text",
            label: <FormattedMessage defaultMessage="SSH key" />,
          },
          {
            component: "checkbox",
            name: "isAdmin",
            className: "pf-u-w-50",
            type: "text",
            label: <FormattedMessage defaultMessage="Server administrator" />,
          },
        ],
      },
    ],
  };
};

export default users;
