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

    // Blueprint saving and saved status label
    this.varStatusSaving = `${this.varBlueprintName} Saving blueprint.`;
    this.varStatusSaved = `${this.varBlueprintName} Blueprint is saved.`;

    // Cancel link
    this.linkCancel = '#cmpsr-toast-0 .toast-pf-action a';
  }
};
