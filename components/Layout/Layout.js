import React from "react";
import PropTypes from "prop-types";
import Notification from "../Notifications/Notification";
import NotificationsApi from "../../data/NotificationsApi";

class Layout extends React.Component {
  constructor() {
    super();
    this.state = { notifications: [] };
    this.setNotifications = this.setNotifications.bind(this);
  }

  componentDidMount() {
    this.setNotifications();
  }

  setNotifications() {
    this.setState({ notifications: NotificationsApi.getNotifications() });
  }

  render() {
    const { className, children } = this.props;
    const { notifications } = this.state;
    return (
      <div>
        {notifications && (
          <div className="toast-notifications-list-pf">
            {notifications.map((notification) => (
              <Notification
                notification={notification}
                id={notification.id}
                key={notification.id}
                setNotifications={this.setNotifications}
              />
            ))}
          </div>
        )}
        <div className={className}>{children}</div>
      </div>
    );
  }
}

Layout.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Layout;
