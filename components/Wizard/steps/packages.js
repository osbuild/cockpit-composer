import React from "react";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import { Text } from "@patternfly/react-core";

export default {
  name: "packages",
  title: "Packages",
  nextStep: "review",
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: "packages-text-component",
      label: <Text>Add optional additional packages to your image by searching available packages.</Text>,
    },
    {
      component: "package-selector",
      name: "selected-packages",
      label: "Available options",
    },
  ],
};
