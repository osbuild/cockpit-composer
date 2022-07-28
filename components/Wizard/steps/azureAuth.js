import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Authentication",
  name: "azure-auth",
  substepOf: "Upload to Azure",
  nextStep: "azure-dest",
  fields: [
    {
      component: "text-field-custom",
      name: "azure-storage-account",
      className: "pf-u-w-50",
      type: "text",
      label: "Storage account",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the name of a storage account. You can find storage accounts on the
              <strong>Storage accounts</strong> page in the Azure portal.
            </>
          }
          aria-label="Storage account help"
        >
          <Button variant="plain" aria-label="Storage account help">
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
      name: "azure-storage-access-key",
      className: "pf-u-w-50",
      type: "password",
      label: "Storage access key",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the access key for the desired storage account. You can find the access key on the
              <strong>Access keys</strong> page of the storage account. You can find storage accounts on the
              <strong>Storage accounts</strong> page in the Azure portal.
            </>
          }
          aria-label="Storage access key help"
        >
          <Button variant="plain" aria-label="Storage access key help">
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
