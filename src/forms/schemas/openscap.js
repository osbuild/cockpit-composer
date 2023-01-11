import React from "react";
import { FormattedMessage } from "react-intl";

const openscap = {
  fields: [
    {
      component: "text-field-custom",
      name: "customizations.openscap.datastream",
      className: "pf-u-w-75",
      type: "text",
      label: <FormattedMessage defaultMessage="Datastream" />,
    },
    {
      component: "text-field-custom",
      name: "customizations.openscap.profile_id",
      className: "pf-u-w-75",
      label: <FormattedMessage defaultMessage="Profile ID" />,
    },
  ],
};

export default openscap;
