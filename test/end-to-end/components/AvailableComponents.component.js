class AvailableComponents {
  constructor(n = 0) {
    if (n !== 0) {
      this.containerSelector = `[data-list='inputs'] [data-input]:nth-child(${n})`;
    } else {
      this.containerSelector = "[data-list='inputs'] [data-input]";
    }
  }

  get addPackageByNth() {
    return $(`${this.containerSelector} .fa-plus`).element();
  }

  get nameLabel() {
    return $(`${this.containerSelector} [data-input-name]`).element();
  }

  nameLabelByName(name) {
    return $(`[data-input=${name}] [data-input-name]`).element();
  }

  descriptionLabelByName(name) {
    return $(`[data-input=${name}] [data-input-description]`).element();
  }

  addPackageByName(name) {
    return $(`[data-input=${name}] .fa-plus`).element();
  }

  removePackageByName(name) {
    return $(`[data-input=${name}] .fa-minus`).element();
  }

  iconByName(name) {
    return $(`[data-input=${name}] .pficon-bundle`);
  }
}

module.exports = AvailableComponents;
