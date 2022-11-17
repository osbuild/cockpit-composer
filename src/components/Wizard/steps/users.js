import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  customizationsStepsTitle: {
    id: "wizard.customizations.title",
    defaultMessage: "Customizations",
  },
  buttonsAdd: {
    id: "wizard.customizations.buttons.add",
    defaultMessage: "Add user",
  },
  buttonsRemove: {
    id: "wizard.customizations.buttons.remove",
    defaultMessage: "Remove user",
  },
  buttonsRemoveAll: {
    id: "wizard.customizations.buttons.removeAll",
    defaultMessage: "Remove all users",
  },
});

const users = (intl) => {
  return {
    title: (
      <FormattedMessage
        id="wizard.customizations.usersTitle"
        defaultMessage="Users"
      />
    ),
    name: "users",
    substepOf: intl.formatMessage(messages.customizationsStepsTitle),
    nextStep: "packages",
    fields: [
      {
        component: "field-array",
        name: "customizations-users",
        buttonLabels: {
          add: intl.formatMessage(messages.buttonsAdd),
          remove: intl.formatMessage(messages.buttonsRemove),
          removeAll: intl.formatMessage(messages.buttonsRemoveAll),
        },
        fields: [
          {
            component: "text-field-custom",
            name: "username",
            className: "pf-u-w-50",
            type: "text",
            label: (
              <FormattedMessage
                id="wizard.customizations.username.label"
                defaultMessage="Username"
              />
            ),
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
            label: (
              <FormattedMessage
                id="wizard.customizations.password.label"
                defaultMessage="Password"
              />
            ),
          },
          {
            component: "textarea",
            name: "ssh-key",
            className: "pf-u-w-50 pf-u-h-25vh",
            type: "text",
            label: (
              <FormattedMessage
                id="wizard.customizations.sshKey.label"
                defaultMessage="SSH key"
              />
            ),
          },
          {
            component: "checkbox",
            name: "is-admin",
            className: "pf-u-w-50",
            type: "text",
            label: (
              <FormattedMessage
                id="wizard.customizations.serverAdmin.label"
                defaultMessage="Server administrator"
              />
            ),
          },
        ],
      },
    ],
  };
};

export default users;
