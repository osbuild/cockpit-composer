/* eslint-disable react/display-name */
import React from "react";
import { FormattedMessage } from "react-intl";

const OSTreeValidator = () => (value, formValues) => {
  if (!value) {
    return undefined;
  }

  if (formValues["ostree-repo-url"]?.length > 0 && formValues["ostree-parent-commit"]?.length > 0) {
    return (
      <FormattedMessage
        id="wizard.ostree.validationError"
        defaultMessage="Either the parent commit or repository url can be specified. Not both."
      />
    );
  }
};

export default OSTreeValidator;
