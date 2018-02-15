// Changes Pending Save page object
const MainPage = require('./main');

module.exports = class changesPendingSave extends MainPage {
  constructor() {
    super('Changes Pending Save');

// ---- Root element selector ---- //
    // Root Element for this Dialog Page
    this.rootElement = 'div[id="cmpsr-modal-pending-changes"] .modal-dialog .modal-content';

    // Header
    this.headerElement = `${this.rootElement} .modal-header`;

    // Body
    this.bodyElement = `${this.rootElement} .modal-body`;

    // Footer
    this.footerElement = `${this.rootElement} .modal-footer`;

// ---- Page element selector ---- //
    // Page Title
    this.varPageTitle = 'Changes Pending Save';
    this.labelPageTitle = `${this.headerElement} h4[class="modal-title"]`;

    // X Close Button
    this.btnXClose = `${this.headerElement} span[class="pficon pficon-close"]`;

    // Blueprint Name label
    this.labelBlueprintName = `${this.bodyElement} p[class="form-control-static"]`;

    // Comment text area
    this.textAreaComment = `${this.bodyElement} textarea[id="textInput2-modal-markup"]`;

    // Pending changes action
    this.labelPendingChangesAction = `${this.bodyElement} ul li div div[class="col-sm-3"]`;

    // Pending changes component
    this.labelPendingChangesComponent = `${this.bodyElement} ul li div div strong`;

    // Save and Close button
    this.btnSave = `${this.footerElement} button[class="btn btn-primary"]`;
    this.btnClose = `${this.footerElement} button[class="btn btn-default" data-dismiss="modal"]`;
  }
};
