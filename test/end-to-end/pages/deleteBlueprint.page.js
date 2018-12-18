// Delete Blueprint Page
class DeleteBlueprintPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-delete"]';
  }

  loading() {
    // sometimes the style attribute is style="display: block; padding-right: 12px;"
    browser.waitUntil(
      () => browser.getAttribute(this.containerSelector, "style").includes("display: block;"),
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
