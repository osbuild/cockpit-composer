import React from "react";
import {
  FormGroup as Pf4FormGroup,
  TextContent,
  Text,
} from "@patternfly/react-core";
import PropTypes from "prop-types";

const showError = (
  { error, touched, warning, submitError },
  validateOnMount
) => {
  if ((touched || validateOnMount) && error) {
    return { validated: "error" };
  }

  if ((touched || validateOnMount) && submitError) {
    return { validated: "error" };
  }

  if ((touched || validateOnMount) && warning) {
    return { validated: "warning" };
  }

  return { validated: "default" };
};

const FormGroupCustom = ({
  className,
  label,
  labelIcon,
  isRequired,
  helperText,
  meta,
  validateOnMount,
  description,
  hideLabel,
  children,
  id,
  FormGroupProps,
}) => (
  <Pf4FormGroup
    className={className}
    isRequired={isRequired}
    label={!hideLabel && label}
    labelIcon={!hideLabel && labelIcon}
    fieldId={id}
    helperText={
      ((meta.touched || validateOnMount) && meta.warning) || helperText
    }
    helperTextInvalid={meta.error || meta.submitError}
    {...showError(meta, validateOnMount)}
    {...FormGroupProps}
  >
    {description && (
      <TextContent>
        <Text component="small">{description}</Text>
      </TextContent>
    )}
    {children}
  </Pf4FormGroup>
);

FormGroupCustom.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  labelIcon: PropTypes.node,
  isRequired: PropTypes.bool,
  helperText: PropTypes.node,
  meta: PropTypes.object.isRequired,
  description: PropTypes.node,
  hideLabel: PropTypes.bool,
  validateOnMount: PropTypes.bool,
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  FormGroupProps: PropTypes.object,
};

export default FormGroupCustom;
