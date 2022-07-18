import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Authentication",
  name: "aws-auth",
  substepOf: "Upload to AWS",
  nextStep: "aws-dest",
  fields: [
    {
      component: "text-field-custom",
      name: "aws-access-key",
      className: "pf-u-w-50",
      type: "password",
      label: "Access key ID",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              You can create and find existing Access key IDs on the
              <strong>Identity and Access Management (IAM)</strong>
              page in the AWS console.
            </>
          }
          aria-label="Access key help"
        >
          <Button variant="plain" aria-label="Access key help">
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
      component: "text-field-custom",
      name: "aws-secret-access-key",
      className: "pf-u-w-50",
      type: "password",
      label: "Secret access key",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              You can view the Secret access key only when you create a new Access key ID on the
              <strong>Identity and Access Management (IAM)</strong>
              page in the AWS console.
            </>
          }
          aria-label="Secret access key help"
        >
          <Button variant="plain" aria-label="Secret access key help">
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
