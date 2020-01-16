class DetailsComponent {
  constructor(name) {
    this.name = name;
    this.containerSelector = ".cmpsr-panel__body--main";
  }

  get backToLink() {
    return $(`${this.containerSelector} .cmpsr-header ol li a span`).element();
  }

  get addButton() {
    return $(`${this.containerSelector} .cmpsr-header__actions .add span`).element();
  }

  get componentOptionsBox() {
    return $(`${this.containerSelector} .cmpsr-component-details__form`).element()
  }

  get componentNameLabel() {
    return $(`${this.containerSelector} .cmpsr-title span`).element();
  }

  get dependenciesNumberBadge() {
    return $(`${this.containerSelector} [data-badge="Dependencies"]`).element();
  }

  get componentDescriptionLabel() {
    return $('[id="blueprint-tabs-pane-details"] .cmpsr-title').element();
  }

  get depencenciesList() {
    const selector = `${this.containerSelector} [data-component]`;
    browser.waitUntil(() => $(selector).isExisting(), timeout);
    return $$(selector);
  }
}

module.exports = DetailsComponent;
