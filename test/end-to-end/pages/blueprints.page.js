// Blueprints Page
class BlueprintsPage {
  constructor(name) {
    this.name = name;
  }

  get blueprintListView() {
    return ".list-view-pf-view .list-group-item";
  }

  loading() {
    $(this.blueprintListView).waitForExist(timeout);
    browser.waitUntil(() => $$(this.blueprintListView).length >= 3, timeout, "Loading Blueprints page failed");
  }

  filterLoading() {
    $(this.blueprintListView).waitForExist(timeout);
    browser.waitUntil(() => $$(this.blueprintListView).length === 1, timeout, "Filtered blueprint does not exist");
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
    const selector = '[id="cmpsr-btn-crt-blueprint"]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Create Blueprint button in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get moreButton() {
    const selector = ".toolbar-pf-action-right .fa-ellipsis-v";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `: button in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get viewSourcesItem() {
    const selector = "span=Manage Sources";
    browser.waitUntil(
      () =>
        $(".toolbar-pf-action-right .dropdown-kebab-pf")
          .getAttribute("class")
          .includes("open") && browser.isVisible(selector),
      timeout,
      `Manage Sources dropdown item in Blueprints page cannot be found by selector ${selector}`
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

  get serviceStartButton() {
    const selector = ".blank-slate-pf-main-action button";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Start button in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get autostartCheckbox() {
    const selector = ".blank-slate-pf .checkbox label input";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Autostart on boot checkbox in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new BlueprintsPage();
