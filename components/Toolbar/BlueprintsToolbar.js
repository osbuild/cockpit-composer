import React from "react";
import PropTypes from "prop-types";
import FilterInput from "./FilterInput";
import ToolbarLayout from "./ToolbarLayout";
import CreateBlueprint from "../Modal/CreateBlueprint";
import ManageSources from "../Modal/ManageSources";

const BlueprintsToolbar = props => (
  <ToolbarLayout
    filters={props.filters}
    filterRemoveValue={props.filterRemoveValue}
    filterClearValues={props.filterClearValues}
  >
    <FilterInput emptyState={props.emptyState} filters={props.filters} filterAddValue={props.filterAddValue} />
    <div className="form-group">
      {(props.sortKey === "name" && props.sortValue === "DESC" && (
        <button
          className="btn btn-link"
          type="button"
          disabled={props.emptyState}
          onClick={() => props.sortSetValue("ASC")}
        >
          <span className="fa fa-sort-alpha-asc" />
        </button>
      )) ||
        (props.sortKey === "name" && props.sortValue === "ASC" && (
          <button
            className="btn btn-link"
            type="button"
            disabled={props.emptyState}
            onClick={() => props.sortSetValue("DESC")}
          >
            <span className="fa fa-sort-alpha-desc" />
          </button>
        ))}
    </div>
    <div className="toolbar-pf-action-right">
      <div className="form-group">
        <CreateBlueprint blueprintNames={props.blueprintNames} disabled={props.errorState} />
        <div className="dropdown btn-group dropdown-kebab-pf">
          <button
            className="btn btn-link dropdown-toggle"
            type="button"
            id="dropdownKebab"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="fa fa-ellipsis-v" />
          </button>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebab">
            <li>
              <ManageSources manageSources={props.manageSources} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ToolbarLayout>
);

BlueprintsToolbar.propTypes = {
  blueprintNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  filters: PropTypes.shape({
    defaultFilterType: PropTypes.string,
    filterTypes: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object)
  }),
  filterRemoveValue: PropTypes.func,
  filterAddValue: PropTypes.func,
  filterClearValues: PropTypes.func,
  sortSetValue: PropTypes.func,
  errorState: PropTypes.bool,
  emptyState: PropTypes.bool,
  sortKey: PropTypes.string,
  sortValue: PropTypes.string,
  manageSources: PropTypes.shape({
    fetchingSources: PropTypes.bool,
    sources: PropTypes.objectOf(PropTypes.object),
    error: PropTypes.object
  })
};

BlueprintsToolbar.defaultProps = {
  filters: {},
  filterRemoveValue: function() {},
  filterAddValue: function() {},
  filterClearValues: function() {},
  sortSetValue: function() {},
  errorState: false,
  emptyState: false,
  sortKey: "",
  sortValue: "",
  manageSources: {}
};

export default BlueprintsToolbar;
