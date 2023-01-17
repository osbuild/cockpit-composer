import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormGroup, Select, SelectOption } from "@patternfly/react-core";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  blueprintSelect: {
    defaultMessage: "Select blueprint",
  },
});

const BlueprintSelect = ({ label, isRequired, blueprintNames, ...props }) => {
  const intl = useIntl();
  const { change, getState } = useFormApi();
  const formValues = getState()?.values;
  const [blueprintName, setBlueprintName] = useState(
    formValues?.["blueprintName"]
  );
  const [isOpen, setIsOpen] = useState(false);
  useFieldApi(props);

  const setOutput = (_, selection) => {
    if (blueprintName !== selection) {
      setBlueprintName(selection);
      setIsOpen(false);
      change("blueprintName", selection);
    }
  };

  return (
    <>
      <FormGroup isRequired={isRequired} label={label}>
        <Select
          className="pf-u-w-50"
          onToggle={() => setIsOpen(!isOpen)}
          onSelect={setOutput}
          isOpen={isOpen}
          selections={blueprintName}
          placeholderText={intl.formatMessage(messages.blueprintSelect)}
          typeAheadAriaLabel={intl.formatMessage(messages.blueprintSelect)}
        >
          {blueprintNames.map((blueprintName) => (
            <SelectOption key={blueprintName} value={blueprintName}>
              {blueprintName}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
    </>
  );
};

BlueprintSelect.propTypes = {
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  blueprintNames: PropTypes.arrayOf(PropTypes.string),
};

export default BlueprintSelect;
