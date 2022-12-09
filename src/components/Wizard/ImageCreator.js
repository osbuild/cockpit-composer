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
  ...props
}) => {
  return schema ? (
    <FormRenderer
      initialValues={props.initialValues}
      schema={schema}
      FormTemplate={(props) => (
        <Pf4FormTemplate {...props} showFormControls={false} />
      )}
      onSubmit={(fields, formAPI) => onSubmit(fields, formAPI)}
      validatorMapper={{ ...customValidatorMapper }}
      componentMapper={{
        ...componentMapper,
        ...customComponentMapper,
        "blueprint-name": {
          component: BlueprintName,
          blueprintName: props.blueprint.name,
        },
        "image-output-select": {
          component: ImageOutputSelect,
          imageTypes: props.imageTypes,
        },
        "package-selector": {
          component: Packages,
          blueprintName: props.blueprint.name,
        },
        review: {
          component: Review,
          blueprintName: props.blueprint.name,
          imageTypes: props.imageTypes,
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
  imageTypes: PropTypes.arrayOf(PropTypes.string),
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
  blueprint: PropTypes.object,
};

// eslint-disable-next-line no-unused-vars
const equality = (prevProps, nextProps) => {
  return true;
};

const MemoizedImageCreator = React.memo(ImageCreator, equality);

export default MemoizedImageCreator;
