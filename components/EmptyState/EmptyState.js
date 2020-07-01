import React from "react";
import PropTypes from "prop-types";

class EmptyState extends React.PureComponent {
  render() {
    const { title, message, children, icon } = this.props;
    const emptyStateIcon = icon ? (
      <div className="blank-slate-pf-icon">
        <span className={icon} />
      </div>
    ) : null;
    return (
      <div className="blank-slate-pf">
        {emptyStateIcon}
        <h1>{title}</h1>
        <p>{message}</p>
        {children}
      </div>
    );
  }
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  icon: PropTypes.string,
};

EmptyState.defaultProps = {
  children: React.createElement("div"),
  message: null,
  icon: null,
};

export default EmptyState;
