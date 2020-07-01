import React from "react";
import { FormattedMessage } from "react-intl";

class NotificationsApi {
  constructor() {
    this.notifications = [];
  }

  getNotifications() {
    return this.notifications;
  }

  displayNotification(blueprint, message) {
    const notification = this.notificationMessage(blueprint, message);
    this.notifications.push(notification);
  }

  closeNotification(id, label) {
    let index = id;
    if (index === undefined) {
      for (let i = 0; i < this.notifications.length; i += 1) {
        if (this.notifications[i].label === label) {
          index = i;
        }
      }
    }
    if (index !== undefined) {
      this.notifications.splice(index, 1);
    }
  }

  notificationMessage(blueprint, message) {
    let notification = {};
    switch (message) {
      case "imageWaiting": {
        notification = {
          id: "imageWaiting",
          type: "info",
          message: (
            <span>
              <FormattedMessage
                defaultMessage="{blueprint} Image creation has been added to the {queue}."
                values={{
                  blueprint: <strong>{blueprint}:</strong>,
                  queue: <a href={`#blueprint/${blueprint}/images`}>queue</a>,
                }}
              />
            </span>
          ),
          dismiss: true,
          fade: true,
        };
        break;
      }
      case "imageStarted": {
        notification = {
          id: "imageStarted",
          type: "success",
          message: (
            <span>
              <FormattedMessage
                defaultMessage="{blueprint} Image creation has started."
                values={{
                  blueprint: <strong>{blueprint}:</strong>,
                }}
              />
            </span>
          ),
          dismiss: true,
          fade: true,
        };
        break;
      }
      case "imageCreated": {
        notification = {
          id: "imageCreated",
          type: "success",
          message: (
            <span>
              <FormattedMessage
                defaultMessage="{blueprint} Image creation is complete."
                values={{
                  blueprint: <strong>{blueprint}:</strong>,
                }}
              />
            </span>
          ),
          dismiss: true,
          fade: true,
        };
        break;
      }
      case "imageFailed": {
        notification = {
          id: "imageFailed",
          type: "error",
          message: (
            <span>
              <FormattedMessage
                defaultMessage="{blueprint} Image creation failed."
                values={{
                  blueprint: <strong>{blueprint}:</strong>,
                }}
              />
            </span>
          ),
          dismiss: true,
          fade: true,
        };
        break;
      }
      case "committing": {
        notification = {
          id: "committing",
          type: "process",
          label: "committing",
          message: (
            <span>
              <FormattedMessage
                defaultMessage="{blueprint} Committing blueprint."
                values={{
                  blueprint: <strong>{blueprint}:</strong>,
                }}
              />
            </span>
          ),
          dismiss: true,
        };
        break;
      }
      case "committed": {
        notification = {
          id: "committed",
          type: "success",
          label: "committed",
          message: (
            <span>
              <FormattedMessage
                defaultMessage="{blueprint} Blueprint changes are committed."
                values={{
                  blueprint: <strong>{blueprint}:</strong>,
                }}
              />
            </span>
          ),
          dismiss: true,
          fade: true,
        };
        break;
      }
      case "commitFailed": {
        notification = {
          id: "commitFailed",
          type: "error",
          message: (
            <span>
              <FormattedMessage
                defaultMessage="{blueprint} Commit failed."
                values={{
                  blueprint: <strong>{blueprint}:</strong>,
                }}
              />
            </span>
          ),
          dismiss: true,
        };
        break;
      }
      default: {
        notification = {};
      }
    }
    return notification;
  }
}

export default new NotificationsApi();
