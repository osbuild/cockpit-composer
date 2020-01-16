// Blueprints Page
class BlueprintsPage {
  constructor() {
    this.blueprintListView = ".pf-c-data-list .pf-c-data-list__item";
  }

  // if the create blueprint button is enabled the page has loaded
  loading() {
    $(this.blueprintListView).waitForExist(timeout);
    browser.waitUntil(() => $$(this.blueprintListView).length >= 1, timeout, "Loading Blueprints page failed");
  }

  filterLoading() {
    $(this.blueprintListView).waitForExist(timeout);
    browser.waitUntil(() => $$(this.blueprintListView).length === 1, timeout, "Filtered blueprint does not exist");
  }

  get sortAscButton() {
    return $(".fa-sort-alpha-asc").element();
  }

  get sortDescButton() {
    return $(".fa-sort-alpha-desc").element();
  }

  get createBlueprintButton() {
    return $('[id="cmpsr-btn-crt-blueprint"]').element();
  }

  get moreButton() {
    return $(".toolbar-pf-action-right .fa-ellipsis-v").element();
  }

  get dropDownMenu() {
    return $(".toolbar-pf-action-right .dropdown-kebab-pf").element();
  }

  get manageSourcesItem() {
    return $("span=Manage Sources").element();
  }

  get filterBox() {
    return $('[id="filter-blueprints"]').element();
  }

  get clearAllFiltersLink() {
    return $("span=Clear All Filters").element();
  }

  get filterContentLabel() {
    return $(".filter-pf-active-label + .list-inline .label").element();
  }

  get filterContentLabelCloseButton() {
    return $(".filter-pf-active-label + .list-inline .pficon-close").element();
  }

  get activeFiltersLabel() {
    return $("p=Active Filters:").element();
  }

  get serviceStartButton() {
    return $(".blank-slate-pf-main-action button").element();
  }

  get autostartCheckbox() {
    return $(".blank-slate-pf .checkbox label input").element();
  }
}

module.exports = new BlueprintsPage();
