const Nightmare = require('nightmare');
const RecipesPage = require('../pages/recipes');
const CreateRecipePage = require('../pages/createRecipe');
const EditRecipePage = require('../pages/editRecipe');
const apiCall = require('../utils/apiCall');
const pageConfig = require('../config');

describe('Create Recipe Page', () => {
  // Set case running timeout
  const timeout = 15000;

  // Check BDCS API and Web service first
  beforeAll((done) => {
    apiCall.serviceCheck(done);
  });

  const recipesPage = new RecipesPage();
  const createRecipePage = new CreateRecipePage(pageConfig.recipe.simple.name
    , pageConfig.recipe.simple.description);

  describe('Input Data Validation Test', () => {
    describe('Required Field Missing #acceptance', () => {
      test('should show alert message when create recipe without name @create-recipe-page', (done) => {
        // Highlight the expected result
        const expected = createRecipePage.varAlertMissingInfo;

        const nightmare = new Nightmare();
        nightmare
          .goto(recipesPage.url)
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createRecipePage)
          .insert(createRecipePage.inputName, createRecipePage.varEmptyName)
          .wait(createRecipePage.btnSave)
          .click(createRecipePage.btnSave)
          .wait(createRecipePage.labelAlertInfo)
          .evaluate(page => document.querySelector(page.labelAlertInfo).innerText
            , createRecipePage)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
    });
    describe('Duplicate Recipe Name #acceptance', () => {
      beforeAll((done) => {
        apiCall.newRecipe(pageConfig.recipe.simple, done);
      });

      afterAll((done) => {
        apiCall.deleteRecipe(pageConfig.recipe.simple.name, done);
      });

      test('should show alert message when create recipe with a duplicate name @create-recipe-page', (done) => {
        // Highlight the expected result
        const expected = createRecipePage.varAlertDuplicateInfo;

        const nightmare = new Nightmare();
        nightmare
          .goto(recipesPage.url)
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createRecipePage)
          .type(createRecipePage.inputName, pageConfig.recipe.simple.name)
          .wait((page, name) => document.querySelector(page.inputName).value === name
            , createRecipePage, pageConfig.recipe.simple.name)
          .wait(createRecipePage.btnSave)
          .click(createRecipePage.btnSave)
          .wait(createRecipePage.labelAlertInfo)
          .evaluate(page => document.querySelector(page.labelAlertInfo).innerText
            , createRecipePage)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
    });
    describe('Simple Valid Input Test #acceptance', () => {
      const editRecipePage = new EditRecipePage(pageConfig.recipe.simple.name);

      // Delete created recipe after each creation case
      afterEach((done) => {
        apiCall.deleteRecipe(editRecipePage.recipeName, done);
      });

      test('should switch to Edit Recipe page - recipe creation success @create-recipe-page', (done) => {
        // Highlight the expected result

        const nightmare = new Nightmare();
        nightmare
          .goto(recipesPage.url)
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createRecipePage)
          .insert(createRecipePage.inputName, createRecipePage.varRecName)
          .insert(createRecipePage.inputDescription, createRecipePage.varRecDesc)
          .click(createRecipePage.btnSave)
          .wait(editRecipePage.componentListItemRootElement)
          .exists(editRecipePage.componentListItemRootElement)
          .end()
          .then((element) => {
            expect(element).toBe(true); // eslint-disable-line no-unused-expressions
            done();
          });
      }, timeout);
    });
  });
});
