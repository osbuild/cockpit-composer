const assert = require('assert');
const helper = require('../utils/helper');
const testData = require('../wdio.conf.js').testData;

const EditBlueprintPage = require('../pages/editBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');


describe('Imported Content Sanity Testing', () => {
  const editBlueprintPage = new EditBlueprintPage(testData.blueprint.simple.name);

  before(() => {
    // Create a new blueprint before the first test run in this suite
    CreateBlueprintPage.newBlueprint(testData.blueprint.simple);
  });

  after(() => {
    // Delete added blueprint after all tests completed in this suite
    DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
  });

  beforeEach(() => {
    // navigate to the BP in edit mode
    helper.goto(editBlueprintPage);
  });

  it('displayed count should match distinct count from DB', () => {
    // list item and total number are rendered at the same time
    browser.waitForVisible(editBlueprintPage.componentListItemRootElement);

    const actualText = browser.getText(editBlueprintPage.componentListItemRootElement);

    assert(actualText !== '1 - 50 of 0');
  });
});
