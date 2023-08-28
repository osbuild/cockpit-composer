import React from "react";
import { useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";
import {
  FileUpload,
  Modal,
  ModalVariant,
  Button,
} from "@patternfly/react-core";

import {
  createBlueprint,
  createBlueprintTOML,
} from "../../slices/blueprintsSlice";

import "./ImportBlueprint.css";

export const ImportBlueprint = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [blueprint, setBlueprint] = React.useState("");
  const [filename, setFilename] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleModalToggle = () => {
    handleClear();
    setIsModalOpen(!isModalOpen);
  };

  const handleFileInputChange = (e, file) => {
    setFilename(file.name);
  };

  const handleTextOrDataChange = (value) => {
    setBlueprint(value);
  };

  const handleClear = () => {
    setFilename("");
    setBlueprint("");
  };

  const handleFileReadStarted = () => {
    setIsLoading(true);
  };

  const handleFileReadFinished = () => {
    setIsLoading(false);
  };

  const handleImport = () => {
    const filetype = filename.split(".")[1];
    if (filetype === "toml") {
      dispatch(createBlueprintTOML(blueprint));
    } else {
      const blueprintJSON = JSON.parse(blueprint);
      dispatch(createBlueprint(blueprintJSON));
    }
    handleModalToggle(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleModalToggle}>
        <FormattedMessage defaultMessage="Import blueprint" />
      </Button>
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Import blueprint",
        })}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleImport}>
            <FormattedMessage defaultMessage="Import" />
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            <FormattedMessage defaultMessage="Cancel" />
          </Button>,
        ]}
      >
        <FileUpload
          type="text"
          className="import-blueprint-file-upload"
          value={blueprint}
          filename={filename}
          filenamePlaceholder={intl.formatMessage({
            defaultMessage: "Drag and drop a file or upload one",
          })}
          onFileInputChange={handleFileInputChange}
          onDataChange={handleTextOrDataChange}
          onReadStarted={handleFileReadStarted}
          onReadFinished={handleFileReadFinished}
          onClearClick={handleClear}
          isLoading={isLoading}
          browseButtonText={intl.formatMessage({
            defaultMessage: "Upload",
          })}
          onTextChange={handleTextOrDataChange}
          allowEditingUploadedText={true}
        />
      </Modal>
    </>
  );
};

export default ImportBlueprint;
