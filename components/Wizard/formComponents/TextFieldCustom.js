import React from "react";
import { FormGroup, TextInput } from "@patternfly/react-core";
import PropTypes from "prop-types";

import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import showError from "@data-driven-forms/pf4-component-mapper/show-error/show-error";

const TextFieldCustom = (props) => {
  const {
    label,
    labelIcon,
    isRequired,
    helperText,
    meta,
    validateOnMount,
    description,
    input,
    isReadOnly,
    isDisabled,
    id,
    FormGroupProps,
    ...rest
  } = useFieldApi(props);
  return (
    <FormGroup
      label={label}
      labelIcon={labelIcon}
      isRequired={isRequired}
      helperText={helperText}
      description={description}
      id={id || input.name}
      {...showError(meta, validateOnMount)}
      {...FormGroupProps}
    >
      <TextInput
        {...input}
        {...showError(meta, validateOnMount)}
        {...rest}
        id={id || input.name}
        isRequired={isRequired}
        isReadOnly={isReadOnly}
        isDisabled={isDisabled}
      />
    </FormGroup>
  );
};

TextFieldCustom.propTypes = {
  label: PropTypes.node,
  validateOnMount: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isRequired: PropTypes.bool,
  helperText: PropTypes.node,
  description: PropTypes.node,
  isDisabled: PropTypes.bool,
  id: PropTypes.string,
  FormGroupProps: PropTypes.object,
};

export default TextFieldCustom;
