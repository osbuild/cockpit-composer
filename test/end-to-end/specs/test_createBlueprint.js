const assert = require('assert');
const faker = require('faker');
const helper = require('../utils/helper');
const testData = require('../wdio.conf.js').testData;

const BlueprintsPage = require('../pages/blueprints');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const EditBlueprintPage = require('../pages/editBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');
const ToastNotifPage = require('../pages/toastNotif');


describe('Create Blueprint Page', () => {
  const blueprintsPage = new BlueprintsPage();
  const createBlueprintPage = new CreateBlueprintPage(
    testData.blueprint.simple.name,
    testData.blueprint.simple.description);

  beforeEach(() => {
    helper.goto(blueprintsPage)
      .waitForVisible(blueprintsPage.btnCreateBlueprint);
  });

  describe('Input Data Validation Test', () => {
    describe('Required Field Missing', () => {
      it('show alert message when creating blueprint without name', () => {
        browser
          .click(blueprintsPage.btnCreateBlueprint)
          .waitForVisible(createBlueprintPage.dialogRootElement);

        // make sure the modal dialog is fully loaded
        browser
          .waitForVisible(createBlueprintPage.labelCreateBlueprint);

        // wait until the name input element has focus
        browser
          .waitUntil(() => $(createBlueprintPage.inputName).hasFocus());

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

      it.skip('show alert message when creating blueprint without name by clicking Enter', () => {
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

      it('should show alert message by changing focus to description input', () => {
        browser
          .waitForVisible(blueprintsPage.btnCreateBlueprint);

        browser
          .click(blueprintsPage.btnCreateBlueprint)
          .waitUntil(() => $(createBlueprintPage.inputName).hasFocus());

        // change the focus to the next input field
        $(createBlueprintPage.inputDescription).click();

        browser
          .waitForExist(createBlueprintPage.spanHelpBlockMsg);

        const actualText = $(createBlueprintPage.spanHelpBlockMsg).getText();

        assert.equal(actualText, createBlueprintPage.varHelpBlockMsg);
      });
    });
  });

  describe('Simple Valid Input Test', () => {
    const editBlueprintPage = new EditBlueprintPage(testData.blueprint.simple.name);

    afterEach(() => {
      // Delete created blueprint after each creation case
      DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
    });

    it('should switch to Edit Blueprint page after BP creation', () => {
      browser
        .click(createBlueprintPage.btnCreateBlueprint)
        .waitForVisible(createBlueprintPage.dialogRootElement);

      browser
        .setValue(createBlueprintPage.inputName, testData.blueprint.simple.name)
        .setValue(createBlueprintPage.inputDescription, testData.blueprint.simple.description)
        .click(createBlueprintPage.btnCreate)
        // this component is visible only if we've been redirected to the edit page
        .waitForVisible(editBlueprintPage.componentListItemRootElement);
    });
  });
});
