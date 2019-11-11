class ExportPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-export"]';
  }

  loading() {
    $(this.containerSelector).waitForDisplayed(timeout);
  }

  get contentsTextarea() {
    return $(`${this.containerSelector} [id="textInput2-modal-markup"]`).element();
  }

  get closeButton() {
    return $('[data-btn="close-export"]').element();
  }

  get copyButton() {
    return $('[data-btn="copy-export"]').element();
  }
}

module.exports = new ExportPage();
