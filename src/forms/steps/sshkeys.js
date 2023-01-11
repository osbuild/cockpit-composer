import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import sshKeysFields from "../schemas/sshkeys";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
  buttonsAdd: {
    defaultMessage: "Add key",
  },
  buttonsRemove: {
    defaultMessage: "Remove key",
  },
  buttonsRemoveAll: {
    defaultMessage: "Remove all keys",
  },
});

const groups = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="SSH keys" />,
    name: "sshkeys",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "timezone",
    ...sshKeysFields,
  };
};

export default groups;
