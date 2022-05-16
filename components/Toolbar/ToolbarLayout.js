import React from "react";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";

class ToolbarLayout extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    const { children } = this.props;

    return (
      <div className="row toolbar-pf">
        <div className="col-sm-12">
          <div className="toolbar-pf-actions">{children}</div>
        </div>
      </div>
    );
  }
}

ToolbarLayout.propTypes = {
  children: PropTypes.node,
};

ToolbarLayout.defaultProps = {
  children: React.createElement("div"),
};

export default injectIntl(ToolbarLayout);
