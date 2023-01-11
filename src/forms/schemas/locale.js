import React from "react";
import { FormattedMessage } from "react-intl";

const locale = {
  fields: [
    {
      component: "text-field-custom",
      name: "customizations.locale.keyboard",
      className: "pf-u-w-50",
      type: "text",
      label: <FormattedMessage defaultMessage="Keyboard" />,
    },
    {
      component: "text-input-group-with-chips",
      name: "customizations.locale.languages",
      label: <FormattedMessage defaultMessage="Languages" />,
      className: "pf-u-w-75",
    },
  ],
};

export default locale;
