// Changes Pending Commit page object
const MainPage = require('./main');

module.exports = class changesPendingCommit extends MainPage {
  constructor() {
    super('Changes Pending Commit');

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
    this.varPageTitle = 'Changes Pending Commit';
    this.labelPageTitle = `${this.headerElement} h4[class="modal-title"]`;

    // X Close Button
    this.btnXClose = `${this.headerElement} span[class="pficon pficon-close"]`;

    // Blueprint Name label
    this.labelBlueprintName = `${this.bodyElement} p[class="form-control-static"]`;

    // Comment text area
    this.textAreaComment = `${this.bodyElement} textarea[id="textInput2-modal-markup"]`;

    // Line 1 Pending changes action
    this.labelLine1PendingChangesAction = `${this.bodyElement} ul li:nth-child(1) div div[class="col-sm-3"]`;

    // Line 1 Pending changes component
    this.labelLine1PendingChangesComponent = `${this.bodyElement} ul li:nth-child(1) div div strong`;

    // Line 2 Pending changes action
    this.labelLine2PendingChangesAction = `${this.bodyElement} ul li:nth-child(2) div div[class="col-sm-3"]`;

    // Line 2 Pending changes component
    this.labelLine2PendingChangesComponent = `${this.bodyElement} ul li:nth-child(2) div div strong`;

    // Commit and Close button
    this.btnCommit = `${this.footerElement} button[class="btn btn-primary"]`;
    this.btnClose = `${this.footerElement} button[class="btn btn-default"]`;
  }
};
