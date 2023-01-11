import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import { Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  vmwareStepsTitle: {
    id: "wizard.vmware.title",
    defaultMessage: "Upload to VMWare",
  },
  imageNamePopoverBody: {
    id: "wizard.vmware.imageName.popoverBody",
    defaultMessage:
      "Provide a file name to be used for the image file that will be uploaded.",
  },
  imageNamePopoverAria: {
    id: "wizard.vmware.imageName.popoverAria",
    defaultMessage: "Image name help",
  },
  hostPopoverBody: {
    id: "wizard.vmware.host.popoverBody",
    defaultMessage:
      "Provide the url of your VMWare vSphere instance to which the image file will be uploaded.",
  },
  hostPopoverAria: {
    id: "wizard.vmware.host.popoverAria",
    defaultMessage: "Host help",
  },
  clusterPopoverBody: {
    id: "wizard.vmware.cluster.popoverBody",
    defaultMessage:
      "Provide the name of the Cluster to which the image file will be uploaded.",
  },
  clusterPopoverAria: {
    id: "wizard.vmware.cluster.popoverAria",
    defaultMessage: "Cluster help",
  },
  dataCenterPopoverBody: {
    id: "wizard.vmware.dataCenter.popoverBody",
    defaultMessage:
      "Provide the name of the Datacenter to which the image file will be uploaded.",
  },
  dataCenterPopoverAria: {
    id: "wizard.vmware.dataCenter.popoverAria",
    defaultMessage: "Datacenter help",
  },
  datastorePopoverBody: {
    id: "wizard.vmware.datastore.popoverBody",
    defaultMessage:
      "Provide the name of the Datastore to which the image file will be uploaded.",
  },
  datastorePopoverAria: {
    id: "wizard.vmware.datastore.popoverAria",
    defaultMessage: "Datastore help",
  },
});

const vmwareDest = (intl) => {
  return {
    title: (
      <FormattedMessage
        id="wizard.vmware.destTitle"
        defaultMessage="Destination"
      />
    ),
    name: "vmware-dest",
    substepOf: intl.formatMessage(messages.vmwareStepsTitle),
    nextStep: "review",
    fields: [
      {
        component: "text-field-custom",
        name: "vmware-image-name",
        className: "pf-u-w-50",
        type: "text",
        label: (
          <FormattedMessage
            id="wizard.vmware.imageName.label"
            defaultMessage="Image name"
          />
        ),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.imageNamePopoverBody)}
            aria-label={intl.formatMessage(messages.imageNamePopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.imageNamePopoverAria)}
            >
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
        label: (
          <FormattedMessage
            id="wizard.vmware.host.label"
            defaultMessage="Host"
          />
        ),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.hostPopoverBody)}
            aria-label={intl.formatMessage(messages.hostPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.hostPopoverAria)}
            >
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
        label: (
          <FormattedMessage
            id="wizard.vmware.cluster.label"
            defaultMessage="Cluster"
          />
        ),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.clusterPopoverBody)}
            aria-label={intl.formatMessage(messages.clusterPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.clusterPopoverAria)}
            >
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
        label: (
          <FormattedMessage
            id="wizard.vmware.dataCenter.label"
            defaultMessage="Datacenter"
          />
        ),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.dataCenterPopoverBody)}
            aria-label={intl.formatMessage(messages.dataCenterPopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.dataCenterPopoverAria)}
            >
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
        label: (
          <FormattedMessage
            id="wizard.vmware.dataStore.label"
            defaultMessage="Datastore"
          />
        ),
        labelIcon: (
          <Popover
            bodyContent={intl.formatMessage(messages.datastorePopoverBody)}
            aria-label={intl.formatMessage(messages.datastorePopoverAria)}
          >
            <Button
              variant="plain"
              aria-label={intl.formatMessage(messages.datastorePopoverAria)}
            >
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
};

export default vmwareDest;
