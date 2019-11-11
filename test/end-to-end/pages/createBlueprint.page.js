// Create Blueprint Page
class CreateBlueprintPage {
  constructor() {
    this.containerSelector = '[role="dialog"] [id="cmpsr-modal-crt-blueprint"]';
    this.helpBlockSelector = `${this.containerSelector}  .help-block`;
  }

  loading() {
    $(this.containerSelector).waitForDisplayed(timeout);
  }

  get nameBox() {
    return $('[id="textInput-modal-markup"]').element();
  }

  get descriptionBox() {
    return $('[id="textInput2-modal-markup"]').element();
  }

  get createButton() {
    return $('[id="create-blueprint-modal-create-button"]').element();
  }

  get cancelButton() {
    return $("span=Cancel").element();
  }

  get xButton() {
    return $(`${this.containerSelector} .close`).element();
  }

  get alert() {
    return $(`${this.containerSelector} .alert-danger strong`).element();
  }

  get helpBlock() {
    return $(this.helpBlockSelector).element();
  }
}

module.exports = new CreateBlueprintPage();
