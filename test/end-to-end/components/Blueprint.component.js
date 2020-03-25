class Blueprint {
  constructor(name) {
    this.name = name;
    this.containerSelector = `[data-blueprint="${this.name}"]`;
  }

  get blueprintNameLink() {
    return $(`${this.containerSelector} a[href="#/blueprint/${this.name}"]`).element();
  }

  get blueprintDescriptionText() {
    return $(`${this.containerSelector} [data-description]`).element();
  }

  get blueprintNameList() {
    return $$("[data-blueprint]");
  }

  get editPackagesButton() {
    return $(`${this.containerSelector} a[href="#/edit/${this.name}"]`).element();
  }

  get createImageButton() {
    return $(`${this.containerSelector} button[id="create-image-button"]`).element();
  }

  get moreDropdownMenu() {
    return $(`${this.containerSelector} [id="${this.name}-kebab"]`).element();
  }

  get exportOption() {
    return $(this.containerSelector)
      .$("span=Export")
      .element();
  }

  get deleteOption() {
    return $(this.containerSelector)
      .$("span=Delete")
      .element();
  }
}

module.exports = Blueprint;
