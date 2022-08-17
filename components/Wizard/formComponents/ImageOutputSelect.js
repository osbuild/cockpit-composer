import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormGroup, Select, SelectOption } from "@patternfly/react-core";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";

const ImageOutputSelect = ({ label, isRequired, ...props }) => {
  const { change, getState } = useFormApi();
  const formValues = getState()?.values;
  const [outputType, setOutputType] = useState(formValues?.["image-output-type"]);
  const [isOpen, setIsOpen] = useState(false);
  useFieldApi(props);

  const setOutput = (_, selection) => {
    if (outputType !== selection) {
      setOutputType(selection);
      setIsOpen(false);
      change("image-output-type", selection);
    }
  };

  return (
    <>
      <FormGroup isRequired={isRequired} label={label} data-testid="subscription-activation-key">
        <Select
          className="pf-u-w-50"
          onToggle={() => setIsOpen(!isOpen)}
          onSelect={setOutput}
          isOpen={isOpen}
          selections={outputType}
          placeholderText="Select output type"
          typeAheadAriaLabel="Select output type"
          toggleId="image-output-select-toggle"
        >
          {props.imageTypes.map((outputType) => (
            <SelectOption key={outputType.name} value={outputType.name}>
              {outputType.label}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
    </>
  );
};

ImageOutputSelect.propTypes = {
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
};

export default ImageOutputSelect;
