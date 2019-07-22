// "Blueprint Components" component in Edit Blueprint page
class SelectedComponents {
  constructor() {
    this.containerSelector = ".cmpsr-blueprint__components";
    this.components = ".cmpsr-blueprint__components > .list-pf-item";
  }

  loading() {
    // wait for blank slate disappear
    browser.waitForExist('[id="blueprint-tabs"]', timeout);
    browser.waitForText(this.containerSelector, timeout);
  }

  get packageList() {
    const selector = `${this.containerSelector} .list-pf-container .list-pf-title`;
    browser.waitUntil(() => browser.isExisting(selector), timeout, "No package added in Selected Component");
    return $$(selector);
  }

  packageNameByNth(nth) {
    return $$(this.components)
      [nth].$(".list-pf-title a")
      .getText();
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

  angleRightButton(name) {
    const selector = `[data-component=${name}] .fa-angle-right`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `> button inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  clickAngleDownButton(name) {
    const selector = `[data-component=${name}] .fa-angle-down`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `v button inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    browser.execute(angleDownButton => {
      document.querySelector(angleDownButton).click();
      return true;
    }, selector);
  }

  loadingComponentExpansion(name) {
    browser.waitUntil(
      () => browser.getAttribute(`[data-component=${name}] .list-pf-expansion`, "class").includes("in"),
      timeout,
      `Cannot load component expansion for ${name} component in Selected Component`
    );
  }

  loadingComponentCollapse(name) {
    browser.waitUntil(
      () => browser.getAttribute(`[data-component=${name}] .list-pf-expansion`, "class").indexOf("in") === -1,
      timeout,
      `Cannot load component collapse for ${name} component in Selected Component`
    );
  }

  componentDependenciesBadge(name) {
    const selector = `[data-component=${name}] .badge`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Dependencies badge inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  componentDependenciesList(name) {
    const selector = `[data-component=${name}] .cmpsr-list-pf__compacted .list-pf-item`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Dependencies list inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $$(selector);
  }

  showAllLink(name) {
    const selector = `[data-component=${name}] .cmpsr-summary-listview .pull-right span`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `"Show All" link inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  showLessLink(name) {
    const selector = `[data-component=${name}] .cmpsr-summary-listview .pull-right span`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `"Show Less" link inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new SelectedComponents();
