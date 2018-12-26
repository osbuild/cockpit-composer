import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import SourcesListItem from "./SourcesListItem";

class SourcesList extends React.PureComponent {
  render() {
    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th className="cmpsr-width-60">
                <FormattedMessage defaultMessage="Source Path" description="The path or url to the source repository" />
              </th>
              <th className="cmpsr-width-20">
                <FormattedMessage defaultMessage="Name" description="Name of source" />
              </th>
              <th className="cmpsr-width-20">
                <FormattedMessage defaultMessage="Type" description="Type of source" />
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.sources.map((source, i) => (
              <SourcesListItem source={source} key={i} i={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

SourcesList.propTypes = {
  sources: PropTypes.array
};

export default SourcesList;
