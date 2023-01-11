import React from "react";
import { FormattedMessage } from "react-intl";

const timezone = {
  fields: [
    {
      component: "text-field-custom",
      name: "customizations.timezone.timezone",
      className: "pf-u-w-50",
      type: "text",
      label: <FormattedMessage defaultMessage="Timezone" />,
    },
    {
      component: "text-input-group-with-chips",
      name: "customizations.timezone.ntpservers",
      label: <FormattedMessage defaultMessage="NTP servers" />,
      className: "pf-u-w-75",
    },
  ],
};

export default timezone;
