// Delete Blueprint page object
const MainPage = require('./main');

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
};
