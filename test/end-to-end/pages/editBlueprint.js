// Edit Blueprint page object
const MainPage = require('./main');

module.exports = class EditBlueprintPage extends MainPage {
  constructor(blueprintName) {
    super('Blueprint');
    this.blueprintName = blueprintName;

    // ---- Root element selector ---- //
    // Navigation bar root element
    this.navBarRootElement = 'ol[class="breadcrumb"]';
    // Edit action bar root element
    this.editActionBarRootElement = 'div[class="cmpsr-header__actions"]';

    // Title bar root element
    this.titleBarRootElement = 'div[class="cmpsr-title"]';

    // Blueprint inputs root element
    this.blueprintInputRootElement = '.cmpsr-panel__body--sidebar';

    // Component list item root element
    this.componentListItemRootElement = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted .list-pf-item`;
    // ---- Page element selector ---- //
    // Component number
    this.componentNumber = '.cmpsr-blueprint__inputs__pagination span:nth-of-type(2)';

    // Back to Bluprints link
    this.linkBackToBlueprints = `${this.navBarRootElement} li a[href="#/blueprints"]`;

    // Blueprint Name link
    this.varLinkToViewRec = `#/blueprint/${this.blueprintName}`;
    this.linkBlueprintName = `${this.navBarRootElement}  li + li a`;

    // Blueprint Title label
    this.labelBlueprintTitle = `${this.titleBarRootElement} h1[class="cmpsr-title__item"]`;

    // Create Image button
    this.varCreateImage = 'Create Image';
    this.btnCreateImage = `${this.editActionBarRootElement} button[data-target="#cmpsr-modal-crt-image"]`;

    // More action button
    this.btnMore = `${this.editActionBarRootElement} button[id="dropdownKebab"]`;

    // Export action
    this.menuActionExport = `${this.editActionBarRootElement} ul[aria-labelledby="dropdownKebab"] li:nth-child(1) a`;

    // Pending Change link
    this.linkPendingChange = `${this.editActionBarRootElement} > ul > li > a > span`;

    // Commit button
    this.btnCommit = `${this.editActionBarRootElement} ul li button[class="btn btn-primary"]`;

    // Commit button (disabled)
    this.btnDisabledCommit = `${this.editActionBarRootElement} ul li button[class="btn btn-primary disabled"]`;

    // Discard button
    this.btnDiscard = `${this.editActionBarRootElement} ul li button[class="btn btn-default"]`;

    // Discard button (disabled)
    this.btnDisabledDiscard = `${this.editActionBarRootElement} ul li button[class="btn btn-default disabled"]`;

    // filter input
    this.inputFilter = `${this.blueprintInputRootElement} .toolbar-pf .toolbar-pf-actions .toolbar-pf-filter
      input[id="cmpsr-blueprint-input-filter"]`;

    // filter content label
    this.labelFilterContent = `${this.blueprintInputRootElement} .toolbar-pf .toolbar-pf-results ul li span`;

    // clear filter button
    this.btnClearFilter = `${this.labelFilterContent} a span[class="pficon pficon-close"]`;

    // clear all filters link
    this.linkClearAllFilters = `${this.blueprintInputRootElement} .toolbar-pf .toolbar-pf-results .list-inline li a`;

    // More Action dropdown menu list
    this.moreActionList = {
      Export: 'Export',
    };

    this.componentListItemRootElementSelect = `${this.componentListItemRootElement} a`;

    // Available Component
    // List
    this.availableComponentList = `${this.componentListItemRootElement} .list-pf-content.list-pf-content-flex`;
    // Name
    this.availableComponentName = '.list-pf-title';
    // + Button
    this.availableComponentPlusButton = '.btn-link .fa-plus';
    // - Button
    this.availableComponentMinusButton = '.btn-link .fa-minus';
    // Icon
    this.availableComponentIcon = '.list-pf-left span span';
    // Bordered Icon Class Attribute
    this.borderedIconClassAttribute = 'pficon pficon-bundle list-pf-icon-bordered list-pf-icon list-pf-icon-small';
    // Normal Icon Class Attribute
    this.normalIconClassAttribute = 'pficon pficon-bundle  list-pf-icon list-pf-icon-small';
    // + Button of the 1st component
    this.plusButtonOfTheFirstComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(1) .list-pf-container a`;
    // Name of the 1st component
    this.nameOfTheFirstComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(1) .list-pf-container .list-pf-content-wrapper .list-pf-main-content div[class="list-pf-title "]`;
    // + Button of the 2nd component
    this.plusButtonOfTheSecondComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(2) .list-pf-container a`;
    // Name of the 2nd component
    this.nameOfTheSecondComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(2) .list-pf-container .list-pf-content-wrapper .list-pf-main-content div[class="list-pf-title "]`;

    // Body Main elements
    // Selected Components content
    this.contentSelectedComponents = 'div[class="list-pf cmpsr-list-pf list-pf-stacked cmpsr-blueprint__components"]';
  }

  get url() {
    return `${this.mailUrl}#/edit/${this.blueprintName}`;
  }
};
