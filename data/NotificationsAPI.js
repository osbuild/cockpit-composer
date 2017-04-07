import React from 'react';

class NotificationsApi {
  constructor() {
    this.notifications = [];
  }

  getNotifications() {
    return this.notifications;
  }

  displayNotification(recipe, message) {
    const notification = {};
    if (message === 'creating') {
      notification.type = 'process';
      notification.message = <span><strong>{recipe}:</strong> Creating composition.</span>;
      notification.action = <a href="#">Cancel</a>;
      notification.dismiss = true;
      const index = this.notifications.length;
      setTimeout(() => {
        this.closeNotification(index);
        this.displayNotification(recipe, 'created');
      }, 2500);
      // setTimeout is only temporary, and included to simulate what will happen
      // when the user creates a composition (i.e. display process message
      // then success notification); this should be updated
      // when composition creation is fully implemented
    } else if (message === 'created') {
      notification.type = 'success';
      notification.message = <span><strong>{recipe}:</strong> Composition creation is complete.</span>;
      // notification.action = <a href="#void">Download (.iso)</a>;
      notification.kebab = [
        <a href="#" id="cmpsr-bom-link">Export Recipe (.bom)</a>,
      ];
      notification.fade = true;
    }
    this.notifications.push(notification);
  }

  closeNotification(id) {
    this.notifications.splice(id, 1);
  }

}

export default new NotificationsApi();
