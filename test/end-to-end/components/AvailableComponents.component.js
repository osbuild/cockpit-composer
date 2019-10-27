// "Available Components" component in Edit Blueprint page
class AvailableComponents {
  constructor(n = 0) {
    if (n !== 0) {
      this.containerSelector = `[data-list='inputs'] [data-input]:nth-child(${n})`;
    } else {
      this.containerSelector = "[data-list='inputs'] [data-input]";
    }
  }

  addPackageByNth() {
    const selector = `${this.containerSelector} .fa-plus`;
    browser.waitUntil(
      () => $(selector).isVisible(),
      timeout,
      `+ button in "Available Component" component of Edit Blueprint page cannot be found by selector ${selector}`
    );
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute(plusButton => {
      document.querySelector(plusButton).click();
      return true;
    }, selector);
  }

  get nameLabel() {
    const selector = `${this.containerSelector} [data-input-name]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Component name in Available Component in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  nameLabelByName(name) {
    const selector = `[data-input=${name}] [data-input-name]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Component name in Available Component in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  clickNameLabelByName(name) {
    const selector = `[data-input=${name}] [data-input-name]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Component name in Available Component in Edit Blueprint page cannot be found by selector ${selector}`
    );
    browser.execute(nameLabel => {
      document.querySelector(nameLabel).click();
      return true;
    }, selector);
  }

  descriptionLabelByName(name) {
    const selector = `[data-input=${name}] [data-input-description]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Component description in Avaliable Component in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  addPackageByName(name) {
    const plusButton = `[data-input=${name}] .fa-plus`;
    browser.waitForExist(plusButton, timeout);
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute(button => {
      document.querySelector(button).click();
      return true;
    }, plusButton);
  }

  removePackageByName(name) {
    const minusButton = `[data-input=${name}] .fa-minus`;
    browser.waitForExist(minusButton, timeout);
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute(button => {
      document.querySelector(button).click();
      return true;
    }, minusButton);
  }

  iconByName(name) {
    return $(`[data-input=${name}] .pficon-bundle`);
  }
}

module.exports = AvailableComponents;
