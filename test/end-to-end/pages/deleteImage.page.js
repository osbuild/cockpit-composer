// Delete Image Page
class DeleteImagePage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-delete"]';
  }

  loading() {
    // sometimes the style attribute is style="display: block; padding-right: 12px;"
    browser.waitUntil(
      () =>
        $(this.containerSelector)
          .getAttribute("style")
          .includes("display: block;"),
      timeout
    );
  }

  get messageLabel() {
    return $(`${this.containerSelector} .modal-body .lead span`).element();
  }

  get deleteImageButton() {
    return $(`${this.containerSelector} .btn-danger`).element();
  }

  get cancelButton() {
    return $(`${this.containerSelector} .btn-default`).element();
  }
}

module.exports = new DeleteImagePage();
