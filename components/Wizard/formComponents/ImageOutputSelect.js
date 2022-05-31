import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormGroup, Select, SelectOption } from "@patternfly/react-core";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";

const ImageOutputSelect = ({ label, isRequired, ...props }) => {
  const { change } = useFormApi();
  const { input } = useFieldApi(props);
  const [outputType, setOutputType] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const setOutput = (_, selection) => {
    setOutputType(selection);
    setIsOpen(false);
    change(input.name, selection);
  };

  return (
    <FormGroup isRequired={isRequired} label={label} data-testid="subscription-activation-key">
      <Select
        onToggle={() => setIsOpen(!isOpen)}
        onSelect={setOutput}
        isOpen={isOpen}
        selections={outputType}
        placeholderText="Select output type"
        typeAheadAriaLabel="Select output type"
      >
        {props.imageTypes.map((outputType) => (
          <SelectOption key={outputType.name} value={outputType.name}>
            {outputType.label}
          </SelectOption>
        ))}
      </Select>
    </FormGroup>
  );
};

ImageOutputSelect.propTypes = {
  label: PropTypes.node,
  isRequired: PropTypes.bool,
};

export default ImageOutputSelect;
