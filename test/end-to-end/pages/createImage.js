// Create Image page object
const MainPage = require('./main');

module.exports = class CreateImagePage extends MainPage {
  constructor(type, arch) {
    super('Create Image');
    this.imageType = type;
    this.imageArch = arch;

    // ---- Root element selector ---- //
    // Create Blueprint dialog root selector
    this.dialogRootElement = 'div[id="cmpsr-modal-crt-image"]';

    // ---- Page element selector ---- //
    // Close button
    this.btnClose = `${this.dialogRootElement} .modal-header .close`;

    // Create Copmosition label
    this.varCreateImage = 'Create Image';
    this.labelCreateImage = `${this.dialogRootElement} #myModalLabel`;

    // Blueprint Name label
    this.labelBlueprintName = `${this.dialogRootElement} p[class="form-control-static"]`;

    // Image Type and Architecture select
    this.selectImageType = `${this.dialogRootElement} label[for="textInput-modal-markup"] + div select`;
    this.selectImageArch = `${this.dialogRootElement} label[for="textInput2-modal-markup"] + div select`;

    // Create and Cancel button
    this.btnCreate = `${this.dialogRootElement} .modal-footer .btn-primary`;
    this.btnCancel = `${this.dialogRootElement} .modal-footer .btn-default`;
  }
};
