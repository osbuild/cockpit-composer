// Create Recipe page object
const MainPage = require('./main');

module.exports = class CreateRecipePage extends MainPage {
  constructor(name, desc) {
    super('Create Recipe');
    this.varRecName = name;
    this.varEmptyName = '';
    this.varRecDesc = desc;

// ---- Root element selector ---- //
    // Create Recipe dialog root selector
    this.dialogRootElement = 'div[id="cmpsr-modal-crt-recipe"]';

// ---- Page element selector ---- //
    // Close button
    this.btnClose = `${this.dialogRootElement} .modal-header .close`;

    // Create Recipe label
    this.varCreateRecipe = 'Create Recipe';
    this.labelCreateRecipe = `${this.dialogRootElement} #myModalLabel`;

    // Recipe Name and Description Input
    this.inputName = `${this.dialogRootElement} #textInput-modal-markup`;
    this.inputDescription = `${this.dialogRootElement} #textInput2-modal-markup`;

    // Save and Cancel button
    this.btnSave = `${this.dialogRootElement} .modal-footer .btn-primary`;
    this.btnCancel = `${this.dialogRootElement} .modal-footer .btn-default`;

    // Alert label
    this.varAlertMissingInfo = 'Required information is missing.';
    this.varAlertDuplicateInfo = 'Specify a new recipe name.';
    this.labelAlertInfo = `${this.dialogRootElement} .alert-danger strong`;
  }
};
