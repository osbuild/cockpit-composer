class SourcesPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-manage-sources"]';
    this.addSourceContainerSelector = '[id="cmpsr-form-add-source"]';
  }

  loading() {
    browser.waitUntil(() => $(`${this.containerSelector} .cmpsr-list-sources`).getText() !== "", timeout);
  }

  get title() {
    return $(`${this.containerSelector} [id="title-manage-sources"] span`).element();
  }

  get addSourceButton() {
    return $(`${this.containerSelector} [value="Add Source"]`).element();
  }

  get sourceNameList() {
    return $$(".cmpsr-list-sources .list-pf-item .list-pf-title");
  }

  sourceItem(name) {
    return $(`${this.containerSelector} [data-source=${name}]`);
    // return $(`${this.containerSelector} [data-source=${name}]`).element();
  }

  sourceName(name) {
    return $(`${this.containerSelector} [data-source=${name}] .list-pf-title`).element();
  }

  sourceUrl(name) {
    return $(`${this.containerSelector} [data-source=${name}] .list-pf-additional-content`).element();
  }

  sourceType(name) {
    return $(`${this.containerSelector} [data-source=${name}] .list-pf-description span strong`).element();
  }

  editButton(name) {
    return $(`${this.containerSelector} [data-source=${name}] [aria-label="Edit Source ${name}"]`).element();
  }

  dropDownMenu(name) {
    return $(`${this.containerSelector} [data-source=${name}] .dropdown-kebab-pf`).element();
  }

  moreButton(name) {
    return $(`${this.containerSelector} [data-source=${name}] [aria-label="Source Actions ${name}"]`).element();
  }

  removeSourceItem(name) {
    return $(`${this.containerSelector} [data-source=${name}] ul li a`).element();
  }

  get closeButton() {
    return $(`${this.containerSelector} .modal-footer button span`).element();
  }

  // Add source
  get sourceNameInput() {
    return $(`${this.addSourceContainerSelector} [id="textInput1-modal-source"]`).element();
  }

  get sourcePathInput() {
    return $(`${this.addSourceContainerSelector} [id="textInput2-modal-source"]`).element();
  }

  get duplicatedPathWarning() {
    return $(`${this.addSourceContainerSelector} [id="textInput2-modal-source-help"]`).element();
  }

  get sourceTypeSelect() {
    return $(`${this.addSourceContainerSelector} [id="textInput3-modal-source"]`).element();
  }

  get checkSSLCertificateCheckbox() {
    return $(`${this.addSourceContainerSelector} [id="checkboxInput4-modal-source"]`).element();
  }

  get checkGPGKeyCheckbox() {
    return $(`${this.addSourceContainerSelector} [id="checkboxInput5-modal-source"]`).element();
  }

  get addButton() {
    return $("button=Add Source").element();
  }

  get updateButton() {
    return $("button=Update Source").element();
  }

  get cancelButton() {
    return $("button=Cancel").element();
  }
}

module.exports = new SourcesPage();
