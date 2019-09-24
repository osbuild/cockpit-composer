// blueprint component inside Blueprints page
class Blueprint {
  constructor(name) {
    this.name = name;
    this.containerSelector = `[data-blueprint="${this.name}"]`;
  }

  get blueprintNameLink() {
    const selector = `${this.containerSelector} a[href="#/blueprint/${this.name}"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Blueprint ${this.name} in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get blueprintDescriptionText() {
    const selector = `${this.containerSelector} [data-description]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Blueprint ${this.name}'s description in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get blueprintNameList() {
    const selector = "[data-blueprint]";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Blueprint list in Blueprints page cannot be found by selector ${selector}`
    );
    return selector;
  }

  get editPackagesButton() {
    const selector = `${this.containerSelector} a[href="#/edit/${this.name}"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Blueprint ${this.name}'s Edit Blueprint button in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get createImageButton() {
    const selector = `${this.containerSelector} button[class="btn btn-default"]`;
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Blueprint ${this.name}'s Create Image button in Blueprints page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get moreDropdownMenu() {
    const selector = `${this.containerSelector} [id="${this.name}-kebab"]`;
    // : button
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Blueprint ${this.name}'s : Dropdown Menu button cannot be found by selector ${selector}`
    );
    // // browser.click() does not work with Edge due to "Element is Obscured" error.
    // // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    // browser.execute((moreDropDownMenu) => {
    //   document.querySelector(moreDropDownMenu).click();
    //   return true;
    // }, selector);
    return $(selector);
  }

  get exportOption() {
    const selector = $(this.containerSelector).$("span=Export");
    browser.waitUntil(
      () => selector.isVisible(),
      timeout,
      `Export option of More Dropdown Menu for Blueprint ${this.name} cannot be found by selector "span=Export"`
    );
    return selector;
  }

  get deleteOption() {
    const selector = $(this.containerSelector).$("span=Delete");
    browser.waitUntil(
      () => selector.isVisible(),
      timeout,
      `Delete option of More Dropdown Menu for Blueprint ${this.name} cannot be found by selector "span=Delete"`
    );
    return selector;
  }
}

module.exports = Blueprint;
