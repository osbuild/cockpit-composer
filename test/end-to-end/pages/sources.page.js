class SourcesPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-manage-sources"]';
  }

  loading() {
    browser.waitUntil(
      () => browser.isExisting(this.containerSelector),
      timeout,
      `Loading Blueprints page failed because selector ${this.containerSelector} cannot be found`
    );
  }

  get title() {
    const selector = `${this.containerSelector} [id="title-manage-sources"] span`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Title in Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get closeButton() {
    const selector = `${this.containerSelector} .modal-footer button span`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Close button in Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new SourcesPage();
