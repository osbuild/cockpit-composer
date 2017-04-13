// Create Recipe page object
const MainPage = require('./main');

module.exports = class CreateRecipePage extends MainPage {
  constructor(name, desc) {
    super('Create Recipe');
    this.varRecName = name;
    this.varRecDesc = desc;

    // Close button
    this.btnClose = '.modal-header .close';

    // Create Recipe label
    this.varCreateRecipe = 'Create Recipe';
    this.labelCreateRecipe = '#cmpsr-modal-crt-recipe #myModalLabel';

    // Recipe Name and Description Input
    this.inputName = '#cmpsr-modal-crt-recipe #textInput-modal-markup';
    this.inputDescription = '#cmpsr-modal-crt-recipe #textInput2-modal-markup';

    // Save and Cancel button
    this.btnSave = '#cmpsr-modal-crt-recipe .modal-footer .btn-primary';
    this.btnCancel = '.modal-footer .btn-default';

    // Alert label
    this.varAlertInfo = 'Required information is missing.';
    this.labelAlertInfo = '#cmpsr-modal-crt-recipe .alert-danger strong';
  }
};
