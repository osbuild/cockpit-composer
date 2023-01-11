import React, { useEffect, useState } from "react";
import { useIntl, defineMessages } from "react-intl";
import PropTypes from "prop-types";
import { FormGroup, FileUpload } from "@patternfly/react-core";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";

const messages = defineMessages({
  filenamePlaceholder: {
    defaultMessage: "Drag and drop a file or upload one",
  },
});

const UploadFile = ({ label, labelIcon, isRequired, ...props }) => {
  const intl = useIntl();
  const { change } = useFormApi();
  const { input } = useFieldApi(props);

  const [value, setValue] = useState("");
  const [filename, setFilename] = useState("");

  useEffect(() => {
    change(input.name, value);
  }, [value]);

  const handleFileInputChange = (event, file) => {
    setFilename(file.name);
  };

  const handleTextOrDataChange = (val) => {
    setValue(val);
  };

  const handleClear = () => {
    setFilename("");
    setValue("");
  };

  return (
    <>
      <FormGroup isRequired={isRequired} label={label} labelIcon={labelIcon}>
        <FileUpload
          className="pf-u-w-75"
          type="text"
          value={value}
          filename={filename}
          filenamePlaceholder={intl.formatMessage(messages.filenamePlaceholder)}
          onFileInputChange={handleFileInputChange}
          onDataChange={handleTextOrDataChange}
          onTextChange={handleTextOrDataChange}
          onClearClick={handleClear}
        />
      </FormGroup>
    </>
  );
};

UploadFile.propTypes = {
  label: PropTypes.node,
  labelIcon: PropTypes.node,
  isRequired: PropTypes.bool,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
};

export default UploadFile;
