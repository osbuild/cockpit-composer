import React from "react";
import PropTypes from "prop-types";
import history from "../../core/history";

class Link extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { to, onClick } = this.props;
    if (onClick) {
      onClick(event);
    }

    if (event.button !== 0 /* left click */) {
      return;
    }

    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();

    if (to) {
      history.push(to);
    } else {
      history.push({
        pathname: event.currentTarget.pathname,
        search: event.currentTarget.search,
      });
    }
  }

  render() {
    const { to, children } = this.props;
    const propsWithoutTo = { ...this.props };
    delete propsWithoutTo.to;
    return (
      <a
        href={history.createHref(to)}
        {...propsWithoutTo}
        onClick={this.handleClick}
      >
        {children}
      </a>
    );
  }
}

Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
};

Link.defaultProps = {
  onClick() {},
};

export default Link;
