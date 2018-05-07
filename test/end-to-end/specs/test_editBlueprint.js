const assert = require('assert');
const config = require('../wdio.conf.js');

const testData = config.testData;
const helper = require('../utils/helper');

const BlueprintsPage = require('../pages/blueprints');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const EditBlueprintPage = require('../pages/editBlueprint');
const CreateImagePage = require('../pages/createImage');
const ToastNotifPage = require('../pages/toastNotif');
const ExportBlueprintPage = require('../pages/exportBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');


describe('Given Edit Blueprint Page', () => {
  const editBlueprintPage = new EditBlueprintPage(testData.blueprint.simple.name);


  afterEach(() => {
    DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
  });


  describe('When page is opened', () => {
    beforeEach(() => {
      CreateBlueprintPage.newBlueprint(testData.blueprint.simple);

      helper.goto(editBlueprintPage)
        .waitForVisible(editBlueprintPage.componentListItemRootElement);
    });

    it('Then sanity validation will pass', () => {
      browser
        .waitForVisible(editBlueprintPage.linkBlueprintName);

      // check the link at the top of the page
      const actualBlueprintName = $(editBlueprintPage.linkBlueprintName).getText();
      assert.equal(actualBlueprintName, editBlueprintPage.blueprintName);

      const actualLink = $(editBlueprintPage.linkBlueprintName).getAttribute('href');
      assert(actualLink.includes(editBlueprintPage.varLinkToViewRec));

      browser
        .waitForVisible(editBlueprintPage.labelBlueprintTitle);

      // check the title inside the page
      const actualTitle = $(editBlueprintPage.labelBlueprintTitle).getText();
      assert.equal(actualTitle, editBlueprintPage.blueprintName);

      // commit button should be disabled
      browser
        .waitForVisible(editBlueprintPage.btnDisabledCommit);

      // discard changes button should be disabled
      browser
        .waitForVisible(editBlueprintPage.btnDisabledDiscard);

      // Pending Changes link should not exist
      browser
        .waitForExist(editBlueprintPage.linkPendingChange, config.config.waitforTimeout, true);
    });

    it('And When clicking Create Image button Then will show Create Image dialog', () => {
      // note: functionality of image creation dialog is validated in test_viewBlueprints.js
      // here we only validate that the buttons placed on the main page still
      // trigger the same dialog
      const createImagePage = new CreateImagePage(testData.image[0].type, testData.image[0].arch);

      browser
        .waitForEnabled(editBlueprintPage.btnCreateImage);

      browser
        .click(editBlueprintPage.btnCreateImage)
        .waitForVisible(createImagePage.dialogRootElement);

      const actualText = $(createImagePage.labelCreateImage).getText();
      assert.equal(actualText, createImagePage.varCreateImage);
    });


    it('And When : button is clicked Then it should trigger the export dialog', () => {
      // NOTE the rest of the export functionality is tested in
      // test_viewBlueprint.js. Here we only verify that the action
      // buttons show the same dialog
      const exportBlueprintPage = new ExportBlueprintPage();

      browser
        .waitForVisible(editBlueprintPage.btnMore);

      browser
        .click(editBlueprintPage.btnMore)
        .waitForVisible(editBlueprintPage.menuActionExport);

      // now activate the export dialog
      browser
        .click(editBlueprintPage.menuActionExport)
        .waitForVisible(exportBlueprintPage.rootElement);

      browser
        .waitForVisible(exportBlueprintPage.labelExportTitle);

      // just wait for the list of packages to be shown
      browser
        .waitForVisible(exportBlueprintPage.textAreaContent);

      // verify it was shown as expected
      const exportTitle = $(exportBlueprintPage.labelExportTitle).getText();
      assert.equal(exportTitle, exportBlueprintPage.varExportTitle);
    });

    describe('When filtering components', () => {
      beforeEach(() => {
        browser
          .waitForVisible(editBlueprintPage.inputFilter);

        // filter out components
        browser
          .setValue(editBlueprintPage.inputFilter, 'httpd')
          .addValue(editBlueprintPage.inputFilter, '\u000d')
          .waitForVisible(editBlueprintPage.linkClearAllFilters);

        // wait until a filter label with the correct name is shown
        browser
          .waitUntil(() => $(editBlueprintPage.labelFilterContent).getText() === 'Name: httpd');

        // wait for the search results to appear
        browser
          .waitForVisible('.list-pf-content.list-pf-content-flex');
      });


      [
        editBlueprintPage.btnClearFilter,
        editBlueprintPage.linkClearAllFilters,
      ].forEach((selector) => {
        it('Then will clear filter results by clicking X button or Clear All link', () => {
          browser
            .waitForVisible(selector);

          // clear filters
          browser
            .click(selector)
            .waitForVisible(editBlueprintPage.componentListItemRootElement);

          // wait for the search results to reload
          browser
            .waitForVisible('.list-pf-content.list-pf-content-flex');

          // wait until filters are gone
          browser
            .waitForExist(editBlueprintPage.btnClearFilter, config.config.waitforTimeout, true);
          browser
            .waitForExist(editBlueprintPage.linkClearAllFilters, config.config.waitforTimeout, true);
        });
      });

      it('Then selected component icon should have border', () => {
        // select the first component in the filtered results
        browser
          .waitForVisible(editBlueprintPage.componentListItemRootElementSelect);

        browser
          .click(editBlueprintPage.componentListItemRootElementSelect);

        browser
          .waitForVisible(editBlueprintPage.btnCommit);

        // verify bordered icon
        browser
          .waitForVisible(editBlueprintPage.iconBorderedTheFirstComponent);

        // then remove the selected component from the list
        browser
          .waitForVisible(editBlueprintPage.iconMinusTheFirstComponent);

        browser
          .click(editBlueprintPage.iconMinusTheFirstComponent);

        // and verify that the icon changes back to one without border
        browser
          .waitForVisible(editBlueprintPage.iconTheFirstComponent);
        browser
          .waitForVisible(editBlueprintPage.iconPlusTheFirstComponent);
      });
    });
  });


  describe('When page is opened with uncommitted changes', () => {
    beforeEach(() => {
      CreateBlueprintPage.newBlueprint(testData.blueprint.simple, false);

      helper.goto(editBlueprintPage);
    });

    it('Then additional buttons are enabled', () => {
      // commit button is enabled
      browser
        .waitForVisible(editBlueprintPage.btnCommit);

      // Discard Changes button is enabled
      browser
        .waitForVisible(editBlueprintPage.btnDiscard);

      // Pending Changes link is displayed
      browser
        .waitForVisible(editBlueprintPage.linkPendingChange);
    });
  });
});
