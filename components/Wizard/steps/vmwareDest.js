import React from "react";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export default {
  title: "Destination",
  name: "vmware-dest",
  substepOf: "Upload to VMWare",
  nextStep: "details",
  fields: [
    {
      component: "text-field-custom",
      name: "vmware-image-name",
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
      name: "vmware-host",
      className: "pf-u-w-50",
      type: "text",
      label: "Host",
      labelIcon: (
        <Popover
          bodyContent={<>Provide the url of your VMWare vSphere instance to which the image file will be uploaded.</>}
          aria-label="Host help"
        >
          <Button variant="plain" aria-label="Host help">
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
      name: "vmware-cluster",
      className: "pf-u-w-50",
      type: "text",
      label: "Cluster",
      labelIcon: (
        <Popover
          bodyContent={<>Provide the name of the Cluster to which the image file will be uploaded.</>}
          aria-label="Cluster help"
        >
          <Button variant="plain" aria-label="Cluster help">
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
      name: "vmware-data-center",
      className: "pf-u-w-50",
      type: "text",
      label: "Data center",
      labelIcon: (
        <Popover
          bodyContent={<>Provide the name of the Datacenter to which the image file will be uploaded.</>}
          aria-label="Data center help"
        >
          <Button variant="plain" aria-label="Data center help">
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
      name: "vmware-data-store",
      className: "pf-u-w-50",
      type: "text",
      label: "Data store",
      labelIcon: (
        <Popover
          bodyContent={<>Provide the name of the Datastore to which the image file will be uploaded.</>}
          aria-label="Data store help"
        >
          <Button variant="plain" aria-label="Data store help">
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
