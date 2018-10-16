const assert = require('assert');
const faker = require('faker');

const ViewBlueprintPage = require('../pages/viewBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const CreateImagePage = require('../pages/createImage');
const ToastNotifPage = require('../pages/toastNotif');
const ExportBlueprintPage = require('../pages/exportBlueprint');
const BlueprintPage = require('../pages/blueprints');

const helper = require('../utils/helper');
const testData = require('../wdio.conf.js').testData;

describe('Create Blueprint Image', () => {
  // Array of image types and architechtures
  const images = testData.image;
  const viewBlueprintPage = new ViewBlueprintPage(testData.blueprint.simple.name);

  beforeEach(() => {
    CreateBlueprintPage.newBlueprint(testData.blueprint.simple);

    browser
      .click(BlueprintPage.blueprintNameSelector(testData.blueprint.simple.name))
      .waitForVisible(viewBlueprintPage.imagesTabElement);

    // go to the Images tab
    browser
      .click(viewBlueprintPage.imagesTabElement);

    // wait for the Create Image button to become enabled
    browser
      .waitForVisible(viewBlueprintPage.btnCreateImage);
  });

  afterEach(() => {
    DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
  });

  describe('Create Image Tests', () => {
    const createImagePage = new CreateImagePage(images[0].type, images[0].label, images[0].arch);

    it('should pop up Create Image window by clicking Create Image button', () => {
      browser
        .click(viewBlueprintPage.btnCreateImage)
        .waitForVisible(createImagePage.dialogRootElement);

      const actualText = $(createImagePage.labelCreateImage).getText();
      assert.equal(actualText, createImagePage.varCreateImage);
    });

    images.forEach((image) => {
      it(`should build image ${image.type}/${image.arch}`, () => {
        const createImagePage2 = new CreateImagePage(image.type, image.label, image.arch);
        const toastNotifPage = new ToastNotifPage(testData.blueprint.simple.name);

        browser
          .click(viewBlueprintPage.btnCreateImage)
          .waitForVisible(createImagePage2.dialogRootElement);

        browser
          .waitForVisible(createImagePage2.selectImageType);

        browser
          .selectByVisibleText(createImagePage2.selectImageType, createImagePage2.imageTypeLabel)
          .selectByVisibleText(createImagePage2.selectImageArch, createImagePage2.imageArch)
          .click(createImagePage2.btnCreate)
          .waitForVisible(toastNotifPage.iconCreating);

        // validate toast notification, where first status is Creating
        const textCreating = $(toastNotifPage.labelStatus).getText();
        assert.equal(textCreating, toastNotifPage.varStatusCreating);

        // wait until image type appears in the list of composes
        // and status is Pending
        browser
          .waitUntil(() => {
            const tabText = browser.getText('.tab-container').toString();
            return tabText.includes(createImagePage2.imageType) && tabText.includes('Pending');
          });

        // then wait until status is Complete
        browser
          .waitUntil(() => {
            const tabText = browser.getText('.tab-container').toString();
            return tabText.includes(createImagePage2.imageType) && tabText.includes('Complete');
          });

        // download button appears
        browser
          .waitForVisible('a.btn-default[download=""]');

        // note: not trying to download b/c validating that a confirmation window
        // has been shown or file download is complete proves to be too much for
        // wdio!

        // delete the image so that selectors above will only return a single
        // element on the next iteration
        browser
          .waitForVisible('.list-pf-actions #dropdownKebabRight');

        browser
          .click('.list-pf-actions #dropdownKebabRight')
          .waitForVisible('ul[aria-labelledby="dropdownKebabRight"] li:nth-child(1) a');

        browser
          .click('ul[aria-labelledby="dropdownKebabRight"] li:nth-child(1) a')
          .waitForVisible('.btn-danger[data-dismiss="modal"]');

        browser
          .click('.btn-danger[data-dismiss="modal"]');
      });
    }); // images.forEach
  });
});
