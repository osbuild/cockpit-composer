//Changes Pending Commit Page
class PendingCommitPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-pending-changes"]';
  }

  loading() {
    browser.waitForExist(this.containerSelector, timeout);
  }

  commit() {
    const selector = `${this.containerSelector} .modal-footer button[class="btn btn-primary"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Commit button in Changes Pending Commit dialog cannot be found by selector ${selector}`
    );
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute(commitButton => {
      document.querySelector(commitButton).click();
      return true;
    }, selector);
  }

  get closeButton() {
    const selector = "button=Close";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Close button in Changes Pending Commit dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get xButton() {
    const selector = `${this.containerSelector} .pficon-close`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `X button in Changes Pending Commit dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get infoMessage() {
    const selector = "span=Only changes to selected components are shown.";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Info message in Changes Pending Commit dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get blueprintNameLabel() {
    const selector = `${this.containerSelector} .form-horizontal > p`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint name label in Changes Pending Commit dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get changeLogList() {
    return $$(`${this.containerSelector} .form-horizontal ul li`);
  }

  actionNameOnNth(nth) {
    return $$(`${this.containerSelector} .form-horizontal ul li .col-sm-3`)[nth].getText();
  }

  changedPackageNameOnNth(nth) {
    return $$(`${this.containerSelector} .form-horizontal ul li .col-sm-9`)[nth].getText();
  }
}

module.exports = new PendingCommitPage();
