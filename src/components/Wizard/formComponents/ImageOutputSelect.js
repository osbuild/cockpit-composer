import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormGroup, Select, SelectOption } from "@patternfly/react-core";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  outputType: {
    id: "wizard.imageOutput.selectType",
    defaultMessage: "Select output type",
  },
});

const ImageOutputSelect = ({ label, isRequired, ...props }) => {
  const intl = useIntl();
  const { change, getState } = useFormApi();
  const formValues = getState()?.values;
  const [outputType, setOutputType] = useState(
    formValues?.["image-output-type"]
  );
  const [isOpen, setIsOpen] = useState(false);
  useFieldApi(props);

  const setOutput = (_, selection) => {
    if (outputType !== selection) {
      setOutputType(selection);
      setIsOpen(false);
      change("image-output-type", selection);
    }
  };

  const imageTypeLabels = {
    alibaba: "Alibaba Cloud (.qcow2)",
    ami: "Amazon Web Services (.raw)",
    "iot-commit": "IoT Commit (.tar)",
    google: "Google Cloud Platform (.vhd)",
    "hyper-v": "Hyper-V (.vhd)",
    "live-iso": "Installer, suitable for USB and DVD (.iso)",
    tar: "Disk Archive (.tar)",
    openstack: "OpenStack (.qcow2)",
    "partitioned-disk": "Disk Image (.img)",
    oci: "Oracle Cloud Infrastructure (.qcow2)",
    qcow2: "QEMU Image (.qcow2)",
    "rhel-edge-commit": "RHEL for Edge Commit (.tar)",
    "rhel-edge-container": "RHEL for Edge Container (.tar)",
    "rhel-edge-installer": "RHEL for Edge Installer (.iso)",
    "edge-commit": "RHEL for Edge Commit (.tar)",
    "edge-container": "RHEL for Edge Container (.tar)",
    "edge-installer": "RHEL for Edge Installer (.iso)",
    "edge-raw-image": "RHEL for Edge Raw Image (.raw.xz)",
    "image-installer": "RHEL Installer (.iso)",
    // "edge-simplified-installer": "RHEL for Edge Simplified Installer (.iso)",
    vhd: "Microsoft Azure (.vhd)",
    vmdk: "VMWare VSphere (.vmdk)",
  };

  return (
    <>
      <FormGroup
        isRequired={isRequired}
        label={label}
        data-testid="subscription-activation-key"
      >
        <Select
          className="pf-u-w-50"
          onToggle={() => setIsOpen(!isOpen)}
          onSelect={setOutput}
          isOpen={isOpen}
          selections={outputType}
          placeholderText={intl.formatMessage(messages.outputType)}
          typeAheadAriaLabel={intl.formatMessage(messages.outputType)}
          toggleId="image-output-select-toggle"
        >
          {props.imageTypes.map((outputType) => (
            <SelectOption key={outputType} value={outputType}>
              {imageTypeLabels[outputType] || outputType}
            </SelectOption>
          ))}
        </Select>
      </FormGroup>
    </>
  );
};

ImageOutputSelect.propTypes = {
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  imageTypes: PropTypes.arrayOf(PropTypes.string),
};

export default ImageOutputSelect;
