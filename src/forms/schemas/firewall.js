import React from "react";
import { FormattedMessage } from "react-intl";

const firewall = {
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
        add: <FormattedMessage defaultMessage="Add zone" />,
        remove: <FormattedMessage defaultMessage="Remove zone" />,
        removeAll: <FormattedMessage defaultMessage="Remove all zones" />,
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

export default firewall;
