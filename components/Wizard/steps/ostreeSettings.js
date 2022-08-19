import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "OSTree settings",
  name: "ostree-settings",
  nextStep: "system",
  fields: [
    {
      component: "text-field-custom",
      name: "ostree-repo-url",
      className: "pf-u-w-75",
      label: "Repository URL",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the URL of the upstream repository. This repository is where the parent OSTree commit will be
              pulled from.
            </>
          }
          aria-label="Repository URL help"
        >
          <Button variant="plain" aria-label="Repository URL help">
            <HelpIcon />
          </Button>
        </Popover>
      ),
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
      name: "ostree-parent-commit",
      className: "pf-u-w-75",
      label: "Parent commit",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the ID of the latest commit in the updates repository for which this commit provides an update. If
              no commit is specified it will be inferred from the parent repository.{" "}
            </>
          }
          aria-label="Parent commit help"
        >
          <Button variant="plain" aria-label="Parent commit help">
            <HelpIcon />
          </Button>
        </Popover>
      ),
      condition: {
        when: "image-output-type",
        is: ["fedora-iot-commit", "edge-commit", "edge-container"],
      },
      validate: [{ type: "ostreeValidator" }],
    },
    {
      component: "text-field-custom",
      name: "ostree-ref",
      className: "pf-u-w-75",
      label: "Ref",
      labelIcon: (
        <Popover
          bodyContent={
            <>Provide the name of the branch for the content. If the ref does not already exist it will be created.</>
          }
          aria-label="Ref help"
        >
          <Button variant="plain" aria-label="Ref help">
            <HelpIcon />
          </Button>
        </Popover>
      ),
      helperText:
        "Valid characters for ref are letters from a to z, the digits from 0 to 9, the hyphen (-), the underscore (_), the period (.), and the forward slash (/). A ref must start with a letter, a number, or an underscore. Slashes must also be followed by a letter or number.",
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
          message:
            "Valid characters for ref are letters from a to z, the digits from 0 to 9, the hyphen (-), the underscore (_), the period (.), and the forward slash (/). A ref must start with a letter, a number, or an underscore. Slashes must also be followed by a letter or number.",
        },
      ],
    },
  ],
};
