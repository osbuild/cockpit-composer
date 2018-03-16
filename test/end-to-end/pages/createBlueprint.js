// Create Blueprint page object
const MainPage = require('./main');

module.exports = class CreateBlueprintPage extends MainPage {
  constructor(name, desc) {
    super('Create Blueprint');
    this.varRecName = name;
    this.varRecDesc = desc;

// ---- Root element selector ---- //
    // Create Blueprint dialog root selector
    this.dialogRootElement = 'div[id="cmpsr-modal-crt-blueprint"]';

// ---- Page element selector ---- //
    // Close button
    this.btnClose = `${this.dialogRootElement} .modal-header .close`;

    // Create Blueprint label
    this.varCreateBlueprint = 'Create Blueprint';
    this.labelCreateBlueprint = `${this.dialogRootElement} #myModalLabel`;

    // Blueprint Name and Description Input
    this.inputName = `${this.dialogRootElement} #textInput-modal-markup`;
    this.inputNameEleId = 'textInput-modal-markup';
    this.inputDescription = `${this.dialogRootElement} #textInput2-modal-markup`;

    // Create and Cancel button
    this.btnCreate = `${this.dialogRootElement} .modal-footer .btn-primary`;
    this.btnCancel = `${this.dialogRootElement} .modal-footer .btn-default`;

    // Alert label
    this.varAlertInfo = 'Required information is missing.';
    this.labelAlertInfo = `${this.dialogRootElement} .alert-danger strong`;

    // Help-block error message
    this.varHelpBlockMsg = 'A blueprint name is required.';
    this.spanHelpBlockMsg = `${this.dialogRootElement} span[class="help-block"]`;
  }
};
