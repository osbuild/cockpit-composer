// nightmare helper
const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const pageConfig = require('../config');

// Create Blueprint page object
const BlueprintsPage = require('./blueprints');
const EditBlueprintPage = require('./editBlueprint');
const ChangesPendingCommitPage = require('./changesPendingCommit');
const ToastNotifPage = require('./toastNotif');
const helper = require('../utils/helper');

module.exports = class CreateBlueprintPage extends BlueprintsPage {
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
  static newBlueprint(bpObject, done) {
    const nightmare = Nightmare(pageConfig.nightmareOptions);
    const page = new this();
    const edit_page = new EditBlueprintPage(bpObject.name);
    const commit_dialog = new ChangesPendingCommitPage();
    const toastNotification = new ToastNotifPage(bpObject.name);

    // first create the blueprint
    helper.gotoURL(nightmare, page)
      .wait(page.btnCreateBlueprint)
      .click(page.btnCreateBlueprint)
      .wait(_page => document.querySelector(_page.dialogRootElement).style.display === 'block'
        , page)
      .insert(page.inputName, bpObject.name)
      .insert(page.inputDescription, bpObject.description)
      .click(page.btnCreate)
      // page is now in edit mode
      .wait(edit_page.componentListItemRootElement)
      .wait(edit_page.inputFilter)
      // then select only the first package
      .insert(edit_page.inputFilter, bpObject.packages[0].name)
      .type(edit_page.inputFilter, '\u000d')
      .wait(edit_page.linkClearAllFilters)
      // finds the package in the list of filtered results
      .evaluate((pkg) => {
        document.querySelectorAll('.list-pf-content.list-pf-content-flex').forEach(function(item) {
          // ^^^ find the exact package name match
          const title = item.querySelector('.list-pf-title').innerText;
          if (title === pkg.name) {
            // clicks on the + button
            item.querySelector('.btn-link').click();
          }
        });
      }, bpObject.packages[0])
      .wait(edit_page.btnCommit)
      .click(edit_page.btnCommit)
      // pop-up dialog to commit the changes
      .wait(commit_dialog.btnCommit)
      .click(commit_dialog.btnCommit)
      .wait(toastNotification.iconComplete)
      // return back to the main page
      .click(edit_page.linkBackToBlueprints)
      .wait(this.blueprintNameSelector(bpObject.name))
      .end()
      .then(() => { done(); })
      .catch((error) => { done(error); });
  }
};
