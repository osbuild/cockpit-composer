const Nightmare = require('nightmare');
const expect = require('chai').expect;
const EditRecipePage = require('../pages/editRecipe');
const CreateComposPage = require('../pages/createCompos');
const ToastNotifPage = require('../pages/toastNotif');
const apiCall = require('../utils/apiCall');
const pageConfig = require('../config');

describe('Edit Recipe Page', function () {
  this.timeout(15000);

  // Check BDCS API and Web service first
  before((done) => {
    apiCall.serviceCheck(done);
  });

  describe('Single Word Recipe Name Scenario', () => {
    const editRecipePage = new EditRecipePage(pageConfig.recipe.simple.name);

    // Create a new recipe before the first test run in this suite
    before((done) => {
      apiCall.newRecipe(pageConfig.recipe.simple, done);
    });

    // Delete added recipe after all tests completed in this sute
    after((done) => {
      apiCall.deleteRecipe(pageConfig.recipe.simple.name, done);
    });

    context('Menu Nav Bar Check', () => {
      it('should show a recipe name with a correct link address', (done) => {
        // Highlight the expected result
        const expectedRecipeName = editRecipePage.recipeName;
        const expectedViewRecipeLinke = editRecipePage.varLinkToViewRec;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.labelEditRecipe)
          .then(() => nightmare
            .evaluate(page => document.querySelector(page.linkRecipeName).innerText
              , editRecipePage))
          .then((element) => {
            expect(element).to.equal(expectedRecipeName);
          })
          .then(() => nightmare
            .evaluate(page => document.querySelector(page.linkRecipeName).href
              , editRecipePage)
            .end())
          .then((element) => {
            expect(element).to.equal(expectedViewRecipeLinke);
            done();
          });
      });
    });
    context('Title Bar Check', () => {
      it('should show a recipe name title', (done) => {
        // Highlight the expected result
        const expected = editRecipePage.recipeName;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.labelEditRecipe)
          .evaluate(page => document.querySelector(page.labelRecipeTitle).innerText
            , editRecipePage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
      it('should have Create Composition button', (done) => {
        // Highlight the expected result
        const expected = editRecipePage.varCreateCompos;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.labelEditRecipe)
          .evaluate(page => document.querySelector(page.btnCreateCompos).innerText
            , editRecipePage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
    });
    context('Create Composition Test', () => {
      const createComposPage = new CreateComposPage(pageConfig.composition.type
        , pageConfig.composition.arch);

      it('should pop up Create Composition window by clicking Create Compostion button', (done) => {
        // Highlight the expected result
        const expected = createComposPage.varCreateCompos;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .click(editRecipePage.btnCreateCompos)
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
          .goto(editRecipePage.url)
          .click(editRecipePage.btnCreateCompos)
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
