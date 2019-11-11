// Create Image Page
class CreateImagePage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-crt-image"]';
  }

  loading() {
    $(this.containerSelector).waitForExist(timeout);
  }

  get alertMessage() {
    return $(`${this.containerSelector} .alert-warning`).element();
  }

  get blueprintNameLabel() {
    return $(`${this.containerSelector} .form-control-static`).element();
  }

  get selectOption() {
    return $$(`${this.containerSelector} select[id="textInput-modal-markup"] option`);
  }

  get imageTypeSelect() {
    return $('select[id="textInput-modal-markup"]').element();
  }

  get helpButton() {
    return $(`${this.containerSelector} .pficon-help`).element();
  }

  get helpMessage() {
    return $('[id="CreateImageInfotip"] .popover-content').element();
  }

  get createButton() {
    return $(`${this.containerSelector} .btn-primary`);
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
      .$("span=Cancel")
      .element();
  }
}

module.exports = new CreateImagePage();
