const Nightmare = require('nightmare');
const expect = require('chai').expect;
const EditRecipePage = require('../pages/editRecipe');
const CreateComposPage = require('../pages/createCompos');
const ToastNotifPage = require('../pages/toastNotif');
const ExportRecipePage = require('../pages/exportRecipe');
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

    context('Menu Nav Bar Check #acceptance', () => {
      it('should show a recipe name with a correct link address @edit-recipe-page', (done) => {
        // Highlight the expected result
        const expectedRecipeName = editRecipePage.recipeName;
        const expectedViewRecipeLinke = editRecipePage.varLinkToViewRec;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.linkRecipeName)
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
    context('Title Bar Check #acceptance', () => {
      it('should show a recipe name title @edit-recipe-page', (done) => {
        // Highlight the expected result
        const expected = editRecipePage.recipeName;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.labelRecipeTitle)
          .evaluate(page => document.querySelector(page.labelRecipeTitle).innerText
            , editRecipePage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
      it('should have Create Composition button @edit-recipe-page', (done) => {
        // Highlight the expected result
        const expected = editRecipePage.varCreateCompos;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.btnCreateCompos)
          .evaluate(page => document.querySelector(page.btnCreateCompos).innerText
            , editRecipePage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
    });
    context('Create Composition Test #acceptance', () => {
      const createComposPage = new CreateComposPage(pageConfig.composition.ostree
        , pageConfig.composition.x86_64);

      it('should pop up Create Composition window by clicking Create Compostion button @edit-recipe-page', (done) => {
        // Highlight the expected result
        const expected = createComposPage.varCreateCompos;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.btnCreateCompos)
          .click(editRecipePage.btnCreateCompos)
          .wait(createComposPage.labelCreateCompos)
          .evaluate(page => document.querySelector(page.labelCreateCompos).innerText
            , createComposPage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
      it('should have toast notification pop up when new composition added @edit-recipe-page', (done) => {
        const toastNotifPage = new ToastNotifPage(pageConfig.recipe.simple.name);

        // Highlight the expected result
        const expectedCreating = toastNotifPage.varStatusCreating;
        const expectedComplete = toastNotifPage.varStatusComplete;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.btnCreateCompos)
          .click(editRecipePage.btnCreateCompos)
          .wait(createComposPage.btnCreate)
          .select(createComposPage.selectComposType, createComposPage.composType)
          .select(createComposPage.selectComposArch, createComposPage.composArch)
          .click(createComposPage.btnCreate)
          .wait(toastNotifPage.iconCreating)
          .wait(toastNotifPage.labelStatus)
          .then(() => nightmare
            .evaluate(page => document.querySelector(page.labelStatus).innerText
            , toastNotifPage))
          .then((element) => {
            expect(element).to.equal(expectedCreating);
          })
          .then(() => nightmare
            .wait(toastNotifPage.iconComplete)
            .wait(toastNotifPage.labelStatus)
            .evaluate(page => document.querySelector(page.labelStatus).innerText
            , toastNotifPage)
            .end())
          .then((element) => {
            expect(element).to.equal(expectedComplete);
            done();
          });
      });
    });
    context('Save Recipe Test #acceptance', () => {
      it('should have toast notification pop up when Save button cliecked @edit-recipe-page', (done) => {
        const toastNotifPage = new ToastNotifPage(pageConfig.recipe.simple.name);

        // Highlight the expected result
        const expectedSaved = toastNotifPage.varStatusSaved;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(editRecipePage.btnSave)
          .click(editRecipePage.btnSave)
          .wait(toastNotifPage.iconComplete)
          .wait(toastNotifPage.labelStatus)
          .evaluate(page => document.querySelector(page.labelStatus).innerText
          , toastNotifPage)
          .end()
          .then((element) => {
            expect(element).to.equal(expectedSaved);
            done();
          });
      });
    });
    context('Export Recipe To Manifest Test #acceptance', () => {
      const exportRecipePage = new ExportRecipePage();

      // More action button
      const btnMoreAction = editRecipePage.btnMore;
      const menuActionExport = editRecipePage.menuActionExport;

      it('should pop up dropdown-menu by clicking ":" button', (done) => {
        // Highlight the expected result
        const expected = editRecipePage.moreActionList.Export;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .evaluate(element => document.querySelector(element).innerText
            , menuActionExport)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
      it('should pop up Export Recipe window by clicking "Export"', (done) => {
        // Highlight the expected result
        const expected = exportRecipePage.varExportTitle;

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .click(menuActionExport)
          .wait(exportRecipePage.labelExportTitle)
          .evaluate(page => document.querySelector(page.labelExportTitle).innerText
            , exportRecipePage)
          .end()
          .then((element) => {
            expect(element).to.equal(expected);
            done();
          });
      });
      it('should show the correct dependence packages and total numbers of dependencies', (done) => {
        // Convert package name into a string
        const packNames = `${pageConfig.recipe.simple.packages[0].name},${pageConfig.recipe.simple.packages[1].name}`;

        function callback(packs) {
          const depList = packs.map(pack => pack.dependencies.map(module => `${module.name}-${module.version}-${module.release}`));
          const depCompSet = new Set(depList.reduce((acc, val) => [...acc, ...val]));

          // Highlight the expected result
          const expectedNumber = `${[...depCompSet].length} ${exportRecipePage.varTotalComponents}`;
          const expectedContent = [...depCompSet].sort().join('\n');

          const nightmare = new Nightmare();
          nightmare
            .goto(editRecipePage.url)
            .wait(btnMoreAction)
            .click(btnMoreAction)
            .wait(menuActionExport)
            .click(menuActionExport)
            .wait(exportRecipePage.labelTotalComponents)
            .evaluate(page => document.querySelector(page.labelTotalComponents).innerText
              , exportRecipePage)
            .then((element) => {
              expect(element).to.equal(expectedNumber);
            })
            .then(() => nightmare
              .evaluate(page => document.querySelector(page.textAreaContent).value
                , exportRecipePage)
              .end())
            .then((element) => {
              expect(element).to.equal(expectedContent);
              done();
            });
        }

        apiCall.moduleInfo(packNames, callback, done);
      });
      it('should copy and paste correct components', (done) => {
        // expected result should be the content in textarea
        let expected = '';

        const nightmare = new Nightmare();
        nightmare
          .goto(editRecipePage.url)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .click(menuActionExport)
          .wait(exportRecipePage.textAreaContent)
          .evaluate(page => document.querySelector(page.textAreaContent).value
            , exportRecipePage)
          .then((element) => { expected = element; })
          .then(() => nightmare
            .wait(exportRecipePage.btnCopy)
            .wait(1000)
            .click(exportRecipePage.btnCopy)
            .evaluate(() => {
              // create div element for pasting into
              const pasteDiv = document.createElement('div');

              // place div outside the visible area
              pasteDiv.style.position = 'absolute';
              pasteDiv.style.left = '-10000px';
              pasteDiv.style.top = '-10000px';

              // set contentEditable mode
              pasteDiv.contentEditable = true;

              // find a good place to add the div to the document
              let insertionElement = document.activeElement;
              let nodeName = insertionElement.nodeName.toLowerCase();
              while (nodeName !== 'body' && nodeName !== 'div' && nodeName !== 'li' && nodeName !== 'th' && nodeName !== 'td') {
                insertionElement = insertionElement.parentNode;
                nodeName = insertionElement.nodeName.toLowerCase();
              }

              // add element to document
              insertionElement.appendChild(pasteDiv);

              // paste the current clipboard text into the element
              pasteDiv.focus();
              document.execCommand('paste');

              // get the pasted text from the div
              const clipboardText = pasteDiv.innerText;

              // remove the temporary element
              insertionElement.removeChild(pasteDiv);

              // return the text
              return clipboardText;
            })
            .end())
          .then((element) => {
            // remove the last "\n" from paste result with trim()
            expect(element.trim()).to.equal(expected);
            done();
          });
      });
    });
  });
});
