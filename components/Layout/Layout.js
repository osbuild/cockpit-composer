import React from 'react';
import PropTypes from 'prop-types';
import Notification from '../../components/Notifications/Notification';
import NotificationsApi from '../../data/NotificationsApi';

class Layout extends React.Component {
  constructor() {
    super();
    this.state = { notifications: [] };
    this.setNotifications = this.setNotifications.bind(this);
  }

  componentWillMount() {
    this.setNotifications();
  }

  setNotifications() {
    this.setState({ notifications: NotificationsApi.getNotifications() });
  }

  render() {
    return (
      <div>
        {this.state.notifications &&
          <div className="toast-notifications-list-pf">
            {this.state.notifications.map((notification, i) =>
              <Notification
                notification={notification}
                id={i}
                key={i}
                setNotifications={this.setNotifications}
              />
            )}
          </div>
        }
        <div className={this.props.className}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  className: PropTypes.string,
  notifications: PropTypes.array,
  children: PropTypes.node,
};

export default Layout;
