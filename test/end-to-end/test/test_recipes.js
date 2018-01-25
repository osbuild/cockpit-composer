const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const RecipesPage = require('../pages/recipes');
const CreateRecipePage = require('../pages/createRecipe');
const CreateComposPage = require('../pages/createCompos');
const ToastNotifPage = require('../pages/toastNotif');
const ExportRecipePage = require('../pages/exportRecipe');
const apiCall = require('../utils/apiCall');
const helper = require('../utils/helper');
const pageConfig = require('../config');
const fs = require('fs');
const coverage = require('../utils/coverage.js').coverage;

describe('Recipes Page', () => {
  let nightmare;
  // Set case running timeout
  // Some of cases need more time to complete their jobs
  // Such as Create Composition. The time totally depends on component what the recipe includes
  const timeoutCreateComposition = 15000;

  // Check BDCS API and Web service first
  beforeAll(apiCall.serviceCheck);

  const recipesPage = new RecipesPage();

  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(pageConfig.nightmareTimeout), recipesPage);
  });

  describe('Page Info Check', () => {
    describe('Title Check', () => {
      const testSpec1 = test('should be Recipes',
      (done) => {
        // Highlight the expected result
        const expected = recipesPage.title;

        nightmare
          .title()
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec1);
          });
      });
    });
  });

  describe('Tool Bar', () => {
    describe('Create Recipe Test', () => {
      const testSpec2 = test('should have the Create Recipe button on the Recipes page',
      (done) => {
        // Highlight the expected result
        const expected = recipesPage.varCreateRecipe;

        nightmare
          .wait(recipesPage.btnCreateRecipe)
          .evaluate(page => document.querySelector(page.btnCreateRecipe).innerText
            , recipesPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec2);
          });
      });
      const testSpec3 = test('should pop up Create Recipe window when click Create Recipe button',
      (done) => {
        const createRecipePage = new CreateRecipePage(pageConfig.recipe.simple.name
          , pageConfig.recipe.simple.description);

        // Highlight the expected result
        const expected = createRecipePage.varCreateRecipe;

        nightmare
          .wait(recipesPage.btnCreateRecipe)
          .click(recipesPage.btnCreateRecipe)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createRecipePage)
          .wait(createRecipePage.labelCreateRecipe)
          .evaluate(page => document.querySelector(page.labelCreateRecipe).innerText
            , createRecipePage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec3);
          });
      });
    });
  });

  describe('Recipe List', () => {
    describe('Single Word Recipe Name Scenario', () => {
      // Array of composition types and architechtures
      const compositions = pageConfig.composition;

      // Create a new recipe before the first test run in this suite
      beforeAll((done) => {
        apiCall.newRecipe(pageConfig.recipe.simple, done);
      });

      // Delete added recipe after all tests completed in this sute
      afterAll((done) => {
        apiCall.deleteRecipe(pageConfig.recipe.simple.name, done);
      });

      describe('Recipe Content Check', () => {
        const testSpec4 = test('should have correct recipe name on list after new recipe added',
        (done) => {
          // Highlight the expected result
          const expected = pageConfig.recipe.simple.name;

          const recipeNameSelector = RecipesPage.recipeNameSelector(expected);

          nightmare
            .wait(recipeNameSelector)
            .evaluate(selector => document.querySelector(selector).innerText
              , recipeNameSelector)
            .then((element) => {
              expect(element).toBe(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec4);
            });
        });
        const testSpec5 = test('should have correct recipe description on list after new recipe added',
        (done) => {
          // Highlight the expected result
          const expected = pageConfig.recipe.simple.description;

          nightmare
            .wait((page, descr) => Array.prototype.slice
                                     .call(document.querySelectorAll(page.labelRecipeDescr))
                                     .map(x => x.innerText)
                                     .includes(descr)
              , recipesPage, expected)
            .evaluate(page => Array.prototype.slice.call(document.querySelectorAll(page.labelRecipeDescr)).map(x => x.innerText)
              , recipesPage)
            .then((element) => {
              expect(element).toContain(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec5);
            });
        });
      });

      compositions.forEach((composition) => {
        describe(`Create Composition Test For ${composition.type}`, () => {
          const createComposPage = new CreateComposPage(composition.type
            , composition.arch);

          // Create Composition button selector
          const btnCreateCompos = RecipesPage.btnCreateCompos(pageConfig.recipe.simple.name);

          const testSpec6 = test('should pop up Create Composition window by clicking Create Compostion button',
          (done) => {
            // Highlight the expected result
            const expected = createComposPage.varCreateCompos;

            nightmare
              .wait(btnCreateCompos)
              .click(btnCreateCompos)
              .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
                , createComposPage)
              .wait(createComposPage.labelCreateCompos)
              .evaluate(page => document.querySelector(page.labelCreateCompos).innerText
                , createComposPage)
              .then((element) => {
                expect(element).toBe(expected);

                coverage(nightmare, done);
              })
              .catch((error) => {
                helper.gotoError(error, nightmare, testSpec6);
              });
          });
          const testSpec7 = test('should have toast notification pop up when new composition added',
          (done) => {
            const toastNotifPage = new ToastNotifPage(pageConfig.recipe.simple.name);

            // Highlight the expected result
            const expectedCreating = toastNotifPage.varStatusCreating;
            const expectedComplete = toastNotifPage.varStatusComplete;

            nightmare
              .wait(btnCreateCompos)
              .click(btnCreateCompos)
              .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
                , createComposPage)
              .select(createComposPage.selectComposType, createComposPage.composType)
              .select(createComposPage.selectComposArch, createComposPage.composArch)
              .click(createComposPage.btnCreate)
              .wait(toastNotifPage.iconCreating)
              .wait((page) => {
                const recipeName = document.querySelector(page.labelRecipeName).innerText;
                return recipeName !== page.varEmptyName && recipeName.includes(page.varEmptyName);
              }, toastNotifPage)
              .then(() => nightmare
                .evaluate(page => document.querySelector(page.labelStatus).innerText
                , toastNotifPage))
              .then((element) => {
                expect(element).toBe(expectedCreating);
              })
              .then(() => nightmare
                .wait(toastNotifPage.iconComplete)
                .wait((page) => {
                  const recipeName = document.querySelector(page.labelRecipeName).innerText;
                  return recipeName !== page.varEmptyName && recipeName.includes(page.varEmptyName);
                }, toastNotifPage)
                .evaluate(page => document.querySelector(page.labelStatus).innerText
                , toastNotifPage))
              .then((element) => {
                expect(element).toBe(expectedComplete);

                coverage(nightmare, done);
              })
              .catch((error) => {
                helper.gotoError(error, nightmare, testSpec7);
              });
          }, timeoutCreateComposition);
        });
      });
      describe('Export Recipe To Manifest Test', () => {
        const exportRecipePage = new ExportRecipePage();

        // More action button
        const btnMoreAction = RecipesPage.btnMore(pageConfig.recipe.simple.name);
        const menuActionExport = RecipesPage.menuActionExport(pageConfig.recipe.simple.name);

        const testSpec8 = test('should pop up dropdown-menu by clicking ":" button',
        (done) => {
          // Highlight the expected result
          const expected = recipesPage.moreActionList.Export;

          nightmare
            .wait(btnMoreAction)
            .click(btnMoreAction)
            .wait(menuActionExport)
            .evaluate(element => document.querySelector(element).innerText
              , menuActionExport)
            .then((element) => {
              expect(element).toBe(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec8);
            });
        });
        const testSpec9 = test('should pop up Export Recipe window by clicking "Export"',
        (done) => {
          // Highlight the expected result
          const expected = exportRecipePage.varExportTitle;

          nightmare
            .wait(btnMoreAction)
            .click(btnMoreAction)
            .wait(menuActionExport)
            .click(menuActionExport)
            .wait(page => document.querySelector(page.rootElement).style.display === 'block'
              , exportRecipePage)
            .wait(exportRecipePage.labelExportTitle)
            .evaluate(page => document.querySelector(page.labelExportTitle).innerText
              , exportRecipePage)
            .then((element) => {
              expect(element).toBe(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec9);
            });
        });
        const testSpec10 = test('should show the correct dependence packages and total numbers of dependencies',
        (done) => {
          // Convert package name into a string
          const packNames = `${pageConfig.recipe.simple.packages[0].name}`;

          function callback(packs) {
            const depList = packs.map(
              pack => pack.dependencies.map(module => `${module.name}-${module.version}-${module.release}`));
            const depCompSet = new Set(depList.reduce((acc, val) => [...acc, ...val]));

            // Highlight the expected result
            const expectedNumber = `${[...depCompSet].length} ${exportRecipePage.varTotalComponents}`;
            const zeroComponent = exportRecipePage.varEmptyTotalComponents;
            const expectedContent = [...depCompSet].sort().join('\n');

            nightmare
              .wait(btnMoreAction)
              .click(btnMoreAction)
              .wait(menuActionExport)
              .click(menuActionExport)
              .wait(page => document.querySelector(page.rootElement).style.display === 'block'
                , exportRecipePage)
              .wait(exportRecipePage.labelTotalComponents)
              .wait((page, zero) => document.querySelector(page.labelTotalComponents).innerText !== zero
                , exportRecipePage, zeroComponent)
              .evaluate(page => document.querySelector(page.labelTotalComponents).innerText
                , exportRecipePage)
              .then((element) => {
                expect(element).toBe(expectedNumber);
              })
              .then(() => nightmare
                .evaluate(page => document.querySelector(page.textAreaContent).value
                  , exportRecipePage))
              .then((element) => {
                expect(element).not.toBeFalsy();
                expect(element).toBe(expectedContent);

                coverage(nightmare, done);
              })
              .catch((error) => {
                helper.gotoError(error, nightmare, testSpec10);
              });
          }

          apiCall.moduleInfo(packNames, callback, done);
        });
        const testSpec11 = test('should copy and paste correct components',
        (done) => {
          // expected result should be the content in textarea
          let expected = '';

          nightmare
            .wait(btnMoreAction)
            .click(btnMoreAction)
            .wait(menuActionExport)
            .click(menuActionExport)
            .wait(page => document.querySelector(page.rootElement).style.display === 'block'
              , exportRecipePage)
            .wait(exportRecipePage.textAreaContent)
            .evaluate(page => document.querySelector(page.textAreaContent).value
              , exportRecipePage)
            .then((element) => { expected = element; })
            .then(() => nightmare
              .wait(exportRecipePage.btnCopy)
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
              }))
            .then((element) => {
              // remove the last "\n" from paste result with trim()
              expect(element.trim()).toBe(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec11);
            });
        });
      });
    });
  });
});
