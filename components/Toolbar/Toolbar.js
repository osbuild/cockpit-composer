import React from 'react';
import PropTypes from 'prop-types';

const Toolbar = props => (
  <div className="toolbar-pf">
    <form className="toolbar-pf-actions">
      <div className="form-group toolbar-pf-filter">
        <label className="sr-only" htmlFor="filter">Name</label>
        <div className="input-group">
          <div className="input-group-btn">
            <button
              type="button"
              className="btn btn-default dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Name<span className="caret" />
            </button>
            <ul className="dropdown-menu">
              <li><a>Name</a></li>
              <li><a>Version</a></li>
            </ul>
          </div>
          <input type="text" className="form-control" id="filter" placeholder="Filter By Name..." />
        </div>
      </div>
      <div className="form-group">
        <div className="dropdown btn-group">
          <button
            type="button"
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Name<span className="caret" />
          </button>
          <ul className="dropdown-menu">
            <li><a>Name</a></li>
            <li><a>Version</a></li>
          </ul>
        </div>
        {props.componentsSortKey === 'name' && props.componentsSortValue === 'DESC' &&
          <button
            className="btn btn-link"
            type="button"
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
            onClick={() => {
              props.componentsSortSetValue('DESC');
              props.dependenciesSortSetValue('DESC');
            }}
          >
            <span className="fa fa-sort-alpha-desc" />
          </button>
        }
      </div>
      <div className="form-group">
      {props.pastLength > 0 &&
        <button className="btn btn-link" type="button" onClick={() => {props.undo(props.recipeId); props.handleHistory();}}>
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
        <button className="btn btn-link" type="button" onClick={() => {props.redo(props.recipeId); props.handleHistory();}}>
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
      </div>
    </form>
  </div>
);

Toolbar.propTypes = {
  handleHistory: PropTypes.func,
};

export default Toolbar;
