const ncp = require('copy-paste');
const assert = require('assert');
const faker = require('faker');

const ViewBlueprintPage = require('../pages/viewBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const CreateImagePage = require('../pages/createImage');
const ToastNotifPage = require('../pages/toastNotif');
const ExportBlueprintPage = require('../pages/exportBlueprint');

const helper = require('../utils/helper_wdio');
const pageConfig = require('../config');

describe('View Blueprint Page', function() {
  const viewBlueprintPage = new ViewBlueprintPage(pageConfig.blueprint.simple.name);

  describe('Single Word Blueprint Name Scenario', function() {
    // Array of image types and architechtures
    const images = pageConfig.image;

    beforeEach(function() {
      CreateBlueprintPage.newBlueprint(pageConfig.blueprint.simple);

      helper.goto(viewBlueprintPage);
    });

    afterEach(function() {
      DeleteBlueprintPage.deleteBlueprint(pageConfig.blueprint.simple.name);
    });

    it('should have all sanity attributes when shown', function() {
      browser
        .waitForVisible(viewBlueprintPage.componentsTabElement);

      browser
        .click(viewBlueprintPage.componentsTabElement)
        .waitForVisible(viewBlueprintPage.tabSelectedComponents);

      browser
        .click(viewBlueprintPage.tabSelectedComponents)
        .waitForVisible(viewBlueprintPage.contentSelectedComponents);

      // validate that we have a title
      const actualTitle = $(viewBlueprintPage.labelBlueprintName).getText();
      assert.equal(actualTitle, viewBlueprintPage.blueprintName);

      // validate description
      const actualDescription = $(viewBlueprintPage.labelBlueprintDescription).getText();
      assert.equal(actualDescription, pageConfig.blueprint.simple.description);

      // should have Create Image button
      const createImageText = $(viewBlueprintPage.btnCreateImage).getText();
      assert.equal(createImageText, viewBlueprintPage.varCreateImage);

      // now click back to the Details tab
      browser
        .waitForVisible(viewBlueprintPage.detailTabElement)

      browser
        .click(viewBlueprintPage.detailTabElement)
        .waitForVisible(viewBlueprintPage.labelNameUnderDetails);

      // name matches
      const nameInDetailsTab = $(viewBlueprintPage.labelNameUnderDetails).getText();
      assert.equal(nameInDetailsTab, viewBlueprintPage.blueprintName);
      // description matches
      const descriptionInDetails = $(viewBlueprintPage.labelDescriptionUnderDetails).getText();
      assert.equal(descriptionInDetails, pageConfig.blueprint.simple.description);
    });


    describe('Details Tab', function() {
      it('should update description', function() {
        // Highlight the expected result
        const expected = faker.lorem.sentence();

        browser
          .waitForVisible(viewBlueprintPage.detailTabElement)

        browser
          .click(viewBlueprintPage.detailTabElement)
          .waitForVisible(viewBlueprintPage.btnEditDescriptionUnderDetails);

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

      it('should not update description when clicking cancel', function() {
        browser
          .waitForVisible(viewBlueprintPage.detailTabElement)

        browser
          .click(viewBlueprintPage.detailTabElement)
          .waitForVisible(viewBlueprintPage.btnEditDescriptionUnderDetails);

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
        assert.equal(newDescription, pageConfig.blueprint.simple.description);
      });

      describe('Create Image Tests', function() {
        const createImagePage = new CreateImagePage(images[0].type, images[0].arch);

        it('should pop up Create Image window by clicking Create Image button', function() {
          browser
            .waitForVisible(viewBlueprintPage.detailTabElement)

          browser
            .click(viewBlueprintPage.detailTabElement)
            .waitForVisible(viewBlueprintPage.btnCreateImage);

          browser
            .click(viewBlueprintPage.btnCreateImage)
            .waitForVisible(createImagePage.dialogRootElement);

          const actualText = $(createImagePage.labelCreateImage).getText();
          assert.equal(actualText, createImagePage.varCreateImage);
        });

        images.forEach((image) => {
          it(`should have toast notification pop up for image ${image.type}/${image.arch}`, function() {
            const createImagePage = new CreateImagePage(image.type, image.arch);
            const toastNotifPage = new ToastNotifPage(pageConfig.blueprint.simple.name);

            browser
              .waitForVisible(viewBlueprintPage.btnCreateImage);

            browser
              .click(viewBlueprintPage.btnCreateImage)
              .waitForVisible(createImagePage.dialogRootElement);

            browser
              .waitForVisible(createImagePage.selectImageType);

            browser
              .selectByVisibleText(createImagePage.selectImageType, createImagePage.imageType)
              .selectByVisibleText(createImagePage.selectImageArch, createImagePage.imageArch)
              .click(createImagePage.btnCreate)
              .waitForVisible(toastNotifPage.iconCreating);

            // first status is Creating
            const text_creating = $(toastNotifPage.labelStatus).getText();
            assert.equal(text_creating, toastNotifPage.varStatusCreating);

            // then it changes to Complete
            browser
              .waitForVisible(toastNotifPage.iconComplete);

            const text_complete = $(toastNotifPage.labelStatus).getText();
            assert.equal(text_complete, toastNotifPage.varStatusComplete);
          });
        }); // for image
      });
    });

    describe('Export Blueprint To Manifest Test', () => {
      const exportBlueprintPage = new ExportBlueprintPage();

      // More action menu
      const btnMoreAction = `${viewBlueprintPage.pagelevelActions} ${viewBlueprintPage.btnMore}`;
      const menuActionExport = `${viewBlueprintPage.pagelevelActions} ${viewBlueprintPage.menuActionExport}`;

      it('sanity test', function() {
        browser
          .waitForVisible(btnMoreAction)

        browser
          .click(btnMoreAction)
          .waitForVisible(menuActionExport);

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
        pageConfig.blueprint.simple.packages.forEach(function(pkg) {
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
