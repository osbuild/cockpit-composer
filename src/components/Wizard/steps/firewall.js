import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  systemStepsTitle: {
    defaultMessage: "System",
  },
  buttonsAdd: {
    defaultMessage: "Add zone",
  },
  buttonsRemove: {
    defaultMessage: "Remove zone",
  },
  buttonsRemoveAll: {
    defaultMessage: "Remove all zones",
  },
});

const firewall = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Firewall" />,
    name: "firewall",
    substepOf: intl.formatMessage(messages.systemStepsTitle),
    nextStep: "users",
    fields: [
      {
        component: "text-input-group-with-chips",
        name: "customizations.firewall.ports",
        label: <FormattedMessage defaultMessage="Ports" />,
        className: "pf-u-w-75",
      },
      {
        component: "text-input-group-with-chips",
        name: "customizations.firewall.services.enabled",
        label: <FormattedMessage defaultMessage="Enabled services" />,
        className: "pf-u-w-75",
      },
      {
        component: "text-input-group-with-chips",
        name: "customizations.firewall.services.disabled",
        label: <FormattedMessage defaultMessage="Disabled services" />,
        className: "pf-u-w-75",
      },
      {
        component: "field-array",
        name: "customizations.firewall.zones",
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
            label: <FormattedMessage defaultMessage="Zone name" />,
          },
          {
            component: "text-input-group-with-chips",
            name: "sources",
            label: <FormattedMessage defaultMessage="Zone sources" />,
            className: "pf-u-w-75",
          },
        ],
      },
    ],
  };
};

export default firewall;
