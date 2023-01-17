import React, { useEffect } from "react";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import { componentMapper } from "@data-driven-forms/pf4-component-mapper";
import { Spinner } from "@patternfly/react-core";
import PropTypes from "prop-types";
import ImageOutputSelect from "../../forms/components/ImageOutputSelect";
import Packages from "../../forms/components/Packages";
import Review from "../../forms/components/Review";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import UploadOCIFile from "../../forms/components/UploadOCIFile";
import { FormSpy, useFormApi } from "@data-driven-forms/react-form-renderer";
import { useSelector } from "react-redux";
import { selectBlueprintByName } from "../../slices/blueprintsSlice";
import { blueprintToFormState } from "../../helpers";
import BlueprintSelect from "../../forms/components/BlueprintSelect";

const BlueprintListener = () => {
  const { getState, change } = useFormApi();
  const { blueprintName } = getState().values;
  if (!blueprintName) return null;

  const blueprint = useSelector((state) =>
    selectBlueprintByName(state, blueprintName)
  );
  const blueprintForm = blueprintToFormState(blueprint);

  useEffect(() => {
    change("blueprint", blueprintForm);
  }, [blueprintName]);

  return null;
};

const BlueprintListenerWrapper = () => (
  <FormSpy subscription={{ values: true }}>
    {() => <BlueprintListener />}
  </FormSpy>
);

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
        "image-output-select": {
          component: ImageOutputSelect,
          imageTypes: props.imageTypes,
        },
        "package-selector": {
          component: Packages,
        },
        review: {
          component: Review,
          imageTypes: props.imageTypes,
        },
        "text-field-custom": TextFieldCustom,
        "upload-oci-file": UploadOCIFile,
        "blueprint-select": {
          component: BlueprintSelect,
          blueprintNames: props.blueprintNames,
        },
        "blueprint-listener": BlueprintListenerWrapper,
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
  blueprintNames: PropTypes.arrayOf(PropTypes.string),
};

// eslint-disable-next-line no-unused-vars
const equality = (prevProps, nextProps) => {
  return true;
};

const MemoizedImageCreator = React.memo(ImageCreator, equality);

export default MemoizedImageCreator;
