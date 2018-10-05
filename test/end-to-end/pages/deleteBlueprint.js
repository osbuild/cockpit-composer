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
    this.rootElement = '[id="cmpsr-modal-delete"] .modal-dialog .modal-content';

    // Header
    this.headerElement = `${this.rootElement} .modal-header`;

    // Body
    this.bodyElement = `${this.rootElement} .modal-body`;

    // Footer
    this.footerElement = `${this.rootElement} .modal-footer`;

    // ---- Page element selector ---- //
    // Page Title
    this.labelPageTitle = `${this.headerElement} [id="myModalLabel"]`;

    // X Close Button
    this.btnXClose = `${this.headerElement} .pficon-close`;

    // Blueprint Name label
    this.labelBlueprintName = `${this.bodyElement} p strong`;

    // Delete and Cancel button
    this.btnDelete = `${this.footerElement} .btn-danger`;
    this.btnCancel = `${this.footerElement} .btn-default`;
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
      .waitForVisible(menuActionDelete);
    browser
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
