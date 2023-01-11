import React from "react";
import { FormattedMessage } from "react-intl";

const sshkeys = {
  fields: [
    {
      component: "field-array",
      name: "customizations.sshkey",
      buttonLabels: {
        add: <FormattedMessage defaultMessage="Add key" />,
        remove: <FormattedMessage defaultMessage="Remove key" />,
        removeAll: <FormattedMessage defaultMessage="Remove all keys" />,
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

export default sshkeys;
