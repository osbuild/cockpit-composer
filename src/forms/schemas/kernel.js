import React from "react";
import { FormattedMessage } from "react-intl";

const kernel = {
  fields: [
    {
      component: "text-field-custom",
      name: "customizations.kernel.name",
      className: "pf-u-w-75",
      type: "text",
      label: <FormattedMessage defaultMessage="Name" />,
      helperText: <FormattedMessage defaultMessage="Enter kernel name." />,
    },
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
  ],
};

export default kernel;
