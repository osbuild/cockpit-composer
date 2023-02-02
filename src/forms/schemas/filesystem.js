import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";

const messages = defineMessages({
  filesystemToggleLabel: {
    defaultMessage: "File system configurations toggle",
  },
  filesystemConfigurationLabel: {
    defaultMessage: "File system configurations",
  },
});

const filesystem = (intl) => {
  return {
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: "filesystem-info",
        label: (
          <>
            <FormattedMessage defaultMessage="Automatic partitioning is recommended for most installations." />
            <FormattedMessage defaultMessage="Alternatively, you may manually configure the file system of your image by adding, removing, and editing partitions." />
          </>
        ),
      },
      {
        component: "filesystem-toggle",
        name: "filesystem-toggle",
        label: intl.formatMessage(messages.filesystemToggleLabel),
      },
      {
        component: "filesystem-configuration",
        name: "customizations.filesystem",
        label: intl.formatMessage(messages.filesystemConfigurationLabel),
        validate: [{ type: "filesystemValidator" }],
        condition: {
          when: "filesystem-toggle",
          is: "manual",
        },
      },
    ],
  };
};

export default filesystem;
