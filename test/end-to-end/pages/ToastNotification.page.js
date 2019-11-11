class ToastNotificationPage {
  constructor(name) {
    this.containerSelector = `[id="cmpsr-toast-${name}"]`;
  }

  loading() {
    $(`${this.containerSelector} .pficon-ok`).waitForDisplayed(timeout);
  }

  loadingInfoNotification() {
    $(`${this.containerSelector} .pficon-info`).waitForDisplayed(timeout);
  }

  get closeButton() {
    return $(`${this.containerSelector} .pficon-close`).element();
  }
}

module.exports = ToastNotificationPage;
