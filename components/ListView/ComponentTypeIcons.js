import React from 'react';
import PropTypes from 'prop-types';

const ComponentTypeIcons = props => {
  let icon = '';
  let type = '';
  let indicator = '';
  const context = props.compDetails ? 'pf-icon-small' : 'list-pf-icon list-pf-icon-small';
  switch (props.componentType) {
    case 'Module':
      type = 'Type&nbsp;<strong>Module</strong>';
      icon = 'pficon pficon-bundle';
      break;
    case 'RPM':
      type = 'Type&nbsp;<strong>RPM</strong>';
      icon = 'pficon pficon-bundle';
      break;
    default:
      type = 'Type&nbsp;<strong>RPM</strong>';
      icon = 'pficon pficon-bundle';
  }
  if (props.componentInBlueprint === true) {
    indicator = 'list-pf-icon-bordered';
    // TODO - Identify icon as belonging to dependency in the blueprint
    // if (props.isDependency) {
    //   indicator += ' list-pf-icon-bordered-dotted';
    // }
  }

  return (
    <span>
      <span
        className={`${icon} ${indicator} ${context}`}
        data-html="true"
        data-toggle="tooltip"
        title=""
        data-original-title={type}
      />
    </span>
  );
};

ComponentTypeIcons.propTypes = {
  componentType: PropTypes.string,
  compDetails: PropTypes.bool,
  componentInBlueprint: PropTypes.bool,
};

export default ComponentTypeIcons;
