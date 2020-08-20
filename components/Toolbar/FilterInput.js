import React from "react";
import PropTypes from "prop-types";
import { Filter } from "patternfly-react";
import { defineMessages, injectIntl, intlShape } from "react-intl";

const messages = defineMessages({
  filterNameTitle: {
    defaultMessage: "Name",
  },
  filterNamePlaceholder: {
    defaultMessage: "Filter by Name",
  },
  filterReleaseTitle: {
    defaultMessage: "Release",
  },
  filterReleasePlaceholder: {
    defaultMessage: "Filter by Release",
  },
  filterVersionTitle: {
    defaultMessage: "Version",
  },
  filterVersionPlaceholder: {
    defaultMessage: "Filter by Version",
  },
});

class FilterInput extends React.Component {
  constructor() {
    super();
    this.state = {
      filterValue: "",
      currentFilterId: "",
    };
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.selectFilterType = this.selectFilterType.bind(this);
  }

  componentDidMount() {
    this.setState({ currentFilterId: this.props.filters.defaultFilterType });
  }

  handleChangeFilter(event) {
    this.setState({ filterValue: event.target.value });
  }

  handleSubmitFilter(event) {
    event.preventDefault();
    this.props.filterAddValue({
      key: this.state.currentFilterId,
      value: this.state.filterValue,
    });
    this.setState({ filterValue: "" });
  }

  selectFilterType(filterType) {
    const { currentFilterId } = this.state;
    if (currentFilterId !== filterType.id) {
      this.setState({ currentFilterId: filterType.id });
    }
  }

  render() {
    const { emptyState, filters } = this.props;
    const currentFilterType = filters.filterTypes.find((type) => type.id === this.state.currentFilterId);
    const { formatMessage } = this.props.intl;
    const filterLabels = filters.filterTypes.map((filter) => {
      const message = `filter${filter.title}Title`;
      filter.title = messages[message] ? formatMessage(messages[message]) : filter.title;
      return filter;
    });

    const filterGroup = (filterID) => {
      switch (filterID) {
        case "name":
          return (
            <div className="input-group">
              <Filter.TypeSelector
                filterTypes={filterLabels}
                currentFilterType={formatMessage(messages.filterNameTitle)}
                onFilterTypeSelected={this.selectFilterType}
              />
              <input
                onChange={this.handleChangeFilter}
                disabled={emptyState}
                type="text"
                className="form-control"
                id="filter-blueprints"
                value={this.state.filterValue}
                placeholder={`${formatMessage(messages.filterNamePlaceholder)}...`}
                aria-label={formatMessage(messages.filterNamePlaceholder)}
              />
            </div>
          );
        case "release":
          return (
            <div className="input-group">
              <Filter.TypeSelector
                filterTypes={filterLabels}
                currentFilterType={formatMessage(messages.filterReleaseTitle)}
                onFilterTypeSelected={this.selectFilterType}
              />
              <input
                onChange={this.handleChangeFilter}
                disabled={emptyState}
                type="text"
                className="form-control"
                id="filter-blueprints"
                value={this.state.filterValue}
                placeholder={`${formatMessage(messages.filterReleasePlaceholder)}...`}
                aria-label={formatMessage(messages.filterReleasePlaceholder)}
              />
            </div>
          );
        case "version":
          return (
            <div className="input-group">
              <Filter.TypeSelector
                filterTypes={filterLabels}
                currentFilterType={formatMessage(messages.filterVersionTitle)}
                onFilterTypeSelected={this.selectFilterType}
              />
              <input
                onChange={this.handleChangeFilter}
                disabled={emptyState}
                type="text"
                className="form-control"
                id="filter-blueprints"
                value={this.state.filterValue}
                placeholder={`${formatMessage(messages.filterVersionPlaceholder)}...`}
                aria-label={formatMessage(messages.filterVersionPlaceholder)}
              />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <form onSubmit={(e) => this.handleSubmitFilter(e)}>
        <div className="filter-pf-fields">
          <div className="form-group toolbar-pf-filter">
            {currentFilterType !== undefined && filterGroup(currentFilterType.id)}
          </div>
        </div>
      </form>
    );
  }
}

FilterInput.propTypes = {
  emptyState: PropTypes.bool,
  filters: PropTypes.shape({
    defaultFilterType: PropTypes.string,
    filterTypes: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object),
  }),
  filterAddValue: PropTypes.func,
  intl: intlShape.isRequired,
};

FilterInput.defaultProps = {
  emptyState: false,
  filters: {},
  filterAddValue() {},
};

export default injectIntl(FilterInput);
