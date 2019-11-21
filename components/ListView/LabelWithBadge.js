import React from "react";
import PropTypes from "prop-types";

export default function LabelWithBadge(props) {
  return (
    <span>
      {props.title}&nbsp;
      {(props.error && (
        <span className="badge" data-badge={props.title}>
          ?
        </span>
      )) || (
        <span className="badge" data-badge={props.title}>
          {props.badge}
        </span>
      )}
    </span>
  );
}

LabelWithBadge.propTypes = {
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.bool
};

LabelWithBadge.defaultProps = {
  title: "",
  badge: "",
  error: false
};
