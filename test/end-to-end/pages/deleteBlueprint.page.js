// Delete Blueprint Page
class DeleteBlueprintPage {
  constructor() {
    this.containerSelector = '[role="dialog"] [id="cmpsr-modal-delete"]';
  }

  loading() {
    browser.waitUntil(
      () => browser.isExisting(this.containerSelector),
      timeout,
      "Cannot pop up Delete Blueprint dialog"
    );
  }

  get deleteButton() {
    const selector = `${this.containerSelector} .btn-danger`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Delete button in Delete Blueprint dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new DeleteBlueprintPage();
