import React from "react";
import PropTypes from "prop-types";

import { Title, EmptyState as EmptyStatePF4, EmptyStateIcon, EmptyStateBody } from "@patternfly/react-core";

import "./EmptyState.css";

class EmptyState extends React.PureComponent {
  render() {
    const { title, message, children, icon } = this.props;
    const emptyStateIcon = icon ? <EmptyStateIcon icon={icon} /> : null;
    return (
      <EmptyStatePF4>
        {emptyStateIcon}
        <Title size="sm">{title}</Title>
        <EmptyStateBody>{message}</EmptyStateBody>
        {children}
      </EmptyStatePF4>
    );
  }
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  icon: PropTypes.elementType,
};

EmptyState.defaultProps = {
  children: React.createElement("div"),
  message: null,
  icon: null,
};

export default EmptyState;
