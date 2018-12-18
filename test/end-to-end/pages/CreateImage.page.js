// Create Image Page
class CreateImagePage {
  constructor(name) {
    this.name = name;
    this.containerSelector = '[id="cmpsr-modal-crt-image"]';
  }

  loading() {
    browser.waitUntil(() => browser.isExisting(this.containerSelector), timeout, `Cannot open Create Image dialog`);
  }

  get blueprintNameLabel() {
    const selector = `${this.containerSelector} .form-control-static`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Blueprint Name label cannot be found in Create Image dialog`
    );
    return $(selector);
  }

  get selectOption() {
    const selector = `${this.containerSelector} select[id="textInput-modal-markup"] option`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Select Option in Create Image dialog cannot be found`
    );
    return $$(selector);
  }

  get imageTypeSelect() {
    const selector = 'select[id="textInput-modal-markup"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Image Type select in Create Image dialog cannot be found`
    );
    return $(selector);
  }

  get helpButton() {
    const selector = `${this.containerSelector} .pficon-help`;
    browser.waitUntil(() => browser.isVisible(selector), timeout, `Help button in Create Image dialog cannot be found`);
    return $(selector);
  }

  get helpMessage() {
    const selector = '[id="CreateImageInfotip"] .popover-content';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Help message in Create Image dialog cannot be found`
    );
    return $(selector);
  }

  get createButton() {
    const selector = `${this.containerSelector} .btn-primary`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Create button in Create Image dialog cannot be found`
    );
    return $(selector);
  }

  get cancelButton() {
    const selector = $(this.containerSelector).$("span=Cancel");
    browser.waitUntil(() => selector.isVisible(), timeout, `Cancel button in Create Image dialog cannot be found`);
    return selector;
  }
}

module.exports = CreateImagePage;
