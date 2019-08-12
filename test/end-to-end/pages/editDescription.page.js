// Edit Description page

class EditDescriptionPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-edit-description"]';
  }

  loading() {
    browser.waitUntil(
      () => browser.isExisting(this.containerSelector),
      timeout,
      `Loading Edit Description page failed because selector ${this.containerSelector} cannot be found`
    );
  }

  get xButton() {
    const selector = `${this.containerSelector} .pficon-close`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `X button under Edit Description page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get descriptionInputBox() {
    const selector = `${this.containerSelector} [id="textInput-modal-markup"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint description input box under Edit Description page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get saveButton() {
    const selector = `${this.containerSelector} [id="edit-description-modal-submit-button"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Save button under Edit Description page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get cancelButton() {
    const selector = `${this.containerSelector} .btn-default`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Cancel button under Edit Description page cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}
module.exports = new EditDescriptionPage();
