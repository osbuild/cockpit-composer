import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Text, Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";
import { defineMessages, useIntl } from "react-intl";

const BlueprintName = (props) => {
  const intl = useIntl();
  const messages = defineMessages({
    blueprint: {
      id: "blueprint.name",
      defaultMessage: "blueprint",
    },
    popoverBody: {
      id: "blueprint.popover.content",
      defaultMessage: "This process can take a while. Images are built in the order they are started.",
    },
    popoverAria: {
      id: "blueprint.popover.aria",
      defaultMessage: "Process length help",
    },
  });

  return (
    <FormGroup
      label={intl.formatMessage(messages.blueprint)}
      isRequired
      labelIcon={
        <Popover bodyContent={intl.formatMessage(messages.popoverBody)}>
          <Button variant="plain" aria-label={intl.formatMessage(messages.popoverAria)}>
            <HelpIcon />
          </Button>
        </Popover>
      }
    >
      <Text>{props.blueprintName}</Text>
    </FormGroup>
  );
};

BlueprintName.propTypes = {
  blueprintName: PropTypes.string,
};

export default BlueprintName;
