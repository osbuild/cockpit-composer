// "Dependencies" tab in Edit Blueprint page
class Dependencies {
  constructor() {
    this.containerSelector = ".cmpsr-blueprint__dependencies";
  }

  loading() {
    // wait for blank slate disappear
    browser.waitForExist('[id="blueprint-tabs"]', timeout);
    browser.waitForText(this.containerSelector, timeout);
  }

  get depencenciesList() {
    const selector = `${this.containerSelector} .list-pf-item`;
    browser.waitUntil(() => browser.isExisting(selector), timeout, "No dependencies in Selected Component");
    return $$(selector);
  }
}

module.exports = new Dependencies();
