import React from 'react';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';

const messages = defineMessages({
  filterPlaceholder: {
    defaultMessage: "Filter By Name..."
  }
});

const Toolbar = props => (
  <div className="toolbar-pf">
    <form className="toolbar-pf-actions">
      <div className="form-group toolbar-pf-filter">
        <label className="sr-only" htmlFor="filter"><FormattedMessage defaultMessage="Name" /></label>
        <div className="input-group">
          <div className="input-group-btn">
            <button
              type="button"
              className="btn btn-default dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <FormattedMessage defaultMessage="Name" /><span className="caret" />
            </button>
            <ul className="dropdown-menu">
              <li><a><FormattedMessage defaultMessage="Name" /></a></li>
              <li><a><FormattedMessage defaultMessage="Version" /></a></li>
            </ul>
          </div>
          <input 
            type="text"
            className="form-control"
            id="filter"
            placeholder={props.intl.formatMessage(messages.filterPlaceholder)}
          />
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
            <FormattedMessage defaultMessage="Name" /><span className="caret" />
          </button>
          <ul className="dropdown-menu">
            <li><a><FormattedMessage defaultMessage="Name" /></a></li>
            <li><a><FormattedMessage defaultMessage="Version" /></a></li>
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
      </div>
    </form>
  </div>
);

Toolbar.propTypes = {
  handleHistory: PropTypes.func,
  intl: intlShape.isRequired,
};

export default injectIntl(Toolbar);
