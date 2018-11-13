// Create Blueprint page object
const helper = require('../utils/helper');
const config = require('../wdio.conf.js');
const MainPage = require('./main');
const BlueprintPage = require('./blueprints');
const EditBlueprintPage = require('./editBlueprint');
const ChangesPendingCommitPage = require('./changesPendingCommit');
const ToastNotifPage = require('./toastNotif');


module.exports = class CreateBlueprintPage extends BlueprintPage {
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

  // **** start page actions ****
  static newBlueprint(bpObject, commit = true) {
    const page = new this();
    const editPage = new EditBlueprintPage(bpObject.name);
    const commitDialog = new ChangesPendingCommitPage();
    const toastNotification = new ToastNotifPage(bpObject.name);

    // first create the blueprint
    helper.goto(page)
      .waitForVisible(page.btnCreateBlueprint);

    browser
      .click(page.btnCreateBlueprint)
      .waitForVisible(page.dialogRootElement);

    browser
      .setValue(page.inputName, bpObject.name)
      .setValue(page.inputDescription, bpObject.description)
      .click(page.btnCreate);

    $('.cmpsr-list-pf__compacted').waitForText(90000);

    browser
      .waitForVisible(editPage.inputFilter);

    // page is now in edit mode, add all the packages from the BP
    bpObject.packages.forEach((pkg) => {
      browser
        .setValue(editPage.inputFilter, pkg.name)
        .addValue(editPage.inputFilter, editPage.enter)
        .waitForVisible(editPage.linkClearAllFilters);

      // wait until a filter label with the correct name is shown
      browser
        .waitUntil(() => $(editPage.labelFilterContent).getText() === `Name: ${pkg.name}`);

      // wait for the search results to appear
      $('.cmpsr-list-pf__compacted').waitForText(90000);

      // find the package in the list of filtered results
      $$(editPage.availableComponentList).some((item) => {
        const title = item.$(editPage.availableComponentName).getText();
        if (title === pkg.name) {
          // clicks on the + button
          item.$(editPage.availableComponentPlusButton).click();
        }
        return title === pkg.name;
      });
    });

    browser
      .waitForEnabled(editPage.btnCommit);

    if (commit) {
      browser
        .click(editPage.btnCommit)
        // pop-up dialog to commit the changes
        .waitForVisible(commitDialog.btnCommit);

      browser
        .click(commitDialog.btnCommit)
        // wait until "Changes Pending Commit" dialog fades out
        .waitForExist(commitDialog.rootElement, config.config.waitforTimeout, true);

      // wait until toast notification dialog fades out
      browser
        .waitForExist('[id="cmpsr-toast-0"]', config.config.waitforTimeout, true);

      browser
        .waitForVisible(editPage.linkBackToBlueprints);
    }

    // return back to the main page
    browser
      .click(editPage.linkBackToBlueprints)
      .waitForExist(this.blueprintNameSelector(bpObject.name));

    // wait until the description is shown as well
    browser
      .waitUntil(
        () => browser.getText(`[data-blueprint="${bpObject.name}"] .list-group-item-text`) === bpObject.description,
        config.config.waitforTimeout,
        'expected description to be different from new created one after 5s'
      );
  }
};
