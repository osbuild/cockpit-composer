// Toast Notification Commit Page
class ToastNotificationPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-toast-0"]';
  }

  loading() {
    const selector = `${this.containerSelector} .pficon-ok`
    browser.waitForVisible(selector, timeout);
  }

  loadingInfoNotification() {
    const selector = `${this.containerSelector} .pficon-info`
    browser.waitForVisible(selector, timeout);
  }

  close() {
    const selector = `${this.containerSelector} .pficon-close`
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `X button in Toast Notification dialog cannot be found by selector ${selector}`
    );
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute((closeButton) => {
      document.querySelector(closeButton).click();
      return true;
    }, selector);
  }
}

module.exports = new ToastNotificationPage();
