import React from "react";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import { componentMapper } from "@data-driven-forms/pf4-component-mapper";
import { Spinner } from "@patternfly/react-core";
import PropTypes from "prop-types";
import BlueprintName from "./formComponents/BlueprintName";
import ImageOutputSelect from "./formComponents/ImageOutputSelect";

const ImageCreator = ({
  schema,
  onSubmit,
  onClose,
  customComponentMapper,
  customValidatorMapper,
  className,
  ...props
}) => {
  return schema ? (
    <FormRenderer
      schema={schema}
      FormTemplate={(props) => <Pf4FormTemplate {...props} showFormControls={false} />}
      onSubmit={(formValues) => onSubmit(formValues)}
      componentMapper={{
        ...componentMapper,
        ...customComponentMapper,
        "blueprint-name": {
          component: BlueprintName,
          blueprint: props.blueprint,
        },
        "image-output-select": {
          component: ImageOutputSelect,
          imageTypes: props.imageTypes,
        },
      }}
      onCancel={onClose}
      {...props}
    />
  ) : (
    <Spinner />
  );
};

ImageCreator.propTypes = {
  schema: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  customComponentMapper: PropTypes.shape({
    [PropTypes.string]: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.shape({
        component: PropTypes.node,
      }),
    ]),
  }),
  customValidatorMapper: PropTypes.shape({
    [PropTypes.string]: PropTypes.func,
  }),
  defaultArch: PropTypes.string,
  className: PropTypes.string,
  initialValues: PropTypes.object,
};

export default ImageCreator;