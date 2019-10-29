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

  get editPackagesButton() {
    const selector = "span=Edit Packages";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Edit Packages button in View Blueprint page cannot be found by selector ${selector}`
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

  get customizationsTab() {
    const selector = "=Customizations";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Customizations tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get customizationsTabBlueprintDescriptionLabel() {
    const selector = `a=${this.description}`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint description in View Blueprint page header cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  customizationsTabHostnameLabel(hostname) {
    const selector = `span=${hostname}`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint hostname under "Customizations" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get editHostnameButton() {
    const selector = '[data-form="hostname"] .pficon-edit';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `edit hostname button under "Customizations" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get hostnameInputBox() {
    const selector = '[data-form="hostname"] .form-control';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `blueprint hostname input box under "Customizations" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get okHostnameButton() {
    const selector = '[data-form="hostname"] .form-control-pf-save';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `ok button for hostname edit under "Customizations" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get cancelHostnameButton() {
    const selector = '[data-form="hostname"] .form-control-pf-cancel';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `cancel button for hostname under "Customizations" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get createUserAccountButton() {
    const selector = `span=Create User Account`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Create User Account button under "Customizations" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  fullNameCell(name) {
    const selector = `[data-tr=${name}] [data-td=fullname]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Full name cell under "Customizations" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  userNameCell(name) {
    const selector = `[data-tr=${name}] [data-td=username]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `User name cell under "Customizations" tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  administratorCell(name) {
    return `[data-tr=${name}] [data-td=groups] span`;
  }

  passwordCell(name) {
    return `[data-tr=${name}] [data-td=password] span`;
  }

  sshKeyCell(name) {
    return `[data-tr=${name}] [data-td=sshkey] span`;
  }

  editUserButton(name) {
    const selector = `[data-tr=${name}] [data-btn="edit"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Edit user button in user ${name} row cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  moreUserButton(name) {
    const selector = `[data-tr=${name}] [data-btn="more"]`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `: button in user ${name} row cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get packagesTab() {
    const selector = "=Packages";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Packages tab in View Blueprint page cannot be found by selector ${selector}`
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
    const selector = `[data-image-type=${type}]`;
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
    // image building needs times to complete, so increase timeout to 40 minutes
    // and checking interval to 2 seconds
    const selector = "span=Complete";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout * 20,
      `Complete label under Images tab in View Blueprint page cannot be found by selector ${selector}`,
      2000
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

  get imageDownloadButton() {
    const selector = '.list-pf-actions [download=""]';
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Download button under Images tab in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }

  get stopButton() {
    const selector = "span=Stop";
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      `Stop button in View Blueprint page cannot be found by selector ${selector}`
    );
    return $(selector);
  }
}

module.exports = ViewBlueprintPage;
