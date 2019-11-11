class EditDescriptionPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-edit-description"]';
  }

  loading() {
    $(this.containerSelector).waitForExist(timeout);
  }

  get xButton() {
    return $(`${this.containerSelector} .pficon-close`).element();
  }

  get descriptionInputBox() {
    return $(`${this.containerSelector} [id="textInput-modal-markup"]`).element();
  }

  get saveButton() {
    return $(`${this.containerSelector} [id="edit-description-modal-submit-button"]`).element();
  }

  get cancelButton() {
    return $(`${this.containerSelector} .btn-default`).element();
  }
}
module.exports = new EditDescriptionPage();
