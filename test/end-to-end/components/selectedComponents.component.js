// "Blueprint Components" component in Edit Blueprint page
class SelectedComponents {
  constructor() {
    this.containerSelector = '.cmpsr-blueprint__components';
    this.components = '.cmpsr-blueprint__components > .list-pf-item';
  }

  loading() {
    // wait for blank slate disappear
    browser.waitForExist('[id="blueprint-tabs"]', timeout);
    browser.waitForText(this.containerSelector, timeout);
  }

  get packageList() {
    const selector = `${this.containerSelector} .list-pf-container .list-pf-title`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      'No package added in Selected Component'
    );
    return $$(selector);
  }

  packageNameByNth(nth) {
    return $$(this.components)[nth].$('.list-pf-title a').getText();
  }

  moreButtonByName(name) {
    const selector = `[data-component=${name}] .fa-ellipsis-v`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `: button inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new SelectedComponents();