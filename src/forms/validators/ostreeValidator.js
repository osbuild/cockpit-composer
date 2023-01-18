/* eslint-disable react/display-name */
import React from "react";
import { FormattedMessage } from "react-intl";

const OSTreeValidator = () => (value, formValues) => {
  if (!value) {
    return undefined;
  }

  if (
    formValues["image.ostree.url"]?.length > 0 &&
    formValues["image.ostree.parent"]?.length > 0
  ) {
    return (
      <FormattedMessage defaultMessage="Either the parent commit or repository url can be specified. Not both." />
    );
  }
};

export default OSTreeValidator;
