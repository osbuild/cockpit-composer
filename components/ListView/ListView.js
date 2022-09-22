import React from "react";
import PropTypes from "prop-types";

const ListView = (props) => (
  <div
    id={props.id}
    className={`list-pf cmpsr-list-pf ${
      props.stacked ? "list-pf-stacked" : ""
    } ${props.className}`}
  >
    {props.children}
  </div>
);

ListView.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  stacked: PropTypes.bool,
  className: PropTypes.string,
};

ListView.defaultProps = {
  id: "",
  children: React.createElement("div"),
  stacked: true,
  className: "",
};

export default ListView;
