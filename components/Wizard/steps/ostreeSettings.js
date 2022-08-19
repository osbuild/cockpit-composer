import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

import nextStepMapper from "./ostreeSettingsStepMapper";

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
      "Provide the ID of the latest commit in the updates repository for which this commit provides an update. " +
      "If no commit is specified it will be inferred from the parent repository.",
  },
  parentCommitPopoverAria: {
    id: "wizard.ostree.parentCommit.popoverAria",
    defaultMessage: "Parent commit help",
  },
  refPopoverBody: {
    id: "wizard.ostree.ref.popoverBody",
    defaultMessage:
      "Provide the name of the branch for the content. If the ref does not already exist it will be created.",
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

const ostreeSettings = () => {
  const intl = useIntl();
  return {
    title: <FormattedMessage id="wizard.ostree.title" defaultMessage="OSTree settings" />,
    name: "ostree-settings",
    nextStep: ({ values }) => nextStepMapper(values),
    fields: [
      {
        component: "text-field-custom",
        name: "ostree-repo-url",
        className: "pf-u-w-75",
        label: <FormattedMessage id="wizard.ostree.repoURL.label" defaultMessage="Repository URL" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.repoURLPopoverBody)}
            aria-label={intl.formatMessage(messages.repoURLPopoverAria)}
          >
            <Button variant="plain" aria-label={intl.formatMessage(messages.repoURLPopoverAria)}>
              <HelpIcon />
            </Button>
          </Popover>
        ),
        condition: {
          when: "image-output-type",
          is: ["fedora-iot-commit", "edge-commit", "edge-container", "edge-installer", "edge-simplified-installer"],
        },
        validate: [{ type: "ostreeValidator" }],
      },
      {
        component: "text-field-custom",
        name: "ostree-parent-commit",
        className: "pf-u-w-75",
        label: <FormattedMessage id="wizard.ostree.parentCommit.label" defaultMessage="Parent commit" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.parentCommitPopoverBody)}
            aria-label={intl.formatMessage(messages.parentCommitPopoverAria)}
          >
            <Button variant="plain" aria-label={intl.formatMessage(messages.parentCommitPopoverAria)}>
              <HelpIcon />
            </Button>
          </Popover>
        ),
        condition: {
          when: "image-output-type",
          is: ["fedora-iot-commit", "edge-commit", "edge-container", "edge-raw-image"],
        },
        validate: [{ type: "ostreeValidator" }],
        // eslint-disable-next-line no-unused-vars
        resolveProps: (props, { meta, input }, formOptions) => {
          if (formOptions.getState().values["image-output-type"] === "edge-raw-image") {
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
        name: "ostree-ref",
        className: "pf-u-w-75",
        label: <FormattedMessage id="wizard.ostree.ref.label" defaultMessage="Ref" />,
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.refPopoverBody)}
            aria-label={intl.formatMessage(messages.refPopoverAria)}
          >
            <Button variant="plain" aria-label={intl.formatMessage(messages.refPopoverAria)}>
              <HelpIcon />
            </Button>
          </Popover>
        ),
        helperText: intl.formatMessage(messages.refHelpText),
        condition: {
          when: "image-output-type",
          is: [
            "fedora-iot-commit",
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
