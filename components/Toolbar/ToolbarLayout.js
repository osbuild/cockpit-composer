import React from 'react';
import PropTypes from 'prop-types';
import { Filter, Toolbar } from 'patternfly-react';


class ToolbarLayout extends React.Component {
  constructor() {
    super();
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
  }

  handleRemoveFilter(filter) {
    this.props.filterRemoveValue(filter);
  }

  render() {
    const {filters, children, filterClearValues} = this.props;
    return (
      <div className="row toolbar-pf">
        <div className="col-sm-12">
          <div className="toolbar-pf-actions">
            {children}
          </div>
          {filters.filterValues && filters.filterValues.length !== 0 && (
            <Toolbar.Results>
              <Filter.ActiveLabel>{'Active Filters:'}</Filter.ActiveLabel>
              <Filter.List>
                {filters.filterValues.map((item, index) => {
                  return (
                    <Filter.Item
                      key={index}
                      onRemove={this.handleRemoveFilter}
                      filterData={item}
                    >
                      {item.key}: {item.value}
                    </Filter.Item>
                  );
                })}
              </Filter.List>
              <button
                className="btn-link"
                onClick={filterClearValues}

              >
                Clear All Filters
              </button>
            </Toolbar.Results>
          )}
        </div>
      </div>
    );
  }
}

ToolbarLayout.propTypes = {
  filters: PropTypes.object,
  filterRemoveValue: PropTypes.func,
  filterClearValues: PropTypes.func,
  children: PropTypes.node,
};

export default ToolbarLayout;
