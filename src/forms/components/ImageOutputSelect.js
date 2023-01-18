import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormGroup, Select, SelectOption } from "@patternfly/react-core";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";
import { defineMessages, useIntl } from "react-intl";
import { ImageTypeLabels } from "../../constants";

const messages = defineMessages({
  outputType: {
    id: "wizard.imageOutput.selectType",
    defaultMessage: "Select output type",
  },
});

const ImageOutputSelect = ({ label, isRequired, ...props }) => {
  const intl = useIntl();
  const { change, getState } = useFormApi();
  const formValues = getState()?.values;
  const [outputType, setOutputType] = useState(formValues?.image?.type);
  const [isOpen, setIsOpen] = useState(false);
  useFieldApi(props);

  const setOutput = (_, selection) => {
    if (outputType !== selection) {
      setOutputType(selection);
      setIsOpen(false);
      // reset all image fields on type change
      change("image", {});
      change("image.type", selection);
    }
  };

  // only show output types that are declared in our constants
  const supportedTypes = props.imageTypes.filter(
    (outputType) => ImageTypeLabels[outputType]
  );

  return (
    <>
      <FormGroup isRequired={isRequired} label={label}>
        <Select
          className="pf-u-w-50"
          onToggle={() => setIsOpen(!isOpen)}
          onSelect={setOutput}
          isOpen={isOpen}
          selections={outputType}
          placeholderText={intl.formatMessage(messages.outputType)}
          typeAheadAriaLabel={intl.formatMessage(messages.outputType)}
          toggleId="image-output-select-toggle"
        >
          {supportedTypes.map((outputType) => (
            <SelectOption key={outputType} value={outputType}>
              {ImageTypeLabels[outputType]}
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
  imageTypes: PropTypes.arrayOf(PropTypes.string),
};

export default ImageOutputSelect;
