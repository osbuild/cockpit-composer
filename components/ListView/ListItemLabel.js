import React, { PropTypes } from 'react';

class ListItemLabel extends React.Component {

  render() {
    const { isdependency } = this.props;

    let dependency = null;
    if (isdependency == true) {
      dependency = <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked"><span className="label label-default">Dependency</span></div>;
    }

    return (
      <span>
        {dependency}
      </span>
    )
  }

}

export default ListItemLabel;
