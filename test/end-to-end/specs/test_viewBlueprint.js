const ncp = require('copy-paste');
const assert = require('assert');
const faker = require('faker');

const ViewBlueprintPage = require('../pages/viewBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const CreateImagePage = require('../pages/createImage');
const ToastNotifPage = require('../pages/toastNotif');
const ExportBlueprintPage = require('../pages/exportBlueprint');

const helper = require('../utils/helper');
const testData = require('../wdio.conf.js').testData;

describe('View Blueprint Page', () => {
  const viewBlueprintPage = new ViewBlueprintPage(testData.blueprint.simple.name);

  describe('Single Word Blueprint Name Scenario', () => {
    // Array of image types and architechtures
    const images = testData.image;

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

      describe('Create Image Tests', () => {
        const createImagePage = new CreateImagePage(images[0].type, images[0].arch);

        it('should pop up Create Image window by clicking Create Image button', () => {
          browser
            .click(viewBlueprintPage.btnCreateImage)
            .waitForVisible(createImagePage.dialogRootElement);

          const actualText = $(createImagePage.labelCreateImage).getText();
          assert.equal(actualText, createImagePage.varCreateImage);
        });

        images.forEach((image) => {
          it(`should have toast notification pop up for image ${image.type}/${image.arch}`, () => {
            const createImagePage2 = new CreateImagePage(image.type, image.arch);
            const toastNotifPage = new ToastNotifPage(testData.blueprint.simple.name);

            browser
              .click(viewBlueprintPage.btnCreateImage)
              .waitForVisible(createImagePage2.dialogRootElement);

            browser
              .waitForVisible(createImagePage2.selectImageType);

            browser
              .selectByVisibleText(createImagePage2.selectImageType, createImagePage2.imageType)
              .selectByVisibleText(createImagePage2.selectImageArch, createImagePage2.imageArch)
              .click(createImagePage2.btnCreate)
              .waitForVisible(toastNotifPage.iconCreating);

            // first status is Creating
            const textCreating = $(toastNotifPage.labelStatus).getText();
            assert.equal(textCreating, toastNotifPage.varStatusCreating);

            // then it changes to Complete
            browser
              .waitForVisible(toastNotifPage.iconComplete);

            const textComplete = $(toastNotifPage.labelStatus).getText();
            assert.equal(textComplete, toastNotifPage.varStatusComplete);
          });
        }); // for image
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

        // grab the text from the clipboard
        // and verify it is still the same text
        const clipboardText = ncp.paste();
        assert.equal(clipboardText, componentsText);
      });
    });
  });
});
