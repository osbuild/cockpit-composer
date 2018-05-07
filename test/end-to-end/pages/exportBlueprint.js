// export blueprint page object
const MainPage = require('./main');

module.exports = class exportBlueprintPage extends MainPage {
  constructor() {
    super('Export Blueprint');

    // ---- Root element selector ---- //
    // Root Element for this Dialog Page
    this.rootElement = 'div[id="cmpsr-modal-export"]';

    // ---- Page element selector ---- //
    // Modal Title
    this.varExportTitle = 'Export Blueprint';
    this.labelExportTitle = `${this.rootElement} h4[id="myModalLabel"]`;

    // Close Button
    this.btnClose = `${this.rootElement} span[class="pficon pficon-close"]`;

    // Blueprint Name label
    this.labelBlueprintName = `${this.rootElement} p[class="form-control-static"]`;

    // Export as select
    this.selectExportAs = `${this.rootElement} select[class="form-control"]`;

    // Content text area
    this.textAreaContent = `${this.rootElement} textarea[id="textInput2-modal-markup"]`;

    // Total components number label
    this.labelTotalComponents = `${this.textAreaContent} + p`;
    this.varTotalComponents = 'total components';
    this.varEmptyTotalComponents = '0 total components';

    // Copy and Close button
    this.btnCopy = `${this.rootElement} .modal-footer button[class="btn btn-primary"]`;
    this.btnClose = `${this.rootElement} .modal-footer button[class="btn btn-default" data-dismiss="modal"]`;
  }
};
