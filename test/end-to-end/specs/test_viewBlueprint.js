const assert = require('assert');
const faker = require('faker');

const ViewBlueprintPage = require('../pages/viewBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const ExportBlueprintPage = require('../pages/exportBlueprint');

const helper = require('../utils/helper');
const testData = require('../wdio.conf.js').testData;

describe('View Blueprint Page', () => {
  const viewBlueprintPage = new ViewBlueprintPage(testData.blueprint.simple.name);

  describe('Single Word Blueprint Name Scenario', () => {
    beforeEach(() => {
      CreateBlueprintPage.newBlueprint(testData.blueprint.simple);

      helper.goto(viewBlueprintPage)
        .waitForVisible(viewBlueprintPage.detailTabElement);

      // this loads a bit later together with the description
      // and some of the details
      browser
        .waitForVisible(viewBlueprintPage.labelBlueprintDescription);

      browser
        .waitForVisible(viewBlueprintPage.labelNameUnderDetails);

      browser
        .waitForVisible(viewBlueprintPage.labelDescriptionUnderDetails);

      browser
        .waitUntil(() => $(viewBlueprintPage.labelDescriptionUnderDetails).getText() === testData.blueprint.simple.description);

      // wait for the Create Image button to become enabled
      browser
        .waitForVisible(viewBlueprintPage.btnCreateImage);
    });

    afterEach(() => {
      DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
    });

    it('should have all sanity attributes when shown', () => {
      // validate that we have a title
      const actualTitle = $(viewBlueprintPage.labelBlueprintName).getText();
      assert.equal(actualTitle, viewBlueprintPage.blueprintName);

      // validate description in title bar
      browser
        .waitUntil(() => browser.isExisting(viewBlueprintPage.labelBlueprintDescription));

      const actualDescription = $(viewBlueprintPage.labelBlueprintDescription).getText();
      assert.equal(actualDescription, testData.blueprint.simple.description);

      // should have Create Image button
      const createImageText = $(viewBlueprintPage.btnCreateImage).getText();
      assert.equal(createImageText, viewBlueprintPage.varCreateImage);

      // name matches
      const nameInDetailsTab = $(viewBlueprintPage.labelNameUnderDetails).getText();
      assert.equal(nameInDetailsTab, viewBlueprintPage.blueprintName);

      // description matches
      browser
        .waitForVisible(viewBlueprintPage.labelDescriptionUnderDetails);

      const descriptionInDetails = $(viewBlueprintPage.labelDescriptionUnderDetails).getText();
      assert.equal(descriptionInDetails, testData.blueprint.simple.description);
    });


    describe('Details Tab', () => {
      it('should update description', () => {
        // Highlight the expected result
        const expected = faker.lorem.sentence();

        browser
          .click(viewBlueprintPage.btnEditDescriptionUnderDetails)
          .waitForVisible(viewBlueprintPage.inputTextDescriptionUnderDetails);

        browser
          .setValue(viewBlueprintPage.inputTextDescriptionUnderDetails, '')
          .addValue(viewBlueprintPage.inputTextDescriptionUnderDetails, expected)
          .waitForVisible(viewBlueprintPage.btnOkDescriptionUnderDetails);

        browser
          .click(viewBlueprintPage.btnOkDescriptionUnderDetails)
          .waitForVisible(viewBlueprintPage.labelBlueprintDescription);

        const newDescription = $(viewBlueprintPage.labelBlueprintDescription).getText();
        assert.equal(newDescription, expected);
      });

      it('should not update description when clicking cancel', () => {
        browser
          .click(viewBlueprintPage.btnEditDescriptionUnderDetails)
          .waitForVisible(viewBlueprintPage.inputTextDescriptionUnderDetails);

        browser
          .setValue(viewBlueprintPage.inputTextDescriptionUnderDetails, '')
          .addValue(viewBlueprintPage.inputTextDescriptionUnderDetails, faker.lorem.sentence())
          .waitForVisible(viewBlueprintPage.btnCancelDescriptionUnderDetails);

        browser
          .click(viewBlueprintPage.btnCancelDescriptionUnderDetails)
          .waitForVisible(viewBlueprintPage.labelBlueprintDescription);

        const newDescription = $(viewBlueprintPage.labelBlueprintDescription).getText();
        assert.equal(newDescription, testData.blueprint.simple.description);
      });
    });

    describe('Export Blueprint To Manifest Test', () => {
      const exportBlueprintPage = new ExportBlueprintPage();

      // More action menu
      const btnMoreAction = `${viewBlueprintPage.pagelevelActions} ${viewBlueprintPage.btnMore}`;
      const menuActionExport = `${viewBlueprintPage.pagelevelActions} ${viewBlueprintPage.menuActionExport}`;

      it('sanity test', () => {
        browser
          .waitForEnabled(btnMoreAction);

        browser
          .waitForEnabled(menuActionExport);

        browser
          .click(btnMoreAction);

        // menu was shown when clicking the ":" button
        const menuText = $(menuActionExport).getText();
        assert.equal(menuText, viewBlueprintPage.toolBarMoreActionList.Export);

        // now activate the export dialog
        browser
          .click(menuActionExport)
          .waitForVisible(exportBlueprintPage.rootElement);

        browser
          .waitForVisible(exportBlueprintPage.labelExportTitle);

        // verify it was shown as expected
        const exportTitle = $(exportBlueprintPage.labelExportTitle).getText();
        assert.equal(exportTitle, exportBlueprintPage.varExportTitle);

        // examine the list of packages that is shown
        browser
          .waitForVisible(exportBlueprintPage.textAreaContent);

        // verify all of the input packages are listed
        const componentsText = $(exportBlueprintPage.textAreaContent).getText();
        testData.blueprint.simple.packages.forEach((pkg) => {
          assert(componentsText.includes(pkg.name));
        });

        // now click the Copy button
        browser
          .waitForVisible(exportBlueprintPage.btnCopy);

        browser.click(exportBlueprintPage.btnCopy);

        // close export Blueprint window
        browser.click(exportBlueprintPage.btnClose);

        // wait export blueprint window closed
        browser
          .waitUntil(() => browser.isExisting(viewBlueprintPage.clearViewBlueprintWindow));
        // paste copied content into blueprint description box then check content
        browser
          .click(viewBlueprintPage.btnEditDescriptionUnderDetails)
          .waitForVisible(viewBlueprintPage.inputTextDescriptionUnderDetails);

        browser
          .setValue(viewBlueprintPage.inputTextDescriptionUnderDetails, ['Control', 'v'])
          .waitForVisible(viewBlueprintPage.btnOkDescriptionUnderDetails);

        browser
          .click(viewBlueprintPage.btnOkDescriptionUnderDetails)
          .waitForVisible(viewBlueprintPage.labelBlueprintDescription);

        // the text in blueprint description box does not include '\n', but space
        const newDescription = $(viewBlueprintPage.labelBlueprintDescription).getText();
        // the copied content should replace '\n' with space
        assert.equal(newDescription, componentsText.replace(/\n/g, ' '));
      });
    });
  });
});
