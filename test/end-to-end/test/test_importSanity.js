const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const EditRecipePage = require('../pages/editRecipe');
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
    // Create a new recipe before the first test run in this suite
    apiCall.newRecipe(pageConfig.recipe.simple, done);
  });

  afterAll((done) => {
    // Delete added recipe after all tests completed in this suite
    apiCall.deleteRecipe(pageConfig.recipe.simple.name, done);
  });

  const editRecipePage = new EditRecipePage(pageConfig.recipe.simple.name);

  // Switch to welder-web iframe if welder-web is integrated with Cockpit.
  // Cockpit web service is listening on TCP port 9090.
  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(), editRecipePage);
  });

  test('displayed count should match distinct count from DB', (done) => {
    function callback(totalNumbers) {
      const expectedText = `1 - 50 of ${totalNumbers}`;
      nightmare
        .wait(editRecipePage.componentListItemRootElement) // list item and total number are rendered at the same time
        .evaluate(page => document.querySelector(page.totalComponentCount).innerText, editRecipePage)
        .then((element) => {
          expect(element).toBe(expectedText);

          coverage(nightmare, done);
        });
    }
    apiCall.moduleListTotalPackages(callback, done);
  }, timeout);
});
