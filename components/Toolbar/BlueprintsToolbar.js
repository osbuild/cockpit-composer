import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import FilterInput from "./FilterInput";
import ToolbarLayout from "./ToolbarLayout";

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
        <button
          className="btn btn-default"
          type="button"
          data-toggle="modal"
          data-target="#cmpsr-modal-crt-blueprint"
          disabled={props.errorState}
        >
          <FormattedMessage defaultMessage="Create Blueprint" />
        </button>
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
              <a href="#" onClick={e => props.handleShowModalManageSources(e)}>
                <FormattedMessage
                  defaultMessage="View Sources"
                  description="User action for displaying the list of source repositories"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ToolbarLayout>
);

BlueprintsToolbar.propTypes = {
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
  handleShowModalManageSources: PropTypes.func,
  emptyState: PropTypes.bool,
  sortKey: PropTypes.string,
  sortValue: PropTypes.string
};

export default BlueprintsToolbar;
