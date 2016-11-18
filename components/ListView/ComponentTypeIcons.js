import React, { PropTypes } from 'react';

class ComponentTypeIcons extends React.Component {

  render() {
    const { componentType } = this.props;

    let icon = null;
    if (componentType == "rpm") {
      icon = <span className="fa fa-sticky-note-o list-view-pf-icon-sm" title="RPM"></span>;
    } else if (componentType == "module") {
      icon = <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>;
    } else if (componentType == "mstack") {
      icon = <span className="fa fa-cubes list-view-pf-icon-sm" title="Module Stack"></span>;
    }

    return (
      <span>
        {icon}
      </span>
    )
  }


}

export default ComponentTypeIcons;
