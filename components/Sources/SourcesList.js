import React from 'react';
import PropTypes from 'prop-types';
import SourcesListItem from '../../components/Sources/SourcesListItem';

class SourcesList extends React.PureComponent {
  render() {
    const systemSources = Object.values(this.props.sources).filter(source => source.system === true);
    const customSources = Object.values(this.props.sources).filter(source => source.system !== true);
    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Source Path</th>
              <th>Name</th>
              <th>Type</th>
            </tr>
            <tr>
              <th colSpan={3}>
                System Sources
              </th>
            </tr>
          </thead>
          <tbody>
            {systemSources.map((source, i) => (
              <SourcesListItem source={source} i={i} />
            ))}
          </tbody>
          <thead>
            <tr>
              <th colSpan={3}>Custom Sources</th>
            </tr>
          </thead>
          <tbody>
            {customSources.map((source, i) => (
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
