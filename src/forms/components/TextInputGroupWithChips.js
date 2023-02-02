import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { defineMessages, useIntl } from "react-intl";
import {
  useFormApi,
  useFieldApi,
} from "@data-driven-forms/react-form-renderer";
import {
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
  Chip,
  ChipGroup,
  FormGroup,
} from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";

const messages = defineMessages({
  inputAriaLabel: {
    defaultMessage: "Enter values",
  },
});

const TextInputGroupWithChips = ({ label, ...props }) => {
  const intl = useIntl();
  const { change } = useFormApi();
  const { input } = useFieldApi(props);
  const [inputValue, setInputValue] = React.useState("");
  const [currentChips, setCurrentChips] = React.useState(input.value || []);
  const textInputGroupRef = React.useRef();

  useEffect(() => {
    change(input.name, currentChips);
  }, [currentChips]);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const addChip = (newChipText) => {
    setCurrentChips([...currentChips, `${newChipText}`]);
    setInputValue("");
  };

  const deleteChip = (chipToDelete) => {
    const newChips = currentChips.filter(
      (chip) => !Object.is(chip, chipToDelete)
    );
    setCurrentChips(newChips);
  };

  const clearChipsAndInput = () => {
    setCurrentChips([]);
    setInputValue("");
  };

  const handleEnter = () => {
    if (inputValue.length) {
      addChip(inputValue);
      focusTextInput();
    }
  };

  const handleTextInputKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === ",") {
      event.preventDefault();
      handleEnter();
    }
  };

  const focusTextInput = () => {
    textInputGroupRef.current.focus();
  };

  const showClearButton = !!inputValue || !!currentChips.length;

  return (
    <FormGroup label={label}>
      <TextInputGroup>
        <TextInputGroupMain
          id={input.name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleTextInputKeyDown}
          aria-label={intl.formatMessage(messages.inputAriaLabel)}
          innerRef={textInputGroupRef}
        >
          <ChipGroup>
            {currentChips.map((currentChip) => (
              <Chip key={currentChip} onClick={() => deleteChip(currentChip)}>
                {currentChip}
              </Chip>
            ))}
          </ChipGroup>
        </TextInputGroupMain>
        {showClearButton && (
          <TextInputGroupUtilities>
            <Button variant="plain" onClick={clearChipsAndInput}>
              <TimesIcon />
            </Button>
          </TextInputGroupUtilities>
        )}
      </TextInputGroup>
    </FormGroup>
  );
};

TextInputGroupWithChips.propTypes = {
  label: PropTypes.object,
};

export default TextInputGroupWithChips;
