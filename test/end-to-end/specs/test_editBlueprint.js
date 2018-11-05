const assert = require('assert');
const config = require('../wdio.conf.js');

const testData = config.testData;

const BlueprintsPage = require('../pages/blueprints');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const EditBlueprintPage = require('../pages/editBlueprint');
const CreateImagePage = require('../pages/createImage');
const ExportBlueprintPage = require('../pages/exportBlueprint');


describe('Given Edit Blueprint Page', () => {
  const editBlueprintPage = new EditBlueprintPage(testData.blueprint.simple.name);


  afterEach(() => {
    DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
  });


  describe('When page is opened', () => {
    beforeEach(() => {
      CreateBlueprintPage.newBlueprint(testData.blueprint.simple);
      const blueprintsPage = new BlueprintsPage();
      const blueprintName = testData.blueprint.simple.name;
      const rowSelector = `${blueprintsPage.itemsBlueprint}[data-blueprint="${blueprintName}"]`;

      browser
        .waitForVisible(`${rowSelector} a[href*="edit"]`);

      browser
        .click(`${rowSelector} a[href*="edit"]`);
      $('.cmpsr-list-pf__compacted').waitForText(90000);
    });

    it('Then sanity validation will pass', () => {
      browser
        .waitForVisible(editBlueprintPage.linkBlueprintName);

      // check the link at the top of the page
      const actualBlueprintName = $(editBlueprintPage.linkBlueprintName).getText();
      assert.equal(actualBlueprintName, editBlueprintPage.blueprintName);

      const actualLink = $(editBlueprintPage.linkBlueprintName).getAttribute('href');
      // the href attribute will return "#/blueprint/automation"
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
      const createImagePage = new CreateImagePage(testData.image[0].type);

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
          .addValue(editBlueprintPage.inputFilter, editBlueprintPage.enter)
          .waitForVisible(editBlueprintPage.linkClearAllFilters);

        // wait until a filter label with the correct name is shown
        browser
          .waitUntil(() => $(editBlueprintPage.labelFilterContent).getText() === 'Name: httpd');
      });

      it('Then will clear filter results by clicking Clear All link', () => {
        browser
          .waitForVisible(editBlueprintPage.linkClearAllFilters);

        // clear filters
        browser
          .click(editBlueprintPage.linkClearAllFilters);
        $('.cmpsr-list-pf__compacted').waitForText(90000);

        // the search tag and clear all link should disappear.
        browser
          .waitForExist(editBlueprintPage.linkClearAllFilters, config.config.waitforTimeout, true);
        browser
          .waitForExist(editBlueprintPage.btnClearFilter, config.config.waitforTimeout, true);
      });

      it('Then will clear filter results by clicking X button', () => {
        browser
          .waitForVisible(editBlueprintPage.btnClearFilter);

        // clear filters
        browser
          .click(editBlueprintPage.btnClearFilter);
        $('.cmpsr-list-pf__compacted').waitForText(90000);

        // the search tag and clear all link should disappear.
        browser
          .waitForExist(editBlueprintPage.linkClearAllFilters, config.config.waitforTimeout, true);
        browser
          .waitForExist(editBlueprintPage.btnClearFilter, config.config.waitforTimeout, true);
      });

      it('Then selected component icon should have border', () => {
        // select the first component in the filtered results
        browser
          .waitForVisible(editBlueprintPage.componentListItemRootElementSelect);

        // find the package in the list of filtered results
        $$(editBlueprintPage.availableComponentList).some((item) => {
          const title = item.$(editBlueprintPage.availableComponentName).getText();
          if (title === 'httpd') {
            const icon = item.$(editBlueprintPage.availableComponentIcon);
            let iconAttribute = icon.getAttribute('class');
            // httpd package should have a bordered icon because it's selected components
            assert.equal(iconAttribute, editBlueprintPage.borderedIconClassAttribute);

            // clicks - button to remove httpd from selected components
            item.$(editBlueprintPage.availableComponentMinusButton).click();

            // wait for + button after clicking - button
            item.$(editBlueprintPage.availableComponentPlusButton).waitForVisible();
            browser.pause(5000);
            // httpd package should have a normal icon because it's not a selected components
            iconAttribute = icon.getAttribute('class');
            assert.equal(iconAttribute, editBlueprintPage.normalIconClassAttribute);
          }
          return title === 'httpd';
        });
      });
    });
  });


  describe('When page is opened with uncommitted changes', () => {
    beforeEach(() => {
      CreateBlueprintPage.newBlueprint(testData.blueprint.simple, false);

      const blueprintsPage = new BlueprintsPage();
      const blueprintName = testData.blueprint.simple.name;
      const rowSelector = `${blueprintsPage.itemsBlueprint}[data-blueprint="${blueprintName}"]`;

      browser
        .waitForVisible(`${rowSelector} a[href*="edit"]`);

      browser
        .click(`${rowSelector} a[href*="edit"]`);
        // .waitForVisible(editBlueprintPage.);
      $('.cmpsr-list-pf__compacted').waitForText(90000);
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
