// View Blueprint page object
const MainPage = require('./main');

module.exports = class ViewBlueprintPage extends MainPage {
  constructor(blueprintName) {
    super('Blueprint');
    this.blueprintName = blueprintName;

    // ---- Root element selector ---- //
    // Navigation bar root element
    this.navRootElement = '.cmpsr-header .breadcrumb';

    // Title bar root element
    this.titleRootElement = 'div[class="cmpsr-title"]';

    // Tab root element
    this.tabRootElement = 'pf-tabs';

    // Tab list root element
    this.tabListRootElement = `${this.tabRootElement} ul[role="tablist"]`;

    // Details tab content root element
    this.detailsContentRootElement = `${this.tabRootElement} pf-tab[tabtitle="Details"]`;

    // Images tab content root element
    this.imagesContentRootElement = `${this.tabRootElement} pf-tab[tabtitle="Images"]`;

    // ---- Page element selector ---- //
    // Nav-bar: Blueprint Name label
    this.labelBlueprintName = `${this.navRootElement} li strong`;

    // Title-bar: Blueprint Title label
    this.labelBlueprintTitle = `${this.titleRootElement} h1[class="cmpsr-title__item"]`;

    // Title-bar: Blueprint Description label
    this.labelBlueprintDescription = `${this.titleRootElement} p span[class="text-muted"]`;

    // Page-level actions
    this.pagelevelActions = '[class="cmpsr-header__actions"]';

    // Create Image button
    this.varCreateImage = 'Create Image';
    this.btnCreateImage = '#cmpsr-btn-crt-image[class="btn btn-default "]';

    // More action button
    this.btnMore = 'button[id="dropdownKebab"]';

    // Export action
    this.menuActionExport = 'ul[aria-labelledby="dropdownKebab"] li:nth-child(1) a';

    // Tool bar more Action dropdown menu list item
    this.toolBarMoreActionList = {
      Export: 'Export',
    };

    // Detail tab element
    this.detailTabElement = `${this.tabListRootElement} li:nth-child(1) a`;

    // Components tab page element
    this.componentsTabElement = `${this.tabListRootElement} li:nth-child(2) a`;

    // Images tab page element
    this.imagesTabElement = `${this.tabListRootElement} li:nth-child(3) a`;

    // Name label under Details tab
    this.labelNameUnderDetails = `${this.detailsContentRootElement} div[class="tab-container row"]
      div[class="col-sm-6 col-lg-4"] dl[class="dl-horizontal mt-"] dd:nth-child(2)`;

    // Description label under Details tab
    this.labelDescriptionUnderDetails = `${this.detailsContentRootElement} div[class="tab-container row"]
      div[class="col-sm-6 col-lg-4"] dl[class="dl-horizontal mt-"] dd:nth-child(4)`;

    // Description edit button under Details tab
    this.btnEditDescriptionUnderDetails = `${this.detailsContentRootElement} div[class="tab-container row"]
      div[class="col-sm-6 col-lg-4"] dl[class="dl-horizontal mt-"] dd button[class="btn btn-link"]`;

    // Description text input under Details tab
    this.inputTextDescriptionUnderDetails = `${this.detailsContentRootElement} div[class="tab-container row"]
      div[class="col-sm-6 col-lg-4"] dl[class="dl-horizontal mt-"] dd div input[class="form-control"]`;

    // Description ok button under Details tab
    this.btnOkDescriptionUnderDetails = `${this.detailsContentRootElement} div[class="tab-container row"]
      div[class="col-sm-6 col-lg-4"] dl[class="dl-horizontal mt-"] dd div span button span[class="fa fa-check"]`;

    // Description cancel button under Details tab
    this.btnCancelDescriptionUnderDetails = `${this.detailsContentRootElement} div[class="tab-container row"]
      div[class="col-sm-6 col-lg-4"] dl[class="dl-horizontal mt-"] dd div span button span[class="pficon pficon-close"]`;
  }

  get url() {
    return `${this.mailUrl}#/blueprint/${this.blueprintName}`;
  }

  // Edit Blueprint button
  get btnEditBlueprint() {
    return `a[href="#/blueprint/${this.blueprintName}]`;
  }
};
