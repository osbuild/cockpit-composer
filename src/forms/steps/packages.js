import React from "react";
import { FormattedMessage } from "react-intl";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";

const packages = () => {
  return {
    name: "packages",
    title: (
      <FormattedMessage id="wizard.packages.title" defaultMessage="Packages" />
    ),
    nextStep: "kernel",
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: "packages-text-component",
        label: (
          <FormattedMessage
            id="wizard.packages.info"
            defaultMessage="Add optional additional packages to your image by searching available packages."
          />
        ),
      },
      {
        component: "package-selector",
        name: "selected-packages",
        label: (
          <FormattedMessage
            id="wizard.packages.selectedPackages"
            defaultMessage="Selected packages"
          />
        ),
      },
    ],
  };
};

export default packages;
