import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Destination",
  name: "aws-dest",
  substepOf: "Upload to AWS",
  nextStep: "details",
  fields: [
    {
      component: "text-field-custom",
      name: "aws-image-name",
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
      name: "aws-s3-bucket",
      className: "pf-u-w-50",
      type: "text",
      label: "Amazon S3 bucket",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the S3 bucket name to which the image file will be uploaded before being imported into EC2. The
              bucket must already exist in the Region where you want to import your image. You can find a list of
              buckets on the <strong>S3 buckets</strong> page in the Amazon S3 storage service in the AWS console.
            </>
          }
          aria-label="S3 bucket help"
        >
          <Button variant="plain" aria-label="S3 bucket help">
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
    {
      component: "text-field-custom",
      name: "aws-region",
      className: "pf-u-w-50",
      type: "text",
      label: "AWS region",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the AWS Region where you want to import your image. This must be the same region where the S3
              bucket exists.
            </>
          }
          aria-label="Region help"
        >
          <Button variant="plain" aria-label="Region help">
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
