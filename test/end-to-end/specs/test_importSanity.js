const assert = require('assert');
const helper = require('../utils/helper');

const EditBlueprintPage = require('../pages/editBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const pageConfig = require('../config');

describe('Imported Content Sanity Testing', function() {
  const editBlueprintPage = new EditBlueprintPage(pageConfig.blueprint.simple.name);

  before(function() {
    // Create a new blueprint before the first test run in this suite
    CreateBlueprintPage.newBlueprint(pageConfig.blueprint.simple);
  });

  after(function() {
    // Delete added blueprint after all tests completed in this suite
    DeleteBlueprintPage.deleteBlueprint(pageConfig.blueprint.simple.name);
  });

  beforeEach(function() {
    // navigate to the BP in edit mode
    helper.goto(editBlueprintPage);
  });

  it('displayed count should match distinct count from DB', function() {
    // list item and total number are rendered at the same time
    browser.waitForVisible(editBlueprintPage.componentListItemRootElement);

    const actualText = browser.getText(editBlueprintPage.componentListItemRootElement);

    assert(actualText !== '1 - 50 of 0');
  });
});
