import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, KebabToggle } from "@patternfly/react-core";

const DropdownKebab = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  return (
    <Dropdown
      position="right"
      onSelect={onSelect}
      toggle={<KebabToggle onToggle={onToggle} />}
      isOpen={isOpen}
      isPlain
      dropdownItems={props.dropdownItems}
    />
  );
};

DropdownKebab.propTypes = {
  dropdownItems: PropTypes.arrayOf(PropTypes.node),
};

export default DropdownKebab;
