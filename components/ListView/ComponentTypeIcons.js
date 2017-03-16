import React from 'react';

class ComponentTypeIcons extends React.Component {

  render() {
    const { componentType } = this.props;

    let icon = null;
    if (componentType === 'RPM') {
      icon = <span className="fa fa-sticky-note-o list-view-pf-icon-sm" title="RPM"></span>;
    } else if (componentType === 'Module') {
      icon = <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>;
    } else if (componentType === 'Module Stack') {
      icon = <span className="fa fa-cubes list-view-pf-icon-sm" title="Module Stack"></span>;
    }

    return (
      <span>
        {icon}
      </span>
    );
  }


}

export default ComponentTypeIcons;
