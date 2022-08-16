import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Destination",
  name: "oci-dest",
  substepOf: "Upload to OCI",
  nextStep: "customizations",
  fields: [
    {
      component: "text-field-custom",
      name: "oci-image-name",
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
      name: "oci-bucket",
      className: "pf-u-w-50",
      type: "text",
      label: "OCI bucket",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the bucket name to which the image file will be uploaded before being imported as a custom image.
              The bucket must already exist in the Region where you want to import your image. You can find a list of
              buckets on the OCI buckets page in the OCI storage service in the OCI console.
            </>
          }
          aria-label="OCI bucket help"
        >
          <Button variant="plain" aria-label="OCI bucket help">
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
      name: "oci-bucket-namespace",
      className: "pf-u-w-50",
      type: "text",
      label: "Bucket namespace",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the namespace of the OCI bucket your uploading to. You can find the namespace in the bucket
              details.
            </>
          }
          aria-label="Bucket namespace help"
        >
          <Button variant="plain" aria-label="Bucket namespace help">
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
      name: "oci-bucket-region",
      className: "pf-u-w-50",
      type: "text",
      label: "Bucket region",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the region of the Bucket region your uploading to. You can find the region in the bucket details.
            </>
          }
          aria-label="Bucket region help"
        >
          <Button variant="plain" aria-label="Bucket region help">
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
      name: "oci-bucket-compartment",
      className: "pf-u-w-50",
      type: "text",
      label: "Bucket compartment",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the compartment of the OCI bucket compartment your uploading to. You can find the compartment in
              the bucket details.
            </>
          }
          aria-label="Bucket compartment help"
        >
          <Button variant="plain" aria-label="Bucket compartment help">
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
      name: "oci-bucket-tenancy",
      className: "pf-u-w-50",
      type: "text",
      label: "Bucket tenancy",
      labelIcon: (
        <Popover
          bodyContent={
            <>
              Provide the tenancy of the OCI bucket your uploading to. You can find the tenancy in the bucket details.
            </>
          }
          aria-label="Bucket tenancy help"
        >
          <Button variant="plain" aria-label="Bucket tenancy help">
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
