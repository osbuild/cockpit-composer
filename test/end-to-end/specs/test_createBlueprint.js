const assert = require('assert');
const faker = require('faker');
const helper = require('../utils/helper_wdio');
const pageConfig = require('../config');

const BlueprintsPage = require('../pages/blueprints');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const EditBlueprintPage = require('../pages/editBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');
const ToastNotifPage = require('../pages/toastNotif');


describe('Create Blueprint Page', function() {
  const blueprintsPage = new BlueprintsPage();
  const createBlueprintPage = new CreateBlueprintPage(
    pageConfig.blueprint.simple.name,
    pageConfig.blueprint.simple.description);

  beforeEach(function() {
    helper.goto(blueprintsPage);
  });

  describe('Input Data Validation Test', function() {
    describe('Required Field Missing', function() {
      it('show alert message when creating blueprint without name', function() {
        browser
          .click(blueprintsPage.btnCreateBlueprint)
          .waitForVisible(createBlueprintPage.dialogRootElement);

        // make sure the modal dialog is fully loaded
        browser
          .waitForVisible(createBlueprintPage.labelCreateBlueprint);

        // wait until the name input element has focus
        browser
          .waitUntil(function() {
            return $(createBlueprintPage.inputName).hasFocus();
          });

        browser
          .waitForVisible(createBlueprintPage.btnCreate);

        browser
          .click(createBlueprintPage.btnCreate)
          .waitForVisible(createBlueprintPage.labelAlertInfo);

        const actualAlertText = $(createBlueprintPage.labelAlertInfo).getText();
        const actualHelpText = $(createBlueprintPage.spanHelpBlockMsg).getText();

        assert.equal(actualAlertText, createBlueprintPage.varAlertInfo);
        assert.equal(actualHelpText, createBlueprintPage.varHelpBlockMsg);
      });

      it.skip('show alert message when creating blueprint without name by clicking Enter', function() {
        browser
          .click(blueprintsPage.btnCreateBlueprint)
          .waitForVisible(createBlueprintPage.dialogRootElement);

        browser
          .waitForVisible(createBlueprintPage.btnCreate);

        browser
          .keys('Enter') // appears to not be supported in Firefox
          .waitForVisible(createBlueprintPage.labelAlertInfo);

        const actualAlertText = $(createBlueprintPage.labelAlertInfo).getText();
        const actualHelpText = $(createBlueprintPage.spanHelpBlockMsg).getText();

        assert.equal(actualAlertText, createBlueprintPage.varAlertInfo);
        assert.equal(actualHelpText, createBlueprintPage.varHelpBlockMsg);
      });

      it('should show alert message by changing focus to description input', function () {
        browser
          .waitForVisible(blueprintsPage.btnCreateBlueprint);

        browser
          .click(blueprintsPage.btnCreateBlueprint)
          .waitUntil(function() {
            return $(createBlueprintPage.inputName).hasFocus();
          });

        // change the focus to the next input field
        $(createBlueprintPage.inputDescription).click();

        browser
          .waitForExist(createBlueprintPage.spanHelpBlockMsg);

        const actualText = $(createBlueprintPage.spanHelpBlockMsg).getText();

        assert.equal(actualText, createBlueprintPage.varHelpBlockMsg);
      });
    });
  });

  describe('Simple Valid Input Test', function() {
    const editBlueprintPage = new EditBlueprintPage(pageConfig.blueprint.simple.name);

    afterEach(function() {
      // Delete created blueprint after each creation case
      DeleteBlueprintPage.deleteBlueprint(pageConfig.blueprint.simple.name);
    });

    it('should switch to Edit Blueprint page after BP creation', function() {
      helper.goto(blueprintsPage)
        .click(createBlueprintPage.btnCreateBlueprint)
        .waitForVisible(createBlueprintPage.dialogRootElement);

      browser
        .setValue(createBlueprintPage.inputName, pageConfig.blueprint.simple.name)
        .setValue(createBlueprintPage.inputDescription, pageConfig.blueprint.simple.description)
        .click(createBlueprintPage.btnCreate)
        // this component is visible only if we've been redirected to the edit page
        .waitForVisible(editBlueprintPage.componentListItemRootElement);
    });
  });
});
