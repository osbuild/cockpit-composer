import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Filter, Toolbar } from "patternfly-react";

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
    return (
      <div className="row toolbar-pf">
        <div className="col-sm-12">
          <div className="toolbar-pf-actions">{children}</div>
          {filters.filterValues && filters.filterValues.length !== 0 && (
            <Toolbar.Results>
              <Filter.ActiveLabel>Active Filters:</Filter.ActiveLabel>
              <Filter.List>
                {filters.filterValues.map(item => {
                  return (
                    <Filter.Item key={`${item.key}-${item.value}`} onRemove={this.handleRemoveFilter} filterData={item}>
                      {item.key}: {item.value}
                    </Filter.Item>
                  );
                })}
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
  children: PropTypes.node
};

ToolbarLayout.defaultProps = {
  filters: {},
  filterRemoveValue: function() {},
  filterClearValues: function() {},
  children: React.createElement("div")
};

export default ToolbarLayout;
