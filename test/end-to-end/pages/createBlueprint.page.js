// Create Blueprint Page
class CreateBlueprintPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-crt-blueprint"]';
  }

  loading() {
    // sometimes the style attribute is style="display: block; padding-right: 12px;"
    browser.waitUntil(
      () => browser.getAttribute(this.containerSelector, "style").includes("display: block;"),
      timeout,
      "Cannot pop up Create Blueprint dialog"
    );
  }

  get nameBox() {
    const selector = '[id="textInput-modal-markup"]';
    browser.waitUntil(
      () => browser.hasFocus(selector),
      timeout,
      `Username input box in Create Blueprint dialog cannot get focused by selector ${selector}`
    );
    return $(selector);
  }

  get descriptionBox() {
    const selector = '[id="textInput2-modal-markup"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Description input box in Create Blueprint dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get createButton() {
    const selector = "span=Create";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Create button in Create Blueprint dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get cancelButton() {
    const selector = "span=Cancel";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Cancel button in Create Blueprint dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  clickXButton() {
    const selector = `${this.containerSelector} .close`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `X button in Create Blueprint dialog cannot be found by selector ${selector}`
    );
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute(xButton => {
      document.querySelector(xButton).click();
      return true;
    }, selector);
  }

  get alert() {
    const selector = `${this.containerSelector} .alert-danger strong`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Required information is missing error message in Create Blueprint dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get helpBlock() {
    const selector = `${this.containerSelector}  .help-block`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `A blueprint name is required error message in Create Blueprint dialog cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = new CreateBlueprintPage();
