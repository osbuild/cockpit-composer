class ViewBlueprintPage {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  loading() {
    browser.waitUntil(() => $('h1[class="cmpsr-title__item"]').getText() === this.name, timeout);
  }

  get backToBlueprintsLink() {
    return $("span=Back to Blueprints").element();
  }

  get navigationBlueprintNameLabel() {
    return $(`strong=${this.name}`).element();
  }

  get editPackagesButton() {
    return $("span=Edit Packages").element();
  }

  get createImageButton() {
    // cannot use 'span=Create Image' because there're two Create Image buttons
    // another one is under Image tab
    return $('.cmpsr-header__actions [id="cmpsr-btn-crt-image"] span').element();
  }

  get moreButton() {
    return $(".cmpsr-header__actions .fa-ellipsis-v").element();
  }

  get editDescriptionItem() {
    return $("span=Edit description").element();
  }

  get exportItem() {
    return $("span=Export").element();
  }

  get headerBlueprintNameLabel() {
    return $('h1[class="cmpsr-title__item"]').element();
  }

  get headerBlueprintDescriptionLabel() {
    return $('p[class="cmpsr-title__item"] .text-muted').element();
  }

  get customizationsTab() {
    return $("=Customizations").element();
  }

  get customizationsTabBlueprintDescriptionLabel() {
    return $(`a=${this.description}`).element();
  }

  customizationsTabHostnameLabel(hostname) {
    return $(`span=${hostname}`).element();
  }

  get editHostnameButton() {
    return $('[data-form="hostname"] .pficon-edit').element();
  }

  get hostnameInputBox() {
    return $('[data-form="hostname"] .form-control').element();
  }

  get okHostnameButton() {
    return $('[data-form="hostname"] .form-control-pf-save').element();
  }

  get cancelHostnameButton() {
    return $('[data-form="hostname"] .form-control-pf-cancel').element();
  }

  get createUserAccountButton() {
    return $("span=Create User Account").element();
  }

  userAccountSelector(name) {
    return $(`[data-tr=${name}] [data-td=fullname]`);
  }

  fullNameCell(name) {
    return $(`[data-tr=${name}] [data-td=fullname]`).element();
  }

  userNameCell(name) {
    return $(`[data-tr=${name}] [data-td=username]`).element();
  }

  administratorCell(name) {
    return $(`[data-tr=${name}] [data-td=groups] span`);
  }

  passwordCell(name) {
    return $(`[data-tr=${name}] [data-td=password] span`);
  }

  sshKeyCell(name) {
    return $(`[data-tr=${name}] [data-td=sshkey] span`);
  }

  editUserButton(name) {
    return $(`[data-tr=${name}] [data-btn="edit"]`).element();
  }

  moreUserButton(name) {
    return $(`[data-tr=${name}] [data-btn="more"]`).element();
  }

  dropDownMenu(name) {
    return $(`[data-tr=${name}] .dropdown-kebab-pf`).element();
  }

  deleteUserAccountItem(name) {
    return $(`[data-tr=${name}] ul li a`).element();
  }

  get packagesTab() {
    return $("=Packages").element();
  }

  get selectedComponentFilter() {
    return $('[id="filter-blueprints"]').element();
  }

  get imagesTab() {
    return $("=Images").element();
  }

  get imageNameLabel() {
    return $(".cmpsr-images .list-pf-title").element();
  }

  imageTypeLabel(type) {
    return $(`[data-image-type=${type}]`).element();
  }

  get completeLabel() {
    return $("span=Complete");
  }

  waitForImageBuildComplete() {
    // image building needs times to complete, so increase timeout to 40 minutes
    // and checking interval to 2 seconds
    browser.waitUntil(
      () => this.completeLabel.isExisting(),
      timeout * 20,
      `Image build failed after ${timeout * 20}`,
      2000
    );
  }

  get completeIcon() {
    return $(".cmpsr-images .pficon-ok").element();
  }

  get imageMoreButton() {
    return $(".cmpsr-images .fa-ellipsis-v").element();
  }

  get deleteItem() {
    return $("span=Delete").element();
  }

  get imageDownloadButton() {
    return $('.list-pf-actions [download=""]').element();
  }
}

module.exports = ViewBlueprintPage;
