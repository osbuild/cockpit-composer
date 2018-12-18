// Blueprints Page
class BlueprintsPage {
  constructor(name) {
    this.name = name;
  }

  loading() {
    const selector = ".list-view-pf-view";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Loading Blueprints page failed because selector ${selector} cannot be found`
    );
    browser.waitForText(selector, timeout);
  }

  get sortAscButton() {
    const selector = ".fa-sort-alpha-asc";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Create Blueprint button in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get sortDescButton() {
    const selector = ".fa-sort-alpha-desc";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Create Blueprint button in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get createBlueprintButton() {
    // const selector = '[data-target="#cmpsr-modal-crt-blueprint"]';
    const selector = "span=Create Blueprint";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Create Blueprint button in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get filterBox() {
    const selector = '[id="filter-blueprints"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Filter box in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get clearAllFiltersLink() {
    const selector = "span=Clear All Filters";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Clear All Filters link in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get filterContentLabel() {
    const selector = ".filter-pf-active-label + .list-inline .label";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `A label showing filter content in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get filterContentLabelCloseButton() {
    const selector = ".filter-pf-active-label + .list-inline .pficon-close";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `X button of filter content label in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  waitForActiveFiltersExist() {
    browser.waitForExist("p=Active Filters:", timeout);
  }

  waitForActiveFiltersNotExist() {
    browser.waitForExist("p=Active Filters:", timeout, true);
  }

  get blueprintListView() {
    return ".list-view-pf-view .list-group-item";
  }
}

module.exports = new BlueprintsPage();
