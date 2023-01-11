import React from "react";
import { FormattedMessage } from "react-intl";

const fdo = {
  fields: [
    {
      component: "text-field-custom",
      name: "customizations.fdo.manufacturing_server_url",
      className: "pf-u-w-75",
      type: "text",
      label: <FormattedMessage defaultMessage="Manufacturing server URL" />,
    },
    {
      component: "text-field-custom",
      name: "customizations.fdo.diun_pub_key_insecure",
      className: "pf-u-w-75",
      label: <FormattedMessage defaultMessage="DIUN public key insecure" />,
    },
    {
      component: "text-field-custom",
      name: "customizations.fdo.diun_pub_key_hash",
      className: "pf-u-w-75",
      label: <FormattedMessage defaultMessage="DIUN public key hash" />,
    },
    {
      component: "text-field-custom",
      name: "customizations.fdo.diun_pub_key_root_certs",
      className: "pf-u-w-75",
      label: <FormattedMessage defaultMessage="DIUN public key root certs" />,
    },
  ],
};

export default fdo;
