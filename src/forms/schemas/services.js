import React from "react";
import { FormattedMessage } from "react-intl";

const services = {
  fields: [
    {
      component: "text-input-group-with-chips",
      name: "customizations.services.enabled",
      label: <FormattedMessage defaultMessage="Enabled services" />,
      className: "pf-u-w-75",
    },
    {
      component: "text-input-group-with-chips",
      name: "customizations.services.disabled",
      label: <FormattedMessage defaultMessage="Disabled services" />,
      className: "pf-u-w-75",
    },
  ],
};

export default services;
