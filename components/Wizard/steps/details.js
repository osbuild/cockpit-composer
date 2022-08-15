import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Details",
  name: "details",
  substepOf: "Customizations",
  nextStep: "users",
  fields: [
    {
      component: "text-field-custom",
      name: "customizations-hostname",
      className: "pf-u-w-75",
      type: "text",
      label: "Hostname",
      helperText: "If no hostname is provided, the hostname will be determined by the OS.",
      validate: [
        {
          type: "hostnameValidator",
        },
      ],
    },
    {
      component: "text-field-custom",
      name: "customizations-install-device",
      className: "pf-u-w-75",
      label: "Installation device",
      labelIcon: (
        <Popover bodyContent="Specify which device the image will be installed onto." aria-label="Ref help">
          <Button variant="plain" aria-label="Ref help">
            <HelpIcon />
          </Button>
        </Popover>
      ),
      helperText: "Enter valid device node such as /dev/sda1",
      isRequired: true,
      condition: {
        when: "image-output-type",
        is: ["edge-simplified-installer"],
      },
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
    },
  ],
};
