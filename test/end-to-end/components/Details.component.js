// component details inside Edit Blueprints page
class DetailsComponent {
  constructor(name) {
    this.name = name;
    this.containerSelector = ".cmpsr-panel__body--main";
  }

  get backToLink() {
    const selector = `${this.containerSelector} .cmpsr-header ol li a span`;
    browser.waitUntil(
      () => $(selector).isExisting(),
      timeout,
      `Back to link in Edit Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get xButton() {
    const selector = `${this.containerSelector} .cmpsr-header__actions .close span`;
    browser.waitUntil(
      () => $(selector).isExisting(),
      timeout,
      `x Button in Edit Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get addButton() {
    const selector = `${this.containerSelector} .cmpsr-header__actions .add span`;
    browser.waitUntil(
      () => $(selector).isExisting(),
      timeout,
      `x Button in Edit Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get componentNameLabel() {
    const selector = `${this.containerSelector} .cmpsr-title span`;
    browser.waitUntil(
      () => $(selector).isExisting(),
      timeout,
      `Component name label in Edit Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get dependenciesNumberBadge() {
    const selector = `${this.containerSelector} [data-badge="Dependencies"]`;
    browser.waitUntil(
      () => $(selector).isExisting(),
      timeout,
      `Dependencies total number badge in Edit Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get componentDescriptionLabel() {
    const selector = '[id="blueprint-tabs-pane-customizations"] .cmpsr-title';
    browser.waitUntil(
      () => $(selector).isExisting(),
      timeout,
      `Component description in Edit Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get depencenciesList() {
    const selector = `${this.containerSelector} .list-pf-item`;
    browser.waitUntil(() => browser.isExisting(selector), timeout, "No dependencies loaded in component details");
    return $$(selector);
  }
}

module.exports = DetailsComponent;
