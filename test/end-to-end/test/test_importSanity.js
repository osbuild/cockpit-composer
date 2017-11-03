const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const EditRecipePage = require('../pages/editRecipe');
const apiCall = require('../utils/apiCall');
const pageConfig = require('../config');
const helper = require('../utils/helper');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const coverage = require('../utils/coverage.js').coverage;

describe('Imported Content Sanity Testing', () => {
  let nightmare;
  // Set case running timeout
  const timeout = 15000;

  let db;

  beforeAll((done) => {
    // Check exist of metadata.db file first
    fs.access(process.env.MDDB || 'metadata.db', (error) => {
      if (error) return done(error);
      db = new sqlite3.Database(process.env.MDDB || 'metadata.db');
      return done();
    });
  });

  beforeAll((done) => {
    // Check BDCS API and Web service first
    apiCall.serviceCheck(done);
  });

  beforeAll((done) => {
    // Create a new recipe before the first test run in this suite
    apiCall.newRecipe(pageConfig.recipe.simple, done);
  });

  afterAll((done) => {
    // Delete added recipe after all tests completed in this suite
    apiCall.deleteRecipe(pageConfig.recipe.simple.name, done);
    // Close connection with sqlite db
    db.close();
  });

  const editRecipePage = new EditRecipePage(pageConfig.recipe.simple.name);

  // Switch to welder-web iframe if welder-web is integrated with Cockpit.
  // Cockpit web service is listening on TCP port 9090.
  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(), editRecipePage);
  });

  test('displayed count should match distinct count from DB', (done) => {
    db.each('SELECT name, COUNT(DISTINCT name) AS total_count FROM groups', (err, row) => {
      const expectedText = `1 - 50 of ${row.total_count}`;

      nightmare
        .wait(editRecipePage.componentListItemRootElement) // list item and total number are rendered at the same time
        .evaluate(page => document.querySelector(page.totalComponentCount).innerText, editRecipePage)
        .then((element) => {
          expect(element).toBe(expectedText);

          // note eval() can't be called from within another function
          coverage(nightmare, done);
        });
    });
  }, timeout);
});
