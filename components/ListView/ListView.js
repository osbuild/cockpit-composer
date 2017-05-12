import React from 'react';

const ListView = (props) => (
  <div id={props.id} className="list-group list-view-pf list-view-pf-view">
    {props.children}
  </div>
);

ListView.propTypes = {
  id: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default ListView;
