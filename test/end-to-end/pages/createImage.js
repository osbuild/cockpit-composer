// Create Image page object
const MainPage = require('./main');

module.exports = class CreateImagePage extends MainPage {
  constructor(type, label) {
    super('Create Image');
    this.imageType = type;
    this.imageTypeLabel = label;

    // ---- Root element selector ---- //
    // Create Blueprint dialog root selector
    this.dialogRootElement = '[id="cmpsr-modal-crt-image"]';

    // ---- Page element selector ---- //
    // Close button
    this.btnClose = `${this.dialogRootElement} .modal-header .close`;

    // Create Composition label
    this.varCreateImage = 'Create Image';
    this.labelCreateImage = `${this.dialogRootElement} [id="myModalLabel"]`;

    // Blueprint Name label
    this.labelBlueprintName = `${this.dialogRootElement} [data-id="cmpsr-form-blueprint"]`;

    // Image Type select
    this.selectImageType = `${this.dialogRootElement} form div:nth-child(2) div select`;

    // Create and Cancel button
    this.btnCreate = `${this.dialogRootElement} .modal-footer .btn-primary`;
    this.btnCancel = `${this.dialogRootElement} .modal-footer .btn-default`;
  }
};
