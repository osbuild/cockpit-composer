// Create Composition page object
const MainPage = require('./main');

module.exports = class CreateComposPage extends MainPage {
  constructor(type, arch) {
    super('Create Composition');
    this.composType = type;
    this.composArch = arch;

    // Close button
    this.btnClose = '.modal-header .close';

    // Create Copmosition label
    this.varCreateCompos = 'Create Composition';
    this.labelCreateCompos = '#myModalLabel';

    // Recipe Name label
    this.labelRecipeName = 'p[class="form-control-static"]';

    // Composition Type and Architecture select
    this.selectComposType = 'label[for="textInput-modal-markup"] + div select';
    this.selectComposArch = 'label[for="textInput2-modal-markup"] + div select';

    // Create and Cancel button
    this.btnCreate = '.modal-footer .btn-primary';
    this.btnCancel = '.modal-footer .btn-default';
  }
};
