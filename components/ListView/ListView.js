import React from 'react';
import PropTypes from 'prop-types';

const ListView = (props) => (
  <div id={props.id} className="list-group list-view-pf list-view-pf-view">
    {props.children}
  </div>
);

ListView.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};

export default ListView;
