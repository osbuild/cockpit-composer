// View Blueprint Page
class ViewBlueprintPage {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  loading() {
    browser.waitUntil(
      () => browser.getText('h1[class="cmpsr-title__item"]') === this.name,
      timeout,
      "Cannot load View Blueprint page"
    );
  }

  get backToBlueprintsLink() {
    const selector = "span=Back to Blueprints";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Back to Blueprint link in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get navigationBlueprintNameLabel() {
    const selector = `strong=${this.name}`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint name label in navigation bar in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get editBlueprintButton() {
    const selector = "span=Edit Blueprint";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Edit Blueprint button in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get createImageButton() {
    // cannot use 'span=Create Image' because there're two Create Image buttons
    // another one is under Image tab
    const selector = '.cmpsr-header__actions [id="cmpsr-btn-crt-image"] span';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Create Image button in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get moreButton() {
    const selector = ".cmpsr-header__actions .fa-ellipsis-v";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `: button in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get headerBlueprintNameLabel() {
    const selector = 'h1[class="cmpsr-title__item"]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `header blueprint name label in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get headerBlueprintDescriptionLabel() {
    const selector = 'p[class="cmpsr-title__item"]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `header blueprint name label in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get detailsTab() {
    const selector = "=Details";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Details tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get detailsTabBlueprintNameLabel() {
    const selector = `dd=${this.name}`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint name under "Details" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get detailsTabBlueprintDescriptionLabel() {
    const selector = `dd=${this.description}`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint description under "Details" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  updatedBlueprintDescriptionLabel(selector) {
    browser.waitUntil(
      () => browser.isExisting(`dd=${selector}`),
      timeout,
      `blueprint description under "Details" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(`dd=${selector}`);
  }

  get editBlueprintDescriptionButton() {
    const selector = ".pficon-edit";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `edit blueprint description button under "Details" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get descriptionInputBox() {
    const selector = '[id="blueprint-tabs-pane-details"] .form-control';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint description input box under "Details" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get okButton() {
    const selector = ".fa-check";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `ok button under "Details" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get cancelButton() {
    const selector = ".btn-link .pficon-close";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `cancel button under "Details" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get selectedComponentsTab() {
    const selector = "=Selected Components";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Selected Components tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get selectedComponentFilter() {
    const selector = '[id="filter-blueprints"]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Selected Components filter in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get imagesTab() {
    const selector = "=Images";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Images tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get noImageMessageLabel() {
    const selector = "p=No images have been created from this blueprint.";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `No Image message label in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get imageNameLabel() {
    const selector = ".cmpsr-images .list-pf-title";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Image name label in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  imageTypeLabel(type) {
    const selector = `strong=${type}`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Images type label ${type} under Images tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get pendingLabel() {
    const selector = "span=Pending";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Pending label under Images tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get pendingIcon() {
    const selector = ".cmpsr-images .pficon-pending";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Creating image pending icon under Images tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get completeLebel() {
    const selector = "span=Complete";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Complete label under Images tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get completeIcon() {
    const selector = ".cmpsr-images .pficon-ok";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Creating image complete icon under Images tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get imageMoreButton() {
    const selector = ".cmpsr-images .fa-ellipsis-v";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `: button under Images tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = ViewBlueprintPage;
