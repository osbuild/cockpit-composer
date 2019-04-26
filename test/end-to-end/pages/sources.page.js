class SourcesPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-manage-sources"]';
    this.addSourceContainerSelector = '[id="cmpsr-form-add-source"]';
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

  get xButton() {
    const selector = `${this.containerSelector} button[class="close"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `X button in Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get addSourceButton() {
    const selector = `${this.containerSelector} [value="Add Source"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Add Source button in Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get sourceNameList() {
    const selector = ".cmpsr-list-sources .list-pf-item .list-pf-title";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Source name in Sources dialog cannot be found by selector ${selector}`
    );
    return $$(selector);
  }

  sourceName(name) {
    const selector = `${this.containerSelector} [data-source=${name}] .list-pf-title`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Source name in Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  sourceUrl(name) {
    const selector = `${this.containerSelector} [data-source=${name}] .list-pf-additional-content`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Source URL in Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  sourceType(name) {
    const selector = `${this.containerSelector} [data-source=${name}] .list-pf-description span strong`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Source type in Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  editButton(name) {
    const selector = `${this.containerSelector} [data-source=${name}] [aria-label="Edit Source ${name}"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Edit button in Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  moreButton(name) {
    const selector = `${this.containerSelector} [data-source=${name}] [aria-label="Source Actions ${name}"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `: button in Sources dialog cannot be found by selector ${selector}`
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

  // Add source
  get sourceNameInput() {
    const selector = `${this.addSourceContainerSelector} [id="textInput1-modal-source"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Name input box in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get sourcePathInput() {
    const selector = `${this.addSourceContainerSelector} [id="textInput2-modal-source"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Source path input box in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get duplicatedPathWarning() {
    const selector = `${this.addSourceContainerSelector} [id="textInput2-modal-source-help"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Warning for duplicated path in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get sourceTypeSelect() {
    const selector = `${this.addSourceContainerSelector} [id="textInput3-modal-source"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Source type select in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get checkSSLCertificateCheckbox() {
    const selector = `${this.addSourceContainerSelector} [id="checkboxInput4-modal-source"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `SSL certificate checkbox in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get checkGPGKeyCheckbox() {
    const selector = `${this.addSourceContainerSelector} [id="checkboxInput5-modal-source"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `GPG Key checkbox in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get addButton() {
    const selector = "button=Add Source";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Add Source button in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get updateButton() {
    const selector = "button=Update Source";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Update Source button in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get cancelButton() {
    const selector = "button=Cancel";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Cancel button in Add Sources dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new SourcesPage();
