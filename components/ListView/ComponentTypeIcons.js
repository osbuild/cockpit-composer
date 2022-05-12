import React from "react";
import { defineMessages, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { Tooltip, TooltipPosition } from "@patternfly/react-core";

const messages = defineMessages({
  type: {
    defaultMessage: "Type",
  },
});

const ComponentTypeIcons = (props) => {
  const { formatMessage } = props.intl;
  let icon = "";
  let type = "";
  let indicator = "";
  const context = props.compDetails ? "pf-icon-small" : "list-pf-icon list-pf-icon-small";
  switch (props.componentType) {
    case "Module":
      type = "Module";
      icon = "pficon pficon-bundle";
      break;
    case "RPM":
      type = "RPM";
      icon = "pficon pficon-bundle";
      break;
    default:
      type = "RPM";
      icon = "pficon pficon-bundle";
  }
  if (props.componentInBlueprint === true) {
    indicator = "list-pf-icon-bordered";
    if (props.isSelected !== true) {
      indicator += " list-pf-icon-bordered-dotted list-pf-icon-bordered-gray";
    }
  }

  return (
    <Tooltip
      position={TooltipPosition.top}
      content={
        <div>
          {formatMessage(messages.type)}&nbsp;<strong>{type}</strong>
        </div>
      }
    >
      <span className={`${icon} ${indicator} ${context}`} />
    </Tooltip>
  );
};

ComponentTypeIcons.propTypes = {
  componentType: PropTypes.string,
  compDetails: PropTypes.bool,
  componentInBlueprint: PropTypes.bool,
  isSelected: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

ComponentTypeIcons.defaultProps = {
  componentType: "",
  compDetails: false,
  componentInBlueprint: false,
  isSelected: false,
};

export default injectIntl(ComponentTypeIcons);
