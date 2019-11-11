class Dependencies {
  constructor() {
    this.containerSelector = '[data-list="dependencies"]';
  }

  loading() {
    // wait for blank slate disappear
    browser.waitForExist('[id="blueprint-tabs"]', timeout);
    browser.waitForText(this.containerSelector, timeout);
  }

  get depencenciesList() {
    const selector = `${this.containerSelector} [data-component]`;
    browser.waitUntil(() => $(selector).isExisting(), timeout);
    return $$(selector);
  }
}

module.exports = new Dependencies();
