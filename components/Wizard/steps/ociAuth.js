import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Authentication",
  name: "oci-auth",
  substepOf: "Upload to OCI",
  nextStep: "oci-dest",
  fields: [
    {
      component: "text-field-custom",
      name: "oci-user-ocid",
      className: "pf-u-w-50",
      type: "text",
      label: "User OCID",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              You can find your user OCID <strong>Identity and Access Management (IAM)</strong>
              page in the OCI console.
            </>
          }
          aria-label="User ocid help"
        >
          <Button variant="plain" aria-label="User ocid help">
            <HelpIcon />
          </Button>
        </Popover>
      ),
      isRequired: true,
      autoFocus: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
    },
    {
      component: "upload-file",
      name: "oci-private-key",
      label: "Private key",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              You can view your deployed RSA keys in the API Keys section on the{" "}
              <strong>Identity and Access Management (IAM)</strong>
              page in the OCI console.
            </>
          }
          aria-label="Private key help"
        >
          <Button variant="plain" aria-label="Private key help">
            <HelpIcon />
          </Button>
        </Popover>
      ),
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
    },
    {
      component: "text-field",
      name: "oci-private-key-filename",
      hideField: true,
    },
    {
      component: "text-field-custom",
      name: "oci-fingerprint",
      className: "pf-u-w-50",
      type: "text",
      label: "Fingerprint",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              You can view your deployed RSA keys fingerprint in the API Keys section on the
              <strong>Identity and Access Management (IAM)</strong> page in the OCI console.
            </>
          }
          aria-label="Fingerprint help"
        >
          <Button variant="plain" aria-label="Fingerprint help">
            <HelpIcon />
          </Button>
        </Popover>
      ),
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
    },
  ],
};
