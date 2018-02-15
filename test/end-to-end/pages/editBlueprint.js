// Edit Blueprint page object
const MainPage = require('./main');
const pageConfig = require('../config');

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
    // Edit Blueprint label
    this.varEditBlueprint = 'Edit Blueprint';
    this.labelEditBlueprint = `${this.navBarRootElement} li strong`;

    // Blueprint Name link
    this.varLinkToViewRec = `${this.mailUrl}#/blueprint/${this.blueprintName}`;
    if (pageConfig.root.includes('9090')) {
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

    // Save button
    this.btnSave = `${this.editActionBarRootElement} ul li button[class="btn btn-primary"]`;

    // component count inside the pagination control
    this.totalComponentCount = `${this.blueprintInputRootElement} .cmpsr-blueprint__inputs__pagination span`;

    // More Action dropdown menu list
    this.moreActionList = {
      Export: 'Export',
    };

    this.componentListItemRootElementSelect = `${this.componentListItemRootElement} a`;
  }

  get url() {
    return `${this.mailUrl}#/edit/${this.blueprintName}`;
  }
};
