import React, { useState } from "react";
import { useIntl, defineMessages } from "react-intl";
import PropTypes from "prop-types";
import { FormGroup, FileUpload } from "@patternfly/react-core";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";

const messages = defineMessages({
  filenamePlaceholder: {
    id: "wizard.uploadFile.filenamePlaceholder",
    defaultMessage: "Drag and drop a file or upload one",
  },
});

const UploadFile = ({ label, labelIcon, isRequired, ...props }) => {
  const intl = useIntl();
  const { change } = useFormApi();
  useFieldApi(props);

  const [filename, setFilename] = useState("");

  const handleFileInputChange = (event, file) => {
    setFilename(file.name);
    change("oci-private-key-filename", file.name);
  };

  const handleTextOrDataChange = (val) => {
    change("oci-private-key", val);
  };

  const handleClear = () => {
    setFilename("");
    change("oci-private-key-filename", "");
    change("oci-private-key", "");
  };

  return (
    <>
      <FormGroup isRequired={isRequired} label={label} labelIcon={labelIcon}>
        <FileUpload
          className="pf-u-w-75"
          type="text"
          filename={filename}
          hideDefaultPreview="true"
          filenamePlaceholder={intl.formatMessage(messages.filenamePlaceholder)}
          onFileInputChange={handleFileInputChange}
          onDataChange={handleTextOrDataChange}
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
