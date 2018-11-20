// Delete Image Page
class DeleteImagePage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-delete"]';
  }

  loading() {
    // sometimes the style attribute is style="display: block; padding-right: 12px;"
    browser.waitUntil(
      () => browser.getAttribute(this.containerSelector, 'style').includes('display: block;'),
      timeout,
      'Cannot pop up Delete Image dialog'
    );
  }

  get messageLabel() {
    const selector = `${this.containerSelector} .modal-body .lead span`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Delete Image button in Delete Image dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get deleteImageButton() {
    const selector = `${this.containerSelector} .btn-danger`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Delete Image button in Delete Image dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get cancelButton() {
    const selector = `${this.containerSelector} .btn-default`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Cancel button in Delete Image dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new DeleteImagePage();
