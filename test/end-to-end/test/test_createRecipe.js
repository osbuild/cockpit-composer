const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const RecipesPage = require('../pages/recipes');
const CreateRecipePage = require('../pages/createRecipe');
const EditRecipePage = require('../pages/editRecipe');
const apiCall = require('../utils/apiCall');
const helper = require('../utils/helper');
const pageConfig = require('../config');
const fs = require('fs');
const coverage = require('../utils/coverage.js').coverage;


describe('Create Recipe Page', () => {
  let nightmare;
  // Set case running timeout
  const timeout = 15000;

  // Check BDCS API and Web service first
  beforeAll(apiCall.serviceCheck);

  const recipesPage = new RecipesPage();
  const createRecipePage = new CreateRecipePage(pageConfig.recipe.simple.name
    , pageConfig.recipe.simple.description);

  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(pageConfig.nightmareTimeout), recipesPage);
  });

  describe('Input Data Validation Test', () => {
    describe('Required Field Missing', () => {
      const testSpec1 = test('should show alert message by clicking Save button when create recipe without name',
      (done) => {
        // Highlight the expected result
        const expectedAlertInfo = createRecipePage.varAlertInfo;
        const expectedHelpBlockMsg = createRecipePage.varHelpBlockMsg;

        nightmare
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.activeElement.id === page.inputNameEleId
            , createRecipePage)
          .wait(createRecipePage.btnSave)
          .click(createRecipePage.btnSave)
          .wait(createRecipePage.labelAlertInfo)
          .evaluate(page => document.querySelector(page.labelAlertInfo).innerText
            , createRecipePage)
          .then((element) => {
            expect(element).toBe(expectedAlertInfo);
          })
          .then(() => nightmare
            .wait(createRecipePage.spanHelpBlockMsg)
            .evaluate(page => document.querySelector(page.spanHelpBlockMsg).innerText
              , createRecipePage))
          .then((element) => {
            expect(element).toBe(expectedHelpBlockMsg);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec1);
          });
      }, timeout);
      const testSpec2 = test('should show alert message by clicking Enter key when create recipe without name',
      (done) => {
        // Highlight the expected result
        const expectedAlertInfo = createRecipePage.varAlertInfo;
        const expectedHelpBlockMsg = createRecipePage.varHelpBlockMsg;

        nightmare
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.activeElement.id === page.inputNameEleId
            , createRecipePage)
          .wait(createRecipePage.btnSave)
          .type('body', '\u000d')
          .wait(createRecipePage.labelAlertInfo)
          .evaluate(page => document.querySelector(page.labelAlertInfo).innerText
            , createRecipePage)
          .then((element) => {
            expect(element).toBe(expectedAlertInfo);
          })
          .then(() => nightmare
            .wait(createRecipePage.spanHelpBlockMsg)
            .evaluate(page => document.querySelector(page.spanHelpBlockMsg).innerText
              , createRecipePage))
          .then((element) => {
            expect(element).toBe(expectedHelpBlockMsg);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec2);
          });
      }, timeout);
      const testSpec3 = test('should show alert message by changing focus to description input',
      (done) => {
        // Highlight the expected result
        const expected = createRecipePage.varHelpBlockMsg;

        nightmare
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.activeElement.id === page.inputNameEleId
            , createRecipePage)
          .evaluate(page => document.querySelector(page.inputDescription).focus()
            , createRecipePage)
          .wait(createRecipePage.spanHelpBlockMsg)
          .evaluate(page => document.querySelector(page.spanHelpBlockMsg).innerText
            , createRecipePage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec3);
          });
      }, timeout);
    });
    describe('Simple Valid Input Test', () => {
      const editRecipePage = new EditRecipePage(pageConfig.recipe.simple.name);

      // Delete created recipe after each creation case
      afterEach((done) => {
        apiCall.deleteRecipe(editRecipePage.recipeName, done);
      });

      const testSpec4 = test('should switch to Edit Recipe page - recipe creation success',
      (done) => {
        nightmare
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createRecipePage)
          .insert(createRecipePage.inputName, createRecipePage.varRecName)
          .insert(createRecipePage.inputDescription, createRecipePage.varRecDesc)
          .click(createRecipePage.btnSave)
          .wait(editRecipePage.componentListItemRootElement)
          .exists(editRecipePage.componentListItemRootElement)
          .then((element) => {
            expect(element).toBe(true);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec4);
          });
      }, timeout);
    });
  });
});
