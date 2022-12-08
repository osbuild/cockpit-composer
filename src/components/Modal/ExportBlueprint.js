import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useIntl, FormattedMessage } from "react-intl";
import {
  CodeBlock,
  CodeBlockCode,
  Modal,
  ModalVariant,
  Button,
  Select,
  SelectOption,
} from "@patternfly/react-core";
import { CopyIcon, DownloadIcon } from "@patternfly/react-icons";

import { getBlueprintTOML, getBlueprintJSON } from "../../api";
import "./ExportBlueprint.css";

export const ExportBlueprint = (props) => {
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("TOML");
  const [codeJSON, setCodeJSON] = React.useState("");
  const [codeTOML, setCodeTOML] = React.useState("");

  useEffect(() => {
    getCode();
  }, []);

  const getCode = async () => {
    const jsonObject = await getBlueprintJSON(props.blueprint.name);
    const json = JSON.stringify(jsonObject, null, 2);
    const toml = await getBlueprintTOML(props.blueprint.name).catch(() => {
      console.log("Error getting TOML");
      return;
    });
    setCodeTOML(toml);
    setCodeJSON(json);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSelectToggle = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  const onSelect = (e, selection) => {
    setIsSelectOpen(false);
    setSelected(selection);
  };

  const handleCopy = () => {
    const code = selected === "TOML" ? codeTOML : codeJSON;
    navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const code = selected === "TOML" ? codeTOML : codeJSON;
    const filename = `${props.blueprint.name}.${selected.toLowerCase()}`;

    const link = document.createElement("a");
    link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(code);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleModalToggle}>
        <FormattedMessage defaultMessage="Export blueprint" />
      </Button>
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          defaultMessage: "Export blueprint",
        })}
        id="modal-export-blueprint"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <div className="pf-u-display-flex pf-u-justify-content-space-between codeblock-toolbar">
          <Select
            onToggle={handleSelectToggle}
            onSelect={onSelect}
            isOpen={isSelectOpen}
            selections={selected}
            width="25%"
          >
            <SelectOption key="json" value="JSON" />
            <SelectOption key="toml" value="TOML" />
          </Select>
          <div>
            <Button variant="plain" onClick={handleCopy}>
              <CopyIcon />
            </Button>
            <Button variant="plain" onClick={handleDownload}>
              <DownloadIcon />
            </Button>
          </div>
        </div>
        <CodeBlock className="pf-u-h-33vh">
          <CodeBlockCode className="pf-u-h-33vh">
            {selected === "JSON" ? codeJSON : codeTOML}
          </CodeBlockCode>
        </CodeBlock>
      </Modal>
    </>
  );
};

ExportBlueprint.propTypes = {
  blueprint: PropTypes.object,
};

export default ExportBlueprint;
