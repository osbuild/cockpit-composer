// Toast Notification page object
const MainPage = require('./main');

module.exports = class TostaNotifPage extends MainPage {
  constructor(blueprintName) {
    super('Toast Notification');
    this.notifFor = blueprintName;

    // Notification pop up window
    this.divNotifWindow = '.toast-notifications-list-pf';

    // Working and Complete icon
    this.iconCreating = '#cmpsr-toast-0 .pficon .spinner-inverse';
    this.iconComplete = '#cmpsr-toast-0 .pficon-ok';

    // Blueprint Name label
    this.labelBlueprintName = '#cmpsr-toast-0 span strong';
    this.varBlueprintName = `${this.notifFor}:`;
    this.varEmptyName = ':';

    // Working and Complete status label
    this.varStatusCreating = `${this.varBlueprintName} Creating image.`;
    this.varStatusComplete = `${this.varBlueprintName} Image creation is complete.`;

    // Notification label
    this.labelStatus = '#cmpsr-toast-0 span + span';

    // Blueprint committing and committed status label
    this.varStatusCommitting = `${this.varBlueprintName} Committing blueprint.`;
    this.varStatusCommitted = `${this.varBlueprintName} Blueprint changes are committed.`;

    // close button
    this.btnClose = '#cmpsr-toast-0 .close';
  }
};
