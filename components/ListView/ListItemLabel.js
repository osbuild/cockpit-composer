import React from 'react';

const ListItemLabel = (props) => {
  let dependency = null;
  if (props.isdependency === true) {
    dependency = (<div
      className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked"
    >
      <span className="label label-default">Dependency</span>
    </div>);
  }

  return (
    <span>
      {dependency}
    </span>
  );
};

ListItemLabel.propTypes = {
  isdependency: React.PropTypes.bool,
};

export default ListItemLabel;
