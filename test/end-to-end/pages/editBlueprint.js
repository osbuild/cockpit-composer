// Edit Blueprint page object
const MainPage = require('./main');
const config = require('../wdio.conf.js');

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

    // Blueprint Components and Component Details
    this.bodyMainRootElement = 'div[class="cmpsr-panel__body cmpsr-panel__body--main"]';

    // Blueprint inputs root element
    this.blueprintInputRootElement = '.cmpsr-panel__body--sidebar';

    // Component list item root element
    this.componentListItemRootElement = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted .list-pf-item`;
    // ---- Page element selector ---- //
    // Edit Blueprint label
    this.varEditBlueprint = 'Edit Blueprint';
    this.labelEditBlueprint = `${this.navBarRootElement} li strong`;

    // Back to Bluprints link
    this.linkBackToBlueprints = `${this.navBarRootElement} li a[href="#/blueprints"]`;

    // Blueprint Name link
    this.varLinkToViewRec = `${this.mailUrl}#/blueprint/${this.blueprintName}`;
    if (config.config.baseUrl.includes('9090')) {
      this.varLinkToViewRec = `${this.mailUrl.slice(0, -6)}cockpit/@localhost/welder/index.html#/blueprint/${this.blueprintName}`;
    }
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
    this.linkPendingChange = `${this.editActionBarRootElement} ul li a span`;
    this.labelLinkPendingChange = 'Pending Changes';

    // Commit button
    this.btnCommit = `${this.editActionBarRootElement} ul li button[class="btn btn-primary"]`;

    // Commit button (disabled)
    this.btnDisabledCommit = `${this.editActionBarRootElement} ul li button[class="btn btn-primary disabled"]`;

    // Discard button
    this.btnDiscard = `${this.editActionBarRootElement} ul li button[class="btn btn-default"]`;

    // Discard button (disabled)
    this.btnDisabledDiscard = `${this.editActionBarRootElement} ul li button[class="btn btn-default disabled"]`;

    // component count inside the pagination control
    this.totalComponentCount = `${this.blueprintInputRootElement} .cmpsr-blueprint__inputs__pagination span`;

    // filter input
    this.inputFilter = `${this.blueprintInputRootElement} .toolbar-pf .toolbar-pf-actions .toolbar-pf-filter
      input[id="cmpsr-blueprint-input-filter"]`;

    // filter type
    this.labelFilterType = `${this.blueprintInputRootElement} .toolbar-pf .toolbar-pf-actions .toolbar-pf-filter
      label[for="cmpsr-blueprint-input-filter"]`;

    // filter content label
    this.labelFilterContent = `${this.blueprintInputRootElement} .toolbar-pf .toolbar-pf-results ul li span`;

    // clear filter button
    this.btnClearFilter = `${this.labelFilterContent} a span[class="pficon pficon-close"]`;

    // clear all filters link
    this.linkClearAllFilters = `${this.blueprintInputRootElement} .toolbar-pf .toolbar-pf-results .list-inline li a`;

    // filter result
    this.filterResult = `${this.componentListItemRootElement} .list-pf-container .list-pf-content .list-pf-content-wrapper
      .list-pf-main-content .list-pf-title`;

    // More Action dropdown menu list
    this.moreActionList = {
      Export: 'Export',
    };

    this.componentListItemRootElementSelect = `${this.componentListItemRootElement} a`;

    // httpd component
    this.httpdComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(36) .list-pf-container .list-pf-content-wrapper`;

    // httpd + button
    this.btnHttpdComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(36) .list-pf-container a`;

    // the 1st component name
    this.theFirstComponentName = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(1) .list-pf-container .list-pf-content-wrapper .list-pf-main-content div[class="list-pf-title "]`;

    // the 1st + button
    this.btnTheFirstComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(1) .list-pf-container a`;

    // the 1st + icon
    this.iconPlusTheFirstComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(1) .list-pf-container a span[class="fa fa-plus"]`;

    // the 1st - icon
    this.iconMinusTheFirstComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(1) .list-pf-container a span[class="fa fa-minus"]`;

    // the 1st component icon
    this.iconTheFirstComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(1) .list-pf-container .list-pf-left
      span[class="pficon pficon-bundle  list-pf-icon list-pf-icon-small"]`;

    // the 1st component bordered icon
    this.iconBorderedTheFirstComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(1) .list-pf-container .list-pf-left
      span[class="pficon pficon-bundle list-pf-icon-bordered list-pf-icon list-pf-icon-small"]`;

    // the 2nd component name
    this.theSecondComponentName = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(2) .list-pf-container .list-pf-content-wrapper .list-pf-main-content div[class="list-pf-title "]`;

    // the 2nd + button
    this.btnTheSecondComponent = `${this.blueprintInputRootElement} .cmpsr-list-pf__compacted
      div:nth-child(2) .list-pf-container a`;

    // Body Main elements
    // Blueprint Components - 1st component
    this.boxFirstSelectedComponent = `${this.bodyMainRootElement} .cmpsr-blueprint__components div:nth-child(1)`;
    this.labelFirstComponentName = `${this.bodyMainRootElement} .cmpsr-blueprint__components
      div:nth-child(1) .list-pf-content .list-pf-title a`;

    // Component Details - Component name label
    this.labelComponentName = `${this.bodyMainRootElement} .cmpsr-header h3[class="cmpsr-title"] span`;

    // Component Details - Add button
    this.btnAdd = `${this.bodyMainRootElement} .cmpsr-header .cmpsr-header__actions ul li button`;

    // Selected Components content
    this.contentSelectedComponents = `pf-tabs pf-tab
      div[class="list-pf cmpsr-list-pf list-pf-stacked cmpsr-blueprint__components"]`;
  }

  get url() {
    return `${this.mailUrl}#/edit/${this.blueprintName}`;
  }
};
