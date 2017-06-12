// Create Composition page object
const MainPage = require('./main');

module.exports = class CreateComposPage extends MainPage {
  constructor(type, arch) {
    super('Create Composition');
    this.composType = type;
    this.composArch = arch;

// ---- Root element selector ---- //
    // Create Recipe dialog root selector
    this.dialogRootElement = 'div[id="cmpsr-modal-crt-compos"]';

// ---- Page element selector ---- //
    // Close button
    this.btnClose = `${this.dialogRootElement} .modal-header .close`;

    // Create Copmosition label
    this.varCreateCompos = 'Create Composition';
    this.labelCreateCompos = `${this.dialogRootElement} #myModalLabel`;

    // Recipe Name label
    this.labelRecipeName = `${this.dialogRootElement} p[class="form-control-static"]`;

    // Composition Type and Architecture select
    this.selectComposType = `${this.dialogRootElement} label[for="textInput-modal-markup"] + div select`;
    this.selectComposArch = `${this.dialogRootElement} label[for="textInput2-modal-markup"] + div select`;

    // Create and Cancel button
    this.btnCreate = `${this.dialogRootElement} .modal-footer .btn-primary`;
    this.btnCancel = `${this.dialogRootElement} .modal-footer .btn-default`;
  }
};
