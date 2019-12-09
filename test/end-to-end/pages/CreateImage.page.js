// Create Image Page
class CreateImagePage {
  constructor(name) {
    this.name = name;
    this.containerSelector = '[id="create-image-wizard"]';
  }

  loading() {
    browser.waitUntil(() => browser.isExisting(this.containerSelector), timeout, `Cannot open Create Image dialog`);
  }

  get alertMessage() {
    const selector = `${this.containerSelector} .pf-c-alert__title`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Alert message cannot be found in Create Image dialog`
    );
    return $(selector);
  }

  get blueprintNameLabel() {
    const selector = `${this.containerSelector} [id="blueprint-name"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Blueprint Name label cannot be found in Create Image dialog`
    );
    return $(selector);
  }

  get selectOption() {
    const selector = `${this.containerSelector} select[id="image-type"] option`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Select Option in Create Image dialog cannot be found`
    );
    return $$(selector);
  }

  get imageTypeSelect() {
    const selector = 'select[id="image-type"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Image Type select in Create Image dialog cannot be found`
    );
    return $(selector);
  }

  get helpButton() {
    const selector = `${this.containerSelector} [id="popover-icon"]`;
    browser.waitUntil(() => browser.isVisible(selector), timeout, `Help button in Create Image dialog cannot be found`);
    return $(selector);
  }

  get helpMessage() {
    const selector = `.pf-c-popover__body`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Help message in Create Image dialog cannot be found`
    );
    return $(selector);
  }

  get createButton() {
    const selector = `${this.containerSelector} button[id="continue-button"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Create button in Create Image dialog cannot be found`
    );
    return $(selector);
  }

  get commitAndCreateButton() {
    const selector = "span=Commit and Create";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Commit and Create button in Create Image dialog cannot be found`
    );
    return $(selector);
  }

  get cancelButton() {
    const selector = `${this.containerSelector} button[id="cancel-button"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Cancel button in Create Image dialog cannot be found`
    );
    return $(selector);
  }
}

module.exports = CreateImagePage;
