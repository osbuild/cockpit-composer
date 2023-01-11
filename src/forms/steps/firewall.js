import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import firewallFields from "../schemas/firewall";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
  buttonsAdd: {
    defaultMessage: "Add zone",
  },
  buttonsRemove: {
    defaultMessage: "Remove zone",
  },
  buttonsRemoveAll: {
    defaultMessage: "Remove all zones",
  },
});

const firewall = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Firewall" />,
    name: "firewall",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "users",
    ...firewallFields,
  };
};

export default firewall;
