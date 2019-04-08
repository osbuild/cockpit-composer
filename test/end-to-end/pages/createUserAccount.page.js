// Create User Account
class CreateUserAccount {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-user-account"]';
  }

  loading() {
    // sometimes the style attribute is style="display: block; padding-right: 12px;"
    browser.waitUntil(
      () => browser.isExisting(this.containerSelector),
      timeout,
      "Cannot pop up Create User Account dialog"
    );
  }

  get fullNameBox() {
    const selector = `${this.containerSelector} [id="textInput2-modal-user"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Full name input box in Create User Account dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get userNameBox() {
    const selector = `${this.containerSelector} [id="textInput1-modal-user"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `user name input box in Create User Account dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get userErrorLabel() {
    const selector = `${this.containerSelector} [id="textInput1-modal-user-help1"]`;
    browser.waitForExist(selector, timeout);
    return $(selector);
  }

  get roleCheckbox() {
    const selector = `${this.containerSelector} input[type="checkbox"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Role checkbox in Create User Account dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get passwordBox() {
    const selector = `${this.containerSelector} [id="textInput1-modal-password"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Password input box in Create User Account dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get confirmPasswordBox() {
    const selector = `${this.containerSelector} [id="textInput2-modal-password"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Confirm Password input box in Create User Account dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get passwordStrengthMeter() {
    const selector = `${this.containerSelector} [id="accounts-create-password-meter"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Password strength meter indicator in Create User Account dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get passwordErrorLabel1() {
    const selector = `${this.containerSelector} [id="textInput2-modal-password-help"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Password warning label 1 in Create User Account dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get passwordErrorLabel2() {
    const selector = `${this.containerSelector} [id="textInput2-modal-password-help2"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Password warning label 2 in Create User Account dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get sshKeyBox() {
    const selector = `${this.containerSelector} [id="textInput5-modal-user"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `SSH public key input box in Create User Account dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get createButton() {
    const selector = `${this.containerSelector} [type="submit"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Create button in Create User Account dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get cancelButton() {
    const selector = "span=Cancel";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Cancel button in Create User Account dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  clickXButton() {
    const selector = `${this.containerSelector} .close`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `X button in Create User Account dialog cannot be found by selector ${selector}`
    );
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute(xButton => {
      document.querySelector(xButton).click();
      return true;
    }, selector);
  }
}

module.exports = new CreateUserAccount();
