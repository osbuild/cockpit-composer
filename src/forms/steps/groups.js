import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import groupsFields from "../schemas/groups";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
});

const groups = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Groups" />,
    name: "groups",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "sshkeys",
    ...groupsFields,
  };
};

export default groups;
