class DeleteBlueprintPage {
  constructor() {
    this.containerSelector = '[role="dialog"] [id="cmpsr-modal-delete"]';
  }

  loading() {
    $(this.containerSelector).waitForDisplayed(timeout);
  }

  get deleteButton() {
    return $(`${this.containerSelector} .btn-danger`).element();
  }
}

module.exports = new DeleteBlueprintPage();
