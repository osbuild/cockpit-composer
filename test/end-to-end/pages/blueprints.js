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

    // More Action dropdown menu list
    this.moreActionList = {
      Export: 'Export',
      Archive: 'Archive',
    };
  }

  get url() {
    return `${this.mailUrl}#/blueprints`;
  }

  // Blueprint Name link
  static blueprintNameSelector(name) {
    return `a[href="#/blueprint/${name}"]`;
  }

  // Create Composition button
  static btnCreateCompos(name) {
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
};
