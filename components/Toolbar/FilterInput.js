import React from 'react';
import PropTypes from 'prop-types';
import { Filter } from 'patternfly-react';

class FilterInput extends React.Component {
  constructor() {
    super();
    this.state = {
      filterValue: '',
      currentFilterId: ''
    }
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.selectFilterType = this.selectFilterType.bind(this);
  }

  componentWillMount() {
    this.setState({ currentFilterId: this.props.filters.defaultFilterType });
  }

  handleChangeFilter(event) {
    this.setState({filterValue: event.target.value});
  }

  handleSubmitFilter(event) {
    event.preventDefault();
    this.props.filterAddValue({
      key: this.state.currentFilterId,
      value: this.state.filterValue
    });
    this.setState({filterValue: ''});
  }

  selectFilterType(filterType) {
    const { currentFilterId } = this.state;
    if (currentFilterId !== filterType.id) {
      this.setState({currentFilterId: filterType.id});
    }
  }



  render() {
    const {emptyState, filters} = this.props;
    const currentFilterType = filters.filterTypes.find(type => type.id === this.state.currentFilterId);
    return (
      <form onSubmit={(e) => this.handleSubmitFilter(e)}>
        <div className="filter-pf-fields">
          <div className="form-group toolbar-pf-filter">
            <div className="input-group">
              {filters.filterTypes.length > 1 &&
                <Filter.TypeSelector
                  filterTypes={filters.filterTypes}
                  currentFilterType={currentFilterType}
                  onFilterTypeSelected={this.selectFilterType}
                />
              }
              <input
                onChange={this.handleChangeFilter}
                disabled={emptyState}
                type="text"
                className="form-control"
                id="filter-blueprints"
                value={this.state.filterValue}
                placeholder={`${currentFilterType.placeholder}...`}
                aria-label={currentFilterType.placeholder}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

FilterInput.propTypes = {
  emptyState: PropTypes.bool,
  filters: PropTypes.object,
  filterAddValue: PropTypes.func,
};

export default FilterInput;
