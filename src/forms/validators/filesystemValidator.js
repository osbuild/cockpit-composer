/* eslint-disable react/display-name */
import React from "react";
import { FormattedMessage } from "react-intl";

// contains duplicate mp or no root (/) mp
const filesystemValidator = () => (fsc) => {
  if (!fsc) {
    return undefined;
  }
  const mountpoints = fsc.map((fs) => fs.mountpoint);

  if (!mountpoints.length) {
    return (
      <FormattedMessage defaultMessage="File system configuration is required." />
    );
  }

  const uniqueMountpoints = new Set(mountpoints);
  const hasDuplicates = mountpoints.length !== uniqueMountpoints.size;
  if (hasDuplicates) {
    return (
      <FormattedMessage defaultMessage="File system configuration must not contain duplicate mount points." />
    );
  }

  const hasRoot = mountpoints.includes("/");
  if (!hasRoot) {
    return (
      <FormattedMessage defaultMessage="File system configuration must contain a root (/) partition." />
    );
  }
};

export default filesystemValidator;
