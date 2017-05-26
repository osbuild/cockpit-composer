import React from 'react';
import PropTypes from 'prop-types';

const ComponentTypeIcons = (props) => {
  let icon = null;
  if (props.componentType === 'RPM') {
    icon = <span className="fa fa-sticky-note-o list-view-pf-icon-sm" title="RPM"></span>;
  } else if (props.componentType === 'Module') {
    icon = <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>;
  } else if (props.componentType === 'Module Stack') {
    icon = <span className="fa fa-cubes list-view-pf-icon-sm" title="Module Stack"></span>;
  }

  return (
    <span>
      {icon}
    </span>
  );
};

ComponentTypeIcons.propTypes = {
  componentType: PropTypes.string,
};

export default ComponentTypeIcons;
