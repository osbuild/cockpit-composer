import React from "react";
import PropTypes from "prop-types";

class SourcesListItem extends React.PureComponent {
  render() {
    const { source, i } = this.props;
    return (
      <tr key={i}>
        <td>{source.url}</td>
        <td>{source.name}</td>
        <td>{source.type}</td>
      </tr>
    );
  }
}

SourcesListItem.propTypes = {
  source: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string
  }),
  i: PropTypes.number
};

export default SourcesListItem;
