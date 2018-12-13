import React from 'react';
import PropTypes from 'prop-types';

export default function LabelWithBadge(props) {
  return (
    <span>{props.title}&nbsp;<span className="badge" data-badge={props.title}>{props.badge}</span></span>
  );
}

LabelWithBadge.propTypes = {
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
