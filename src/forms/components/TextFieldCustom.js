import React from "react";
import { TextInput } from "@patternfly/react-core";
import PropTypes from "prop-types";

import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import showError from "@data-driven-forms/pf4-component-mapper/show-error";
import FormGroupCustom from "./FormGroupCustom";

const TextFieldCustom = (props) => {
  const {
    className,
    label,
    labelIcon,
    hideLabel,
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
    <FormGroupCustom
      className={className}
      label={label}
      labelIcon={labelIcon}
      hideLabel={hideLabel}
      isRequired={isRequired}
      helperText={helperText}
      description={description}
      meta={meta}
      validateOnMount={validateOnMount}
      id={id || input.name}
      {...showError(meta, validateOnMount)}
      FormGroupProps={FormGroupProps}
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
    </FormGroupCustom>
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
