// Delete Blueprint page object
const helper = require('../utils/helper');
const config = require('../wdio.conf.js');

const MainPage = require('./main');
const BlueprintsPage = require('./blueprints');


module.exports = class deleteBlueprint extends MainPage {
  constructor() {
    super('Delete Blueprint');

    // ---- Root element selector ---- //
    // Root Element for this Dialog Page
    this.rootElement = 'div[id="cmpsr-modal-delete"] .modal-dialog .modal-content';

    // Header
    this.headerElement = `${this.rootElement} .modal-header`;

    // Body
    this.bodyElement = `${this.rootElement} .modal-body`;

    // Footer
    this.footerElement = `${this.rootElement} .modal-footer`;

    // ---- Page element selector ---- //
    // Page Title
    this.labelPageTitle = `${this.headerElement} h4[class="modal-title"]`;

    // X Close Button
    this.btnXClose = `${this.headerElement} span[class="pficon pficon-close"]`;

    // Blueprint Name label
    this.labelBlueprintName = `${this.bodyElement} p strong`;

    // Delete and Cancel button
    this.btnDelete = `${this.footerElement} button[class="btn btn-danger"]`;
    this.btnCancel = `${this.footerElement} button[class="btn btn-default"]`;
  }

  // **** start page actions ****
  static deleteBlueprint(bpName) {
    const page = new this();

    const btnMoreAction = BlueprintsPage.btnMore(bpName);
    const menuActionDelete = BlueprintsPage.menuActionDelete(bpName);
    const blueprintNameSelector = BlueprintsPage.blueprintNameSelector(bpName);

    helper.goto(page)
      .waitForVisible(btnMoreAction);

    browser
      .click(btnMoreAction)
      .click(menuActionDelete)
      .waitForVisible(page.btnDelete);

    browser
      .waitUntil(() => $(page.labelBlueprintName).getText() === bpName);

    browser
      .click(page.btnDelete)
      // wait until the blueprint has been deleted
      .waitForExist(blueprintNameSelector, config.config.waitforTimeout, true);
  }
};
