// "Available Components" component in Edit Blueprint page
class AvailableComponents {
  constructor(n=0) {
    if(n !== 0) {
      this.containerSelector = `.cmpsr-list-pf__compacted .list-pf-item:nth-child(${n})`
    } else {
      this.containerSelector = '.cmpsr-list-pf__compacted .list-pf-item';
    }
  }

  addComponent() {
    const selector = `${this.containerSelector} .fa-plus`;
    browser.waitUntil(
      () => $(selector).isVisible(),
      timeout,
      `+ button in "Available Component" component of Edit Blueprint page cannot be found by selector ${selector}`
    );
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute((plusButton) => {
      document.querySelector(plusButton).click();
      return true;
    }, selector);
  }

  get nameLabel() {
    const selector = `${this.containerSelector} .list-pf-title`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Package name of "Available Component" component in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  nthSelectorByName(name) {
    const tmpArray = $$('.cmpsr-list-pf__compacted .list-pf-item').map(item => item.$('.list-pf-title').getText());
    const nth = tmpArray.indexOf(name);
    return `.cmpsr-list-pf__compacted .list-pf-item:nth-child(${nth+1})`;
  }

  addPackageByName(name) {
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute((plusButton) => {
      document.querySelector(plusButton).click();
      return true;
    }, `${this.nthSelectorByName(name)} .fa-plus`);
  }

  removePackageByName(name) {
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute((plusButton) => {
      document.querySelector(plusButton).click();
      return true;
    }, `${this.nthSelectorByName(name)} .fa-minus`);
  }

  iconByName(name) {
    return `${this.nthSelectorByName(name)} .pficon-bundle`;
  }
}

module.exports = AvailableComponents;