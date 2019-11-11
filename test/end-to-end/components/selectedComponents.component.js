class SelectedComponents {
  constructor() {
    this.containerSelector = '[data-list="components"]';
    this.components = '[data-list="components"] [data-component]';
  }

  loading() {
    // wait for blank slate disappear
    $('[id="blueprint-tabs"]').waitForDisplayed(timeout);
    browser.waitUntil(() => $(this.containerSelector).getText() !== "", timeout);
  }

  get packageList() {
    const selector = `${this.containerSelector} [data-component] [data-component-name]`;
    browser.waitUntil(() => $(selector).isExisting(), timeout, "No package added in Selected Component");
    return $$(selector);
  }

  packageByName(name) {
    return $(`[data-component="${name}"]`);
  }

  packageNameByNth(nth) {
    return $$(this.components)
      [nth].$(".cc-component__name a")
      .getText();
  }

  moreButtonByName(name) {
    return $(`[data-component=${name}] .fa-ellipsis-v`).element();
  }

  dropDownMenu(name) {
    return $(`[data-component=${name}] .dropdown-kebab-pf`).element();
  }

  removeItem(name) {
    return $(`[data-component=${name}]`)
      .$("span=Remove")
      .element();
  }

  angleRightButton(name) {
    return $(`#${name}-toggle[aria-expanded="false"]`).element();
  }

  angleDownButton(name) {
    return $(`#${name}-toggle[aria-expanded="true"]`).element();
  }

  loadingComponentExpansion(name) {
    $(`[data-component=${name}].pf-m-expanded .pf-c-data-list__expandable-content`).waitForExist(timeout);
  }

  loadingComponentCollapse(name) {
    const selector = `[data-component=${name}]`;
    browser.waitUntil(
      () =>
        $(selector)
          .getAttribute("class")
          .indexOf("pf-m-expanded") === -1,
      timeout
    );
  }

  componentDependenciesBadge(name) {
    return $(`[data-component=${name}] .badge`).element();
  }

  componentDependenciesList(name) {
    return $$(`[data-component=${name}] .cc-m-compact .pf-c-data-list__item`);
  }

  showAllLink(name) {
    return $(`[data-component=${name}] .cc-component-summary__deps button`).element();
  }

  showLessLink(name) {
    return $(`[data-component=${name}] .cc-component-summary__deps button`).element();
  }
}

module.exports = new SelectedComponents();
