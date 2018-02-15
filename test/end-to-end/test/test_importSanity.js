const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const EditBlueprintPage = require('../pages/editBlueprint');
const apiCall = require('../utils/apiCall');
const pageConfig = require('../config');
const helper = require('../utils/helper');
const coverage = require('../utils/coverage.js').coverage;

describe('Imported Content Sanity Testing', () => {
  let nightmare;
  // Set case running timeout
  const timeout = 15000;

  // Check BDCS API and Web service first
  beforeAll(apiCall.serviceCheck);

  beforeAll((done) => {
    // Create a new blueprint before the first test run in this suite
    apiCall.newBlueprint(pageConfig.blueprint.simple, done);
  });

  afterAll((done) => {
    // Delete added blueprint after all tests completed in this suite
    apiCall.deleteBlueprint(pageConfig.blueprint.simple.name, done);
  });

  const editBlueprintPage = new EditBlueprintPage(pageConfig.blueprint.simple.name);

  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(pageConfig.nightmareTimeout), editBlueprintPage);
  });

  const testSpec1 = test('displayed count should match distinct count from DB',
  (done) => {
    function callback(totalNumbers) {
      const expectedText = `1 - 50 of ${totalNumbers}`;
      nightmare
        .wait(editBlueprintPage.componentListItemRootElement) // list item and total number are rendered at the same time
        .evaluate(page => document.querySelector(page.totalComponentCount).innerText, editBlueprintPage)
        .then((element) => {
          expect(element).toBe(expectedText);

          coverage(nightmare, done);
        })
        .catch((error) => {
          helper.gotoError(error, nightmare, testSpec1);
        });
    }
    apiCall.moduleListTotalPackages(callback, done);
  }, timeout);
});
