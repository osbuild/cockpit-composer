import React from "react";
import PropTypes from "prop-types";

class EmptyState extends React.PureComponent {
  render() {
    const { title, message, children } = this.props;
    return (
      <div className="blank-slate-pf">
        <h1>{title}</h1>
        <p>{message}</p>
        {children}
      </div>
    );
  }
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  children: PropTypes.element
};

EmptyState.defaultProps = {
  children: React.createElement("div")
};

export default EmptyState;
