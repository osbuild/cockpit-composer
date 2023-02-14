import React from "react";
import { FormattedMessage } from "react-intl";

const ignition = {
  fields: [
    {
      component: "text-field-custom",
      name: "customizations.ignition.firstboot.url",
      className: "pf-u-w-75",
      type: "text",
      label: <FormattedMessage defaultMessage="Firstboot URL" />,
    },
  ],
};
export default ignition;
