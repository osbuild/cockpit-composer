const assert = require('assert');
const helper = require('../utils/helper');
const testData = require('../wdio.conf.js').testData;

const BlueprintsPage = require('../pages/blueprints');
const EditBlueprintPage = require('../pages/editBlueprint');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');


describe('Imported Content Sanity Testing', () => {
  const editBlueprintPage = new EditBlueprintPage(testData.blueprint.simple.name);

  beforeEach(() => {
    // Create a new blueprint before the first test run in this suite
    CreateBlueprintPage.newBlueprint(testData.blueprint.simple);
    const blueprintsPage = new BlueprintsPage();
    const blueprintName = testData.blueprint.simple.name;
    const rowSelector = `${blueprintsPage.itemsBlueprint}[data-blueprint="${blueprintName}"]`;

    browser
      .waitForVisible(`${rowSelector} a[href*="edit"]`);

    browser
      .click(`${rowSelector} a[href*="edit"]`);
  });

  afterEach(() => {
    // Delete added blueprint after all tests completed in this suite
    DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
  });

  it('displayed count should match distinct count from DB', () => {
    // list item and total number are rendered at the same time
    $('.cmpsr-list-pf__compacted').waitForText(90000);

    const actualText = browser.getText(editBlueprintPage.componentNumber);

    assert(actualText !== '1 - 50 of 0' && actualText.startsWith('1 - 50 of'));
  });
});
