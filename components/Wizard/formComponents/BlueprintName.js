import React from "react";
import { FormGroup, Text, Popover, Button } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

const BlueprintName = (props) => {
  return (
    <FormGroup
      label="Blueprint"
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

export default BlueprintName;
