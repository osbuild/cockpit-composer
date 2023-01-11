import React from "react";
import { FormattedMessage } from "react-intl";
import { dataTypes } from "@data-driven-forms/react-form-renderer";

const groups = {
  fields: [
    {
      component: "field-array",
      name: "customizations.group",
      buttonLabels: {
        add: <FormattedMessage defaultMessage="Add group" />,
        remove: <FormattedMessage defaultMessage="Remove group" />,
        removeAll: <FormattedMessage defaultMessage="Remove all groups" />,
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

export default groups;
