import React from 'react';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';

const messages = defineMessages({
  helpTitle: {
    defaultMessage: "Help"
  },
  noNewNotifications: {
    defaultMessage: "No new notifications"
  },
  username: {
    defaultMessage: "Username"
  }
});

function Header(props) {
  return (
    <nav className="navbar navbar-pf-vertical">
      <div className="navbar-header">
        <a href="/" className="navbar-brand">
          <img className="navbar-brand-name" src="/logo-header.svg" alt="" width="220" />
        </a>
      </div>
      <nav className="collapse navbar-collapse">
        <ul className="nav navbar-nav navbar-right navbar-iconic">
          <li className="dropdown">
            <a
              className="nav-item-iconic"
              id="notifications"
            >
              <span className="fa fa-bell-o" title={props.intl.formatMessage(messages.noNewNotifications)}></span>
            </a>
          </li>
          <li className="dropdown">
            <a
              className="dropdown-toggle nav-item-iconic"
              id="dropdownMenu1"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <span title={props.intl.formatMessage(messages.helpTitle)} className="fa pficon-help"></span>
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a ><FormattedMessage defaultMessage="Help" /></a></li>
              <li><a ><FormattedMessage defaultMessage="About" /></a></li>
            </ul>
          </li>
          <li className="dropdown">
            <a
              className="dropdown-toggle nav-item-iconic"
              id="dropdownMenu2"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <span title={props.intl.formatMessage(messages.username)} className="fa pficon-user"></span>
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <li><a ><FormattedMessage defaultMessage="Preferences" /></a></li>
              <li><a ><FormattedMessage defaultMessage="Logout" /></a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </nav>
  );
}

Header.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Header);
