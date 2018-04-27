import React from 'react';
import {FormattedMessage} from 'react-intl';

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
      for (let i = 0; i < this.notifications.length; i++) {
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
      case 'creating': {
        notification = {
          type: 'process',
          message: <span>
            <FormattedMessage
              defaultMessage="{blueprint} Creating image."
              values={{
                blueprint: <strong>{blueprint}:</strong>
              }}
            />
          </span>,
          action: <a href="#"><FormattedMessage defaultMessage="Cancel" /></a>,
          dismiss: true,
        };
        const index = this.notifications.length;
        setTimeout(() => {
          this.closeNotification(index);
          this.displayNotification(blueprint, 'created');
        }, 2500);
        // setTimeout is only temporary, and included to simulate what will happen
        // when the user creates an image (i.e. display process message
        // then success notification); this should be updated
        // when image creation is fully implemented
        break;
      }
      case 'created': {
        notification = {
          type: 'success',
          message: <span>
            <FormattedMessage
              defaultMessage="{blueprint} Image creation is complete."
              values={{
                blueprint: <strong>{blueprint}:</strong>
              }}
            />
          </span>,
          // action: <a href="#void">Download (.iso)</a>,
          // this link will need to be implemented when the build process
          // is implemented; this function will need to be extended to handle
          // defining this link
          // kebab: [
          //   <a href="#" >Export Blueprint (.bom)</a>,
          // ],
          // this kebab may be needed when the build process is implemented
          fade: true,
        };
        break;
      }
      case 'committing': {
        notification = {
          type: 'process',
          label: 'committing',
          message: <span>
            <FormattedMessage
              defaultMessage="{blueprint} Committing blueprint."
              values={{
                blueprint: <strong>{blueprint}:</strong>
              }}
            />
          </span>,
          dismiss: true,
        };
        break;
      }
      case 'committed': {
        notification = {
          type: 'success',
          label: 'committed',
          message: <span>
            <FormattedMessage
              defaultMessage="{blueprint} Blueprint changes are committed."
              values={{
                blueprint: <strong>{blueprint}:</strong>
              }}
            />
          </span>,
          dismiss: true,
          fade: true,
        };
        break;
      }
      case 'commitFailed': {
        notification = {
          type: 'error',
          message: <span>
            <FormattedMessage
              defaultMessage="{blueprint} Commit failed."
              values={{
                blueprint: <strong>{blueprint}:</strong>
              }}
            />
          </span>,
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
