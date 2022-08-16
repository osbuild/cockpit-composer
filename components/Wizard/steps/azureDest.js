import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Destination",
  name: "azure-dest",
  substepOf: "Upload to Azure",
  nextStep: "customizations",
  fields: [
    {
      component: "text-field-custom",
      name: "azure-image-name",
      className: "pf-u-w-50",
      type: "text",
      label: "Image name",
      labelIcon: (
        <Popover
          bodyContent={<>Provide a file name to be used for the image file that will be uploaded.</>}
          aria-label="Image name help"
        >
          <Button variant="plain" aria-label="Image name help">
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
      name: "azure-storage-container",
      className: "pf-u-w-50",
      type: "text",
      label: "Storage container",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the Blob container to which the image file will be uploaded. You can find containers under the
              <strong>Blob service</strong> section of a storage account. You can find storage accounts on the
              <strong>Storage accounts</strong> page in the Azure portal.
            </>
          }
          aria-label="Storage container help"
        >
          <Button variant="plain" aria-label="Storage container help">
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
