// View Blueprint page object
const MainPage = require('./main');

module.exports = class BlueprintsPage extends MainPage {
  constructor() {
    super('Blueprints');

    // Button - Create Blueprint
    this.varCreateBlueprint = 'Create Blueprint';
    this.btnCreateBlueprint = 'button[data-target="#cmpsr-modal-crt-blueprint"]';

    // Link - Blueprint Name in the blueprints list
    this.linkBlueprintName = 'a[href="#/blueprint/"]';

    // Label - Blueprint Description in the blueprints list
    this.labelBlueprintDescr = '.list-group-item-text';

    // Item Names - Blueprints
    this.itemNamesBlueprint = '.list-view-pf-main-info .list-group-item-heading a';

    // Items - Blueprints
    this.itemsBlueprint = '.container-fluid .list-view-pf-view .list-group-item';

    // Button - Edit Blueprint
    this.btnEditBlueprint = '.list-view-pf-actions a';

    // More Action dropdown menu list
    this.moreActionList = {
      Export: 'Export',
      Delete: 'Delete',
    };
  }

  get url() {
    return `${this.mailUrl}#/blueprints`;
  }

  // Blueprint Name link
  static blueprintNameSelector(name) {
    return `a[href="#/blueprint/${name}"]`;
  }

  // Create Image button
  static btnCreateImage(name) {
    return `a[href="#/edit/${name}"] + .btn-default`;
  }

  // More button
  static btnMore(name) {
    return `a[href="#/edit/${name}"] ~ div > button`;
  }

  // Export action in dropdown menu
  static menuActionExport(name) {
    return `a[href="#/edit/${name}"] ~ div ul > li:nth-child(1) > a`;
  }

  // Delete action in dropdown menu
  static menuActionDelete(name) {
    return `a[href="#/edit/${name}"] ~ div ul > li:nth-child(2) > a`;
  }
};
