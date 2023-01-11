import React from "react";

import FileSystemConfigButtons from "../components/FileSystemConfigButtons";
import { FormattedMessage, defineMessages } from "react-intl";
import filesystemFields from "../schemas/filesystem";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
});

const filesystem = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="File system" />,
    name: "filesystem",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    buttons: FileSystemConfigButtons,
    nextStep: "services",
    ...filesystemFields(intl),
  };
};

export default filesystem;
