/* eslint-disable no-unused-vars */
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  repoURLPopoverBody: {
    id: "wizard.ostree.repoURL.popoverBody",
    defaultMessage:
      "Provide the URL of the upstream repository. This repository is where the parent OSTree commit will be pulled from.",
  },
  repoURLPopoverAria: {
    id: "wizard.ostree.repoURL.popoverAria",
    defaultMessage: "Repository URL help",
  },
  parentCommitPopoverBody: {
    id: "wizard.ostree.parentCommit.popoverBody",
    defaultMessage:
      "Provide the commit id or ref of the parent in the repository for which this commit provides an update. " +
      "If no parent is specified it will be inferred from the user-defined ref.",
  },
  parentCommitPopoverAria: {
    id: "wizard.ostree.parentCommit.popoverAria",
    defaultMessage: "Parent help",
  },
  refPopoverBody: {
    id: "wizard.ostree.ref.popoverBody",
    defaultMessage:
      "Provide the name of the branch for the content. If the ref does not already exist it will be created. If the ref is not specified, the default ref for the distro will be used.",
  },
  refPopoverAria: {
    id: "wizard.ostree.ref.popoverAria",
    defaultMessage: "Ref help",
  },
  refHelpText: {
    id: "wizard.ostree.ref.helpText",
    defaultMessage:
      "Valid characters for ref are letters from a to z, the digits from 0 to 9, the hyphen (-), the underscore (_), the period (.), and the forward slash (/). A ref must start with a letter, a number, or an underscore. Slashes must also be followed by a letter or number.",
  },
});

const ostreeSettings = (intl) => {
  return {
    title: (
      <FormattedMessage
        id="wizard.ostree.title"
        defaultMessage="OSTree settings"
      />
    ),
    name: "ostree-settings",
    nextStep: "review-image",
    fields: [
      {
        component: "text-field-custom",
        name: "image.ostree.url",
        className: "pf-u-w-75",
        label: (
          <FormattedMessage
            id="wizard.ostree.repoURL.label"
            defaultMessage="Repository URL"
          />
        ),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.repoURLPopoverBody)}
            aria-label={intl.formatMessage(messages.repoURLPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.repoURLPopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        condition: {
          when: "image.type",
          is: [
            "iot-commit",
            "edge-commit",
            "edge-container",
            "edge-raw-image",
            "edge-installer",
            "edge-simplified-installer",
          ],
        },
        resolveProps: (props, { meta, input }, formOptions) => {
          const imageType = formOptions.getState().values["image.type"];
          if (
            imageType === "edge-raw-image" ||
            imageType === "edge-installer" ||
            imageType === "edge-simplified-installer"
          ) {
            return {
              isRequired: true,
              validate: [
                {
                  type: validatorTypes.REQUIRED,
                },
              ],
            };
          }
        },
      },
      {
        component: "text-field-custom",
        name: "image.ostree.parent",
        className: "pf-u-w-75",
        label: (
          <FormattedMessage
            id="wizard.ostree.parentCommit.label"
            defaultMessage="Parent"
          />
        ),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.parentCommitPopoverBody)}
            aria-label={intl.formatMessage(messages.parentCommitPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.parentCommitPopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        condition: {
          when: "image.type",
          is: ["iot-commit", "edge-commit", "edge-container"],
        },
      },
      {
        component: "text-field-custom",
        name: "image.ostree.ref",
        className: "pf-u-w-75",
        label: (
          <FormattedMessage id="wizard.ostree.ref.label" defaultMessage="Ref" />
        ),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.refPopoverBody)}
            aria-label={intl.formatMessage(messages.refPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.refPopoverAria)}
            >
              <HelpIcon />
            </Button>
          </Popover>
        ),
        helperText: intl.formatMessage(messages.refHelpText),
        condition: {
          when: "image.type",
          is: [
            "iot-commit",
            "edge-commit",
            "edge-container",
            "edge-installer",
            "edge-raw-image",
            "edge-simplified-installer",
          ],
        },
        validate: [
          {
            type: validatorTypes.PATTERN,
            pattern: /^(?:[\w\d][-._\w\d]*\/)*[\w\d][-._\w\d]*$/i,
            message: intl.formatMessage(messages.refHelpText),
          },
        ],
      },
    ],
  };
};

export default ostreeSettings;
