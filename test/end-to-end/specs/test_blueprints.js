const assert = require('assert');
const faker = require('faker');
const helper = require('../utils/helper');
const testData = require('../wdio.conf.js').testData;

const BlueprintsPage = require('../pages/blueprints');
const CreateBlueprintPage = require('../pages/createBlueprint');
const CreateImagePage = require('../pages/createImage');
const ToastNotifPage = require('../pages/toastNotif');
const ExportBlueprintPage = require('../pages/exportBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const EditBlueprintPage = require('../pages/editBlueprint');


describe('Blueprints Page', function() {
  // Array of image types and architechtures
  const images = testData.image;
  const blueprintsPage = new BlueprintsPage();

  beforeEach(function() {
    helper.goto(blueprintsPage);
  });

  it('Sanity Check', function() {
    // Title should be Blueprints
    const actualTitle = browser.getTitle();
    assert.equal(actualTitle, blueprintsPage.title);

    // should have the Create Blueprint button
    browser
      .waitForVisible(blueprintsPage.btnCreateBlueprint);

    const buttonText = $(blueprintsPage.btnCreateBlueprint).getText();
    assert.equal(buttonText, blueprintsPage.varCreateBlueprint);
  });

  describe('Blueprint List', function() {
    const createImagePage = new CreateImagePage(images[0].type, images[0].arch);
    const btnCreateImage = BlueprintsPage.btnCreateImage(testData.blueprint.simple.name);

    const exportBlueprintPage = new ExportBlueprintPage();
    const btnMoreAction = BlueprintsPage.btnMore(testData.blueprint.simple.name);
    const menuActionDelete = BlueprintsPage.menuActionDelete(testData.blueprint.simple.name);
    const menuActionExport = BlueprintsPage.menuActionExport(testData.blueprint.simple.name);


    beforeEach(function() {
      CreateBlueprintPage.newBlueprint(testData.blueprint.simple);
    });

    afterEach(function() {
      DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
    });


    it('should Create Image dialog when clicking Create Image button', function() {
      // note: functionality of image creation dialog is validated in test_viewBlueprints.js
      // here we only validate that the buttons placed on the main page still
      // trigger the same dialog
      browser
        .waitForVisible(btnCreateImage);

      browser
        .click(btnCreateImage)
        .waitForVisible(createImagePage.dialogRootElement);

      const actualText = $(createImagePage.labelCreateImage).getText();
      assert.equal(actualText, createImagePage.varCreateImage);
    });

    it(': button should trigger the export dialog', function() {
      // NOTE the rest of the export functionality is tested in
      // test_viewBlueprint.js. Here we only verify that the action
      // buttons show the same dialog
      browser
        .waitForVisible(btnMoreAction)

      browser
        .click(btnMoreAction)
        .waitForVisible(menuActionExport);

      // menu was shown when clicking the ":" button
      const menuText = $(menuActionExport).getText();
      assert.equal(menuText, blueprintsPage.moreActionList.Export);

      // now activate the export dialog
      browser
        .click(menuActionExport)
        .waitForVisible(exportBlueprintPage.rootElement);

      browser
        .waitForVisible(exportBlueprintPage.labelExportTitle);

      // verify it was shown as expected
      const exportTitle = $(exportBlueprintPage.labelExportTitle).getText();
      assert.equal(exportTitle, exportBlueprintPage.varExportTitle);

      // just wait for the list of packages to be shown
      browser
        .waitForVisible(exportBlueprintPage.textAreaContent);
    });

    it('when clicking Cancel should close Delete Blueprint page and not delete', function() {
      const blueprintNameSelector = BlueprintsPage.blueprintNameSelector(testData.blueprint.simple.name);
      const deleteBlueprintPage = new DeleteBlueprintPage();

      browser
        .waitForVisible(btnMoreAction);

      browser
        .click(btnMoreAction)
        .click(menuActionDelete)
        .waitForVisible(deleteBlueprintPage.btnCancel);

      browser
        .click(deleteBlueprintPage.btnCancel)
        .waitForExist(blueprintNameSelector);
    });

    it('when clicking X should close Delete Blueprint page and not delete', function() {
      const blueprintNameSelector = BlueprintsPage.blueprintNameSelector(testData.blueprint.simple.name);
      const deleteBlueprintPage = new DeleteBlueprintPage();

      browser
        .waitForVisible(btnMoreAction);

      browser
        .click(btnMoreAction)
        .click(menuActionDelete)
        .waitForVisible(deleteBlueprintPage.btnXClose);

      browser
        .click(deleteBlueprintPage.btnXClose)
        .waitForExist(blueprintNameSelector);
    });

    it('should open Edit Blueprint page when clicking Edit Blueprint button', function() {
      const blueprintName = testData.blueprint.simple.name;
      const editBlueprintPage = new EditBlueprintPage(blueprintName);
      const blueprintNameSelector = BlueprintsPage.blueprintNameSelector(blueprintName);

      $$(blueprintsPage.itemsBlueprint).forEach(function(item) {
        const bpName = item.$(blueprintsPage.itemNamesBlueprint).getText();
        if (bpName === blueprintName) {
          item.$(blueprintsPage.btnEditBlueprint).click();
        }
      });

      browser
        .waitForVisible(editBlueprintPage.componentListItemRootElement);

      const pageTitle = $(editBlueprintPage.labelBlueprintTitle).getText();
      assert.equal(pageTitle, blueprintName);
    });
  });
});
