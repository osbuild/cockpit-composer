/* eslint-disable react/display-name */
import React from "react";
import { FormattedMessage } from "react-intl";

const hostnameValidator = () => (value) => {
  if (!value) {
    return undefined;
  }

  // https://man7.org/linux/man-pages/man7/hostname.7.html
  const regexHostname = /^[a-zA-Z0-9.][a-zA-Z0-9.-]{0,252}$/;
  const validHostname = regexHostname.test(value);
  const validSplitLengths = value
    .split(".")
    .every((element) => element.length > 0 && element.length < 64);
  if (!validHostname || !validSplitLengths) {
    return (
      <FormattedMessage
        id="wizard.customizations.hostname.validationError"
        defaultMessage="Valid characters are letters from a to z, the digits from 0 to 9, and the hyphen (-). 
                        A hostname may not start with a hyphen. Each element of the hostname must be from 1 to 63 characters long 
                        and the entire hostname can be at most 253 characters long."
      />
    );
  }
};

export default hostnameValidator;
