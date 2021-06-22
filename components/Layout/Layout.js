import React from "react";
import PropTypes from "prop-types";
import Notifications from "../Notifications/Notifications";

class Layout extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    const { className, children } = this.props;
    return (
      <div>
        <Notifications />
        <div className={className}>{children}</div>
      </div>
    );
  }
}

Layout.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;
