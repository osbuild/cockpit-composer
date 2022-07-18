import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Text, Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const BlueprintName = (props) => {
  return (
    <FormGroup
      label="Blueprint"
      isRequired
      labelIcon={
        <Popover
          bodyContent="This process can take a while. Images are built in the order they are started."
          aria-label="Process length help"
        >
          <Button variant="plain" aria-label="Process length help">
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
