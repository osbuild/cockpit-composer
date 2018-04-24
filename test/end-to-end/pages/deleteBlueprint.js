// nightmare helper
const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const pageConfig = require('../config');
const helper = require('../utils/helper');

// Delete Blueprint page object
const MainPage = require('./main');
const BlueprintsPage = require('./blueprints');

module.exports = class deleteBlueprint extends BlueprintsPage {
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
  static deleteBlueprint(bpName, done) {
    const nightmare = new Nightmare(pageConfig.nightmareOptions);
    const page = new this();

    const btnMoreAction = BlueprintsPage.btnMore(bpName);
    const menuActionDelete = BlueprintsPage.menuActionDelete(bpName);
    const blueprintNameSelector = BlueprintsPage.blueprintNameSelector(bpName);

    // first create the blueprint
    helper.gotoURL(nightmare, page)
      .wait(btnMoreAction)
      .click(btnMoreAction)
      .wait(menuActionDelete)
      .click(menuActionDelete)
      .wait(page.btnDelete)
      .click(page.btnDelete)
      // wait until the blueprint has been deleted
      .wait(selector => document.querySelector(selector) === null, blueprintNameSelector)
      .end()
      .then(() => { done(); })
      .catch((error) => { done(error); });
  }
};
