/* global $ */

import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Link from '../Link';
import history from '../../core/history';
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "Pf*" }]*/
// without these imports the entire app will produce an error when loaded
import PfBreakpoints from './PfBreakpoints';
import PfVerticalNavigation from './PfVerticalNavigation';

const messages = defineMessages({
  blueprints: {
    defaultMessage: "BluePrints"
  }
});

class Navigation extends React.Component {

  componentDidMount() {
    // Initialize the vertical navigation
    $().setupVerticalNavigation(true);
  }

  handleNavClick = (e) => {
    $(e.target).tooltip('hide');
  }

  render() {
    const location = history.getCurrentLocation();
    const { formatMessage } = this.props.intl;
    return (
      <div className="nav-pf-vertical">
        <ul className="list-group">
          <li className={`list-group-item${location.pathname === '/' || location.pathname === '/blueprints' ? ' active' : ''}`}>
            <Link to="/blueprints">
              <span
                className="fa fa-shield"
                data-toggle="tooltip"
                title={formatMessage(messages.blueprints)}
                onClick={(e) => this.handleNavClick(e)}
              >
              </span>
              <span className="list-group-item-value">{formatMessage(messages.blueprints)}</span>
            </Link>
          </li>
        </ul>
      </div>
    );
  }

}

Navigation.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Navigation);
