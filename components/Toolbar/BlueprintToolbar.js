import React from 'react';
import PropTypes from 'prop-types';
import FilterInput from '../../components/Toolbar/FilterInput';
import ToolbarLayout from '../../components/Toolbar/ToolbarLayout';

const BlueprintToolbar = props => (
  <ToolbarLayout
    filters={props.filters}
    filterRemoveValue={props.filterRemoveValue}
    filterClearValues={props.filterClearValues}
  >
    <FilterInput emptyState={props.emptyState} filters={props.filters} filterAddValue={props.filterAddValue} />
    <div className="form-group">
      {props.componentsSortKey === 'name' && props.componentsSortValue === 'DESC' &&
        <button
          className="btn btn-link"
          type="button"
          disabled={props.emptyState}
          onClick={() => {
            props.componentsSortSetValue('ASC');
            props.dependenciesSortSetValue('ASC');
          }}
        >
          <span className="fa fa-sort-alpha-asc" />
        </button>
      ||
      props.componentsSortKey === 'name' && props.componentsSortValue === 'ASC' &&
        <button
          className="btn btn-link"
          type="button"
          disabled={props.emptyState}
          onClick={() => {
            props.componentsSortSetValue('DESC');
            props.dependenciesSortSetValue('DESC');
          }}
        >
          <span className="fa fa-sort-alpha-desc" />
        </button>
      }
    </div>
    {props.undo !== undefined &&
      <div className="form-group">
      {props.pastLength > 0 &&
        <button className="btn btn-link" type="button" onClick={() => {props.undo(props.blueprintId); props.handleHistory();}}>
          <span className="fa fa-undo" aria-hidden="true" />
        </button>
      ||
        <button
          className="btn btn-link disabled"
          type="button"
        >
          <span className="fa fa-undo" aria-hidden="true" />
        </button>
      }
      {props.futureLength > 0 &&
        <button className="btn btn-link" type="button" onClick={() => {props.redo(props.blueprintId); props.handleHistory();}}>
          <span className="fa fa-repeat" aria-hidden="true" />
        </button>
      ||
        <button
          className="btn btn-link disabled"
          type="button"
        >
          <span className="fa fa-repeat" aria-hidden="true" />
        </button>
      }
      </div>}
  </ToolbarLayout>
);

BlueprintToolbar.propTypes = {
  handleHistory: PropTypes.func,
};

export default BlueprintToolbar;
