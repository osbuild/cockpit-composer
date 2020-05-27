import React from "react";
import { defineMessages, FormattedMessage, intlShape, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { Filter, Toolbar } from "patternfly-react";

const messages = defineMessages({
  filterNameID: {
    defaultMessage: "name"
  },
  filterReleaseID: {
    defaultMessage: "release"
  },
  filterVersionID: {
    defaultMessage: "version"
  }
});

class ToolbarLayout extends React.Component {
  constructor() {
    super();
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
  }

  handleRemoveFilter(filter) {
    this.props.filterRemoveValue(filter);
  }

  render() {
    const { filters, children, filterClearValues } = this.props;
    const { formatMessage } = this.props.intl;

    const filterItem = filter => {
      switch (filter.key) {
        case "name":
          return (
            <Filter.Item key={`${filter.key}-${filter.value}`} onRemove={this.handleRemoveFilter} filterData={filter}>
              {formatMessage(messages.filterNameID)}: {filter.value}
            </Filter.Item>
          );
        case "release":
          return (
            <Filter.Item key={`${filter.key}-${filter.value}`} onRemove={this.handleRemoveFilter} filterData={filter}>
              {formatMessage(messages.filterReleaseID)}: {filter.value}
            </Filter.Item>
          );
        case "version":
          return (
            <Filter.Item key={`${filter.key}-${filter.value}`} onRemove={this.handleRemoveFilter} filterData={filter}>
              {formatMessage(messages.filterVersionID)}: {filter.value}
            </Filter.Item>
          );
        default:
          return null;
      }
    };

    return (
      <div className="row toolbar-pf">
        <div className="col-sm-12">
          <div className="toolbar-pf-actions">{children}</div>
          {filters.filterValues && filters.filterValues.length !== 0 && (
            <Toolbar.Results>
              <Filter.ActiveLabel>
                <FormattedMessage defaultMessage="Active Filters" />:
              </Filter.ActiveLabel>
              <Filter.List>
                {filters.filterValues.map(filter => filterItem(filter))}
              </Filter.List>
              <button type="button" className="btn-link" onClick={filterClearValues}>
                <FormattedMessage defaultMessage="Clear All Filters" />
              </button>
            </Toolbar.Results>
          )}
        </div>
      </div>
    );
  }
}

ToolbarLayout.propTypes = {
  filters: PropTypes.shape({
    defaultFilterType: PropTypes.string,
    filterTypes: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object)
  }),
  filterRemoveValue: PropTypes.func,
  filterClearValues: PropTypes.func,
  children: PropTypes.node,
  intl: intlShape.isRequired
};

ToolbarLayout.defaultProps = {
  filters: {},
  filterRemoveValue: function() {},
  filterClearValues: function() {},
  children: React.createElement("div")
};

export default injectIntl(ToolbarLayout);
