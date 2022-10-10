import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  customizationsStepsTitle: {
    id: "wizard.customizations.title",
    defaultMessage: "Customizations",
  },
  installDevicePopoverBody: {
    id: "wizard.customizations.installDevice.popoverBody",
    defaultMessage: "Specify which device the image will be installed onto.",
  },
  installDevicePopoverAria: {
    id: "wizard.customizations.installDevice.popoverAria",
    defaultMessage: "Installation Device help",
  },
});

const customizations = () => {
  const intl = useIntl();
  return {
    title: (
      <FormattedMessage
        id="wizard.customizations.systemTitle"
        defaultMessage="System"
      />
    ),
    name: "system",
    substepOf: intl.formatMessage(messages.customizationsStepsTitle),
    nextStep: "users",
    fields: [
      {
        component: "text-field-custom",
        name: "customizations-hostname",
        className: "pf-u-w-75",
        type: "text",
        label: (
          <FormattedMessage
            id="wizard.customizations.hostname.label"
            defaultMessage="Hostname"
          />
        ),
        helperText: (
          <FormattedMessage
            id="wizard.customizations.hostname.helperText"
            defaultMessage="If no hostname is provided, the hostname will be determined by the OS."
          />
        ),
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
        label: (
          <FormattedMessage
            id="wizard.customizations.installDevice.label"
            defaultMessage="Installation Device"
          />
        ),
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
          <FormattedMessage
            id="wizard.customizations.installDevice.helperText"
            defaultMessage="Enter valid device node such as /dev/sda1"
          />
        ),
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
};

export default customizations;
