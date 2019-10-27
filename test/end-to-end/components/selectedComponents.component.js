// "Blueprint Components" component in Edit Blueprint page
class SelectedComponents {
  constructor() {
    this.containerSelector = '[data-list="components"]';
    this.components = '[data-list="components"] [data-component]';
  }

  loading() {
    // wait for blank slate disappear
    browser.waitForExist('[id="blueprint-tabs"]', timeout);
    browser.waitForText(this.containerSelector, timeout);
  }

  get packageList() {
    const selector = `${this.containerSelector} [data-component] [data-component-name]`;
    browser.waitUntil(() => browser.isExisting(selector), timeout, "No package added in Selected Component");
    return $$(selector);
  }

  packageNameByNth(nth) {
    return $$(this.components)
      [nth].$(".cc-component__name a")
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
    const selector = `#${name}-toggle[aria-expanded="false"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `> button inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  clickAngleDownButton(name) {
    const selector = `#${name}-toggle[aria-expanded="true"]`;
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
    const selector = `[data-component=${name}].pf-m-expanded .pf-c-data-list__expandable-content`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Cannot load component expansion for ${name} component in Selected Component`
    );
  }

  loadingComponentCollapse(name) {
    const selector = `[data-component=${name}]`;
    browser.waitUntil(
      () => browser.getAttribute(selector, "class").indexOf("pf-m-expanded") === -1,
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
    const selector = `[data-component=${name}] .cc-m-compact .pf-c-data-list__item`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Dependencies list inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $$(selector);
  }

  showAllLink(name) {
    const selector = `[data-component=${name}] .cc-component-summary__deps button`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `"Show All" link inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  showLessLink(name) {
    const selector = `[data-component=${name}] .cc-component-summary__deps button`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `"Show Less" link inside ${name} component in Selected Component cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new SelectedComponents();
