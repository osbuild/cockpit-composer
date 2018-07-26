import React from 'react';
import PropTypes from 'prop-types';
import SourcesListItem from '../../components/Sources/SourcesListItem';

class SourcesList extends React.PureComponent {
  render() {

    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th className="cmpsr-width-60">Source Path</th>
              <th className="cmpsr-width-20">Name</th>
              <th className="cmpsr-width-20">Type</th>
            </tr>
          </thead>
          <tbody>
            {this.props.sources.map((source, i) => (
              <SourcesListItem source={source} i={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

SourcesList.propTypes = {
  sources: PropTypes.array,
};

export default SourcesList;
