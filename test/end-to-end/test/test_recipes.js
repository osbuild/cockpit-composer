const Nightmare = require('nightmare');
const expect = require('chai').expect;
const RecipesPage = require('../pages/recipes');
const CreateRecipePage = require('../pages/createRecipe');
const CreateComposPage = require('../pages/createCompos');
const ToastNotifPage = require('../pages/toastNotif');
const apiCall = require('../utils/apiCall');
const pageConfig = require('../config');

describe('Recipes Page', function () {
  this.timeout(15000);

  // Check BDCS API and Web service first
  before((done) => {
    apiCall.serviceCheck(done);
  });

  const recipesPage = new RecipesPage();

  describe('Title Check', () => {
    it('should be Recipes', (done) => {
      // Highlight the expected result
      const expected = recipesPage.title;

      const nightmare = new Nightmare();
      nightmare
        .goto(recipesPage.url)
        .title()
        .end()
        .then((element) => {
          expect(element).to.equal(expected);
          done();
        });
    });
  });

  describe('Tool Bar', () => {
    context('Create Recipe Test', () => {
      it('should have the Create Recipe button on the Recipes page', (done) => {
        // Highlight the expected result
        const expected = recipesPage.varCreateRecipe;

        const nightmare = new Nightmare();
        nightmare
          .goto(recipesPage.url)
          // .wait('.container-pf-nav-pf-vertical')
          .evaluate(page => document.querySelector(page.btnCreateRecipe).innerText
            , recipesPage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
      it('should pop up Create Recipe window when click Create Recipe button', (done) => {
        const createRecipePage = new CreateRecipePage(pageConfig.recipe.simple.name
          , pageConfig.recipe.simple.description);

        // Highlight the expected result
        const expected = createRecipePage.varCreateRecipe;

        const nightmare = new Nightmare();
        nightmare
          .goto(recipesPage.url)
          .click(recipesPage.btnCreateRecipe)
          // .wait(createRecipePage.labelCreateRecipe)
          .evaluate(page => document.querySelector(page.labelCreateRecipe).innerText
            , createRecipePage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
    });
  });

  describe('Recipe List', () => {
    describe('Single Word Recipe Name Scenario', () => {
      // Create a new recipe before the first test run in this suite
      before((done) => {
        apiCall.newRecipe(pageConfig.recipe.simple, done);
      });

      // Delete added recipe after all tests completed in this sute
      after((done) => {
        apiCall.deleteRecipe(pageConfig.recipe.simple.name, done);
      });

      context('Recipe Content Check', () => {
        it('should have correct recipe name on list after new recipe added', (done) => {
          // Highlight the expected result
          const expected = pageConfig.recipe.simple.name;

          const recipeNameSelector = RecipesPage.recipeNameSelector(expected);

          const nightmare = new Nightmare();
          nightmare
            .goto(recipesPage.url)
            .evaluate(selector => document.querySelector(selector).innerText
              , recipeNameSelector)
            .end()
            .then((element) => {
              expect(element).to.equal(expected);
              done();
            });
        });
        it('should have correct recipe description on list after new recipe added', (done) => {
          new Nightmare()
          .goto(recipesPage.url)
          .evaluate(page => [...document.querySelectorAll(page.labelRecipeDescr)]
            .map(x => x.innerText), recipesPage)
          .end()
          .then((element) => {
            expect(element).to.include(pageConfig.recipe.simple.description);
            done();
          });
        });
      });

      context('Create Composition Test', () => {
        const createComposPage = new CreateComposPage(pageConfig.composition.type
          , pageConfig.composition.arch);

        // Create Composition button selector
        const btnCreateCompos = RecipesPage.btnCreateCompos(pageConfig.recipe.simple.name);

        it('should pop up Create Composition window by clicking Create Compostion button'
        , (done) => {
          // Highlight the expected result
          const expected = createComposPage.varCreateCompos;

          const nightmare = new Nightmare();
          nightmare
            .goto(recipesPage.url)
            .click(btnCreateCompos)
            .evaluate(page => document.querySelector(page.labelCreateCompos).innerText
              , createComposPage)
            .end()
            .then((element) => {
              expect(element).to.equal(expected);
              done();
            });
        });
        it('should have toast notification pop up when new composition added', (done) => {
          const toastNotifPage = new ToastNotifPage(pageConfig.recipe.simple.name);

          // Highlight the expected result
          const expectedCreating = toastNotifPage.varStatusCreating;
          const expectedComplete = toastNotifPage.varStatusComplete;

          const nightmare = new Nightmare();
          nightmare
            .goto(recipesPage.url)
            .click(btnCreateCompos)
            .select(createComposPage.selectComposType, createComposPage.composType)
            .select(createComposPage.selectComposArch, createComposPage.composArch)
            .click(createComposPage.btnCreate)
            .wait(toastNotifPage.iconCreating)
            .then(() => nightmare
              .evaluate(page => document.querySelector(page.labelStatus).innerText
              , toastNotifPage))
            .then((element) => {
              expect(element).to.equal(expectedCreating);
            })
            .then(() => nightmare
              .wait(toastNotifPage.iconComplete)
              .evaluate(page => document.querySelector(page.labelStatus).innerText
              , toastNotifPage)
              .end())
            .then((element) => {
              expect(element).to.equal(expectedComplete);
              done();
            });
        });
      });
    });
  });
});
