// Edit Blueprint Page
class EditPackagesPage {
  constructor(name) {
    this.name = name;
  }

  loading() {
    browser.waitForText(".cmpsr-list-pf__compacted", timeout);
  }

  backToBlueprintsPage() {
    const selector = 'a[href="#/blueprints"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Back to Blueprint Link in Blueprints page cannot be found by selector ${selector}`
    );
    // browser.click() does not work with Edge due to "Element is Obscured" error.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
    browser.execute(backToBlueprintsLink => {
      document.querySelector(backToBlueprintsLink).click();
      return true;
    }, selector);
  }

  get blueprintNameLink() {
    const selector = `=${this.name}`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      "blueprint name in Edit Blueprint page does not exist"
    );
    return $(selector);
  }

  get pendingChangeLink() {
    return $("span*=Pending Change");
  }

  get commitButton() {
    const selector = ".cmpsr-header__actions .btn-primary";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      "Commit button in Edit Blueprint page does not exist"
    );
    return $(selector);
  }

  get discardChangeButton() {
    const selector = ".cmpsr-header__actions .btn-default";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      "Discard Change button in Edit Blueprint page does not exist"
    );
    return $(selector);
  }

  get createImageButton() {
    const selector = "span=Create Image";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      "Create Image button in Edit Blueprint page does not exist"
    );
    return $(selector);
  }

  get moreButton() {
    const selector = '.cmpsr-header__actions [id="dropdownKebab"]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      "Discard Change button in Edit Blueprint page does not exist"
    );
    return $(selector);
  }

  get blueprintNameLabel() {
    const selector = ".cmpsr-title__item";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `blueprint name label in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get filterBox() {
    const selector = '[id="cmpsr-blueprint-input-filter"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Filter input box in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get filterContentLabel() {
    return ".toolbar-pf-results .label-info span";
  }

  get xLabelButton() {
    const selector = ".toolbar-pf-results .pficon-close";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `X label button in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get clearAllFiltersLink() {
    return $(".toolbar-pf-results ul li a span");
  }

  get nthPageBox() {
    const selector = '[id="cmpsr-blueprint-inputs-page"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `nth page box in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get previousButton() {
    const selector = '[aria-label="Show Previous Page"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `< button in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get nextButton() {
    const selector = '[aria-label="Show Next Page"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `> button in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get packageList() {
    const selector = ".cmpsr-list-pf__compacted .list-pf-title";
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `available package list in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $$(selector);
  }

  get sortAscButton() {
    return $(".fa-sort-alpha-asc");
  }

  get sortDescButton() {
    return $(".fa-sort-alpha-desc");
  }

  get undoButton() {
    const selector = '[data-button="undo"]';
    browser.waitUntil(
      () =>
        $(selector)
          .getAttribute("class")
          .indexOf("disabled") === -1,
      timeout,
      `Undo button in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(`${selector} span`);
  }

  get redoButton() {
    const selector = '[data-button="redo"]';
    browser.waitUntil(
      () =>
        $(selector)
          .getAttribute("class")
          .indexOf("disabled") === -1,
      timeout,
      `Redo button in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(`${selector} span`);
  }

  get selectedComponentsTabBadge() {
    const selector = '[data-badge="Selected Components"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Selected Components tab badge in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get dependenciesTabBadge() {
    const selector = '[data-badge="Dependencies"]';
    browser.waitUntil(
      () => browser.isVisible(selector),
      timeout,
      `Dependencies tab badge in Edit Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  clickDependenciesTabBadge() {
    const selector = '[data-badge="Dependencies"]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Dependencies tab badge in Edit Blueprint page cannot be found by selector ${selector}`
    );
    browser.execute(tabBadge => {
      document.querySelector(tabBadge).click();
      return true;
    }, selector);
  }
}

module.exports = EditPackagesPage;
