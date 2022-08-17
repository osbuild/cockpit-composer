/* eslint-disable no-unused-vars */
import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Details",
  name: "details",
  nextStep: "packages",
  fields: [
    {
      component: "text-field-custom",
      name: "image-size",
      className: "pf-u-w-50",
      type: "number",
      label: "Image size",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Set the size that you want the image to be when instantiated. The total package size and target
              destination of your image should be considered when setting the image size.
            </>
          }
          aria-label="Image size help"
        >
          <Button variant="plain" aria-label="Image size help">
            <HelpIcon />
          </Button>
        </Popover>
      ),
      helperText: "Minimum image size is 2GB",
      initializeOnMount: true,
      initialValue: 2,
      isRequired: true,
      autoFocus: true,
      condition: {
        when: "image-output-type",
        is: ["fedora-iot-commit", "edge-commit", "edge-container", "edge-installer", "image-installer"],
        notMatch: true,
      },
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
        {
          type: validatorTypes.MIN_NUMBER_VALUE,
          includeThreshold: true,
          value: 2,
          message: "Minimum image size is 2GB",
        },
      ],
      resolveProps: (props, { meta, input }, formOptions) => {
        const imageType = formOptions.getState().values["image-output-type"];
        if (imageType === "ami") {
          return {
            initialValue: 6,
            helperText: "Minimum image size is 6GB",
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.MIN_NUMBER_VALUE,
                includeThreshold: true,
                value: 6,
                message: "Minimum image size is 6GB",
              },
            ],
          };
        }
        if (imageType === "edge-simplified-installer") {
          return {
            initialValue: 10,
            helperText: "Minimum image size is 10GB",
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.MIN_NUMBER_VALUE,
                includeThreshold: true,
                value: 6,
                message: "Minimum image size is 10GB",
              },
            ],
          };
        }
      },
    },
  ],
};
