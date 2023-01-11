import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  customizationsStepTitle: {
    defaultMessage: "Customizations",
  },
  installDevicePopoverBody: {
    defaultMessage: "Specify which device the image will be installed onto.",
  },
  installDevicePopoverAria: {
    defaultMessage: "Installation Device help",
  },
});

const other = (intl) => {
  return {
    title: <FormattedMessage defaultMessage="Other" />,
    name: "other",
    substepOf: intl.formatMessage(messages.customizationsStepTitle),
    nextStep: "fdo",
    fields: [
      {
        component: "text-field-custom",
        name: "customizations.hostname",
        className: "pf-u-w-75",
        type: "text",
        label: <FormattedMessage defaultMessage="Hostname" />,
        helperText: (
          <FormattedMessage defaultMessage="If no hostname is provided, the hostname will be determined by the OS." />
        ),
      },
      {
        component: "text-field-custom",
        name: "customizations.installation_device",
        className: "pf-u-w-75",
        label: <FormattedMessage defaultMessage="Installation Device" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.installDevicePopoverBody)}
            aria-label={intl.formatMessage(messages.installDevicePopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.installDevicePopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        helperText: (
          <FormattedMessage defaultMessage="Enter valid device node such as /dev/sda1. Only used for the simplified-installer image type." />
        ),
      },
    ],
  };
};

export default other;
