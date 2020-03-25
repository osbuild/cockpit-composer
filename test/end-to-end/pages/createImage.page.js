// Create Image Page
class CreateImagePage {
  constructor() {
    this.containerSelector = '[id="create-image-upload-wizard"]';
  }

  loading() {
    $(this.containerSelector).waitForExist(timeout);
  }

  get alertMessage() {
    return $(`${this.containerSelector} [id="pending-changes-alert"]`).element();
  }

  get blueprintNameLabel() {
    return $(`${this.containerSelector} [id="blueprint-name"]`).element();
  }

  get selectOption() {
    return $$(`${this.containerSelector} select[id="image-type"] option`);
  }

  get imageTypeSelect() {
    return $('select[id="image-type"]').element();
  }

  get helpButton() {
    return $(`${this.containerSelector} [id="popover-icon"]`).element();
  }

  get helpMessage() {
    return $(`[id="popover-help"]`).element();
  }

  get createButton() {
    return $(`${this.containerSelector} [id="continue-button"]`);
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
    return $(this.containerSelector)
      .$(`button[id="cancel-button"]`)
      .element();
  }
}

module.exports = new CreateImagePage();
