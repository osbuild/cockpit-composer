import React from 'react';
import PropTypes from 'prop-types';
import FilterInput from '../../components/Toolbar/FilterInput';
import ToolbarLayout from '../../components/Toolbar/ToolbarLayout';

const BlueprintsToolbar = props => (
  <ToolbarLayout
    filters={props.filters}
    filterRemoveValue={props.filterRemoveValue}
    filterClearValues={props.filterClearValues}
  >
    <FilterInput emptyState={props.emptyState} filters={props.filters} filterAddValue={props.filterAddValue} />
    <div className="form-group">
    {props.sortKey === 'name' && props.sortValue === 'DESC' &&
      <button className="btn btn-link" type="button" disabled={props.emptyState} onClick={() => props.sortSetValue('ASC')}>
        <span className="fa fa-sort-alpha-asc" />
      </button>
    ||
    props.sortKey === 'name' && props.sortValue === 'ASC' &&
      <button className="btn btn-link" type="button" disabled={props.emptyState} onClick={() => props.sortSetValue('DESC')}>
        <span className="fa fa-sort-alpha-desc" />
      </button>
    }
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
          Create Blueprint
        </button>
      </div>
    </div>
  </ToolbarLayout>
);

BlueprintsToolbar.propTypes = {
  sortSetValue: PropTypes.func,
  errorState: PropTypes.bool,
};

export default BlueprintsToolbar;
