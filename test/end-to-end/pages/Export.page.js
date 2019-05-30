// Blueprint Export Page
class ExportPage {
  constructor(name) {
    this.name = name;
    this.containerSelector = '[id="cmpsr-modal-export"]';
  }

  loading() {
    browser.waitUntil(() => browser.isExisting(this.containerSelector), timeout, "Cannot pop up Export dialog");
  }

  get contentsTextarea() {
    const selector = `${this.containerSelector} [id="textInput2-modal-markup"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Contents Textarea in Export dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get closeButton() {
    const selector = '[data-btn="close-export"]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Close button in Export dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get copyButton() {
    const selector = '[data-btn="copy-export"]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Copy button in Export dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = ExportPage;
