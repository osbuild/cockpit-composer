// export recipe page object
const MainPage = require('./main');

module.exports = class exportRecipePage extends MainPage {
  constructor() {
    super('Export Recipe');

    // Root Element for this Dialog Page
    this.rootElement = '#cmpsr-modal-export';

    // Modal Title
    this.varExportTitle = 'Export Recipe';
    this.labelExportTitle = `${this.rootElement} h4[id="myModalLabel"]`;

    // Close Button
    this.btnClose = `${this.rootElement} span[class="pficon pficon-close"]`;

    // Recipe Name label
    this.labelRecipeName = `${this.rootElement} p[class="form-control-static"]`;

    // Export as select
    this.selectExportAs = `${this.rootElement} select[class="form-control"]`;

    // Content text area
    this.textAreaContent = `${this.rootElement} textarea[id="textInput2-modal-markup"]`;

    // Total components number label
    this.labelTotalComponents = `${this.textAreaContent} + p`;
    this.varTotalComponents = 'total components';

    // Copy and Close button
    this.btnCopy = `${this.rootElement} .modal-footer button[class="btn btn-primary"]`;
    this.btnClose = `${this.rootElement} .modal-footer button[class="btn btn-default" data-dismiss="modal"]`;
  }
};
