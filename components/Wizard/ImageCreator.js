import React from "react";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import { componentMapper } from "@data-driven-forms/pf4-component-mapper";
import { Spinner } from "@patternfly/react-core";
import PropTypes from "prop-types";
import BlueprintName from "./formComponents/BlueprintName";
import ImageOutputSelect from "./formComponents/ImageOutputSelect";
import Packages from "./formComponents/Packages";
import Review from "./formComponents/Review";
import TextFieldCustom from "./formComponents/TextFieldCustom";
import UploadFile from "./formComponents/UploadFile";

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
          blueprintName: props.blueprintName,
        },
        "image-output-select": {
          component: ImageOutputSelect,
          imageTypes: props.imageTypes,
        },
        "package-selector": {
          component: Packages,
          blueprintName: props.blueprintName,
        },
        review: {
          component: Review,
          blueprintName: props.blueprintName,
        },
        "text-field-custom": TextFieldCustom,
        "upload-file": UploadFile,
      }}
      onCancel={onClose}
      {...props}
    />
  ) : (
    <Spinner />
  );
};

ImageCreator.propTypes = {
  blueprintName: PropTypes.string,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
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
