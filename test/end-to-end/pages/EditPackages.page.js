class EditPackagesPage {
  constructor(name) {
    this.name = name;
  }

  loading() {
    browser.waitUntil(() => $("[data-list='inputs']").getText() !== "", timeout);
  }

  get backToBlueprintsPageLink() {
    return $('a[href="#/blueprints"]').element();
  }

  get blueprintNameLink() {
    return $(`=${this.name}`);
  }

  get pendingChangeLink() {
    return $("span*=Pending Change");
  }

  get commitButton() {
    return $(".cmpsr-header__actions .btn-primary").element();
  }

  get discardChangeButton() {
    return $(".cmpsr-header__actions .btn-default").element();
  }

  get createImageButton() {
    return $(`button[id="create-image-button"]`).element();
  }

  get moreButton() {
    return $('.cmpsr-header__actions [id="dropdownKebab"]').element();
  }

  get dropDownMenu() {
    return $(".cmpsr-header__actions .dropdown-kebab-pf").element();
  }

  get exportItem() {
    return $("span=Export").element();
  }

  get blueprintNameLabel() {
    return $(".cmpsr-title__item").element();
  }

  get filterBox() {
    return $('[id="cmpsr-blueprint-input-filter"]').element();
  }

  get filterContentLabel() {
    return $(".toolbar-pf-results .label-info span");
  }

  get xLabelButton() {
    return $(".toolbar-pf-results .pficon-close").element();
  }

  get clearAllFiltersLink() {
    return $(".toolbar-pf-results ul li a span");
  }

  get nthPageBox() {
    return $('[id="cmpsr-blueprint-inputs-page"]').element();
  }

  get previousButton() {
    return $('[aria-label="Show Previous Page"]').element();
  }

  get nextButton() {
    return $('[aria-label="Show Next Page"]').element();
  }

  get packageList() {
    return $$("[data-list='inputs'] [data-input-name]");
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
      timeout
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
      timeout
    );
    return $(`${selector} span`);
  }

  get selectedComponentsTabBadge() {
    return $('[data-badge="Selected Components"]').element();
  }

  get dependenciesTabBadge() {
    return $('[data-badge="Dependencies"]').element();
  }
}

module.exports = EditPackagesPage;
