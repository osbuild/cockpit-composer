const Nightmare = require('nightmare');
const ViewRecipePage = require('../pages/viewRecipe');
const CreateComposPage = require('../pages/createCompos');
const ToastNotifPage = require('../pages/toastNotif');
const ExportRecipePage = require('../pages/exportRecipe');
const apiCall = require('../utils/apiCall');
const pageConfig = require('../config');

describe('View Recipe Page', () => {
  // Set case running timeout
  const timeout = 15000;

  // Check BDCS API and Web service first
  beforeAll((done) => {
    apiCall.serviceCheck(done);
  });

  describe('Single Word Recipe Name Scenario', () => {
    // Array of composition types and architechtures
    const compositions = pageConfig.composition;

    const viewRecipePage = new ViewRecipePage(pageConfig.recipe.simple.name);

    // Create a new recipe before the first test run in this suite
    beforeAll((done) => {
      apiCall.newRecipe(pageConfig.recipe.simple, done);
    });

    // Delete added recipe after all tests completed in this sute
    afterAll((done) => {
      apiCall.deleteRecipe(pageConfig.recipe.simple.name, done);
    });

    describe('Menu Nav Bar Check #acceptance', () => {
      test('should show a recipe name @view-recipe-page', (done) => {
        // Highlight the expected result
        const expected = viewRecipePage.recipeName;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(viewRecipePage.labelRecipeName)
          .evaluate(page => document.querySelector(page.labelRecipeName).innerText
            , viewRecipePage)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
    });
    describe('Title Bar Check #acceptance', () => {
      test('should show a recipe name title @view-recipe-page', (done) => {
        // Highlight the expected result
        const expected = viewRecipePage.recipeName;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(viewRecipePage.labelRecipeTitle)
          .evaluate(page => document.querySelector(page.labelRecipeTitle).innerText
            , viewRecipePage)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
      test('should have Create Composition button @view-recipe-page', (done) => {
        // Highlight the expected result
        const expected = viewRecipePage.varCreateCompos;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(viewRecipePage.btnCreateCompos)
          .evaluate(page => document.querySelector(page.btnCreateCompos).innerText
            , viewRecipePage)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
    });
    compositions.forEach((composition) => {
      describe(`Create Composition Test For ${composition.type} #acceptance`, () => {
        const createComposPage = new CreateComposPage(composition.type
          , composition.arch);

        test('should pop up Create Composition window by clicking Create Compostion button @view-recipe-page', (done) => {
          // Highlight the expected result
          const expected = createComposPage.varCreateCompos;

          const nightmare = new Nightmare();
          nightmare
            .goto(viewRecipePage.url)
            .wait(viewRecipePage.btnCreateCompos)
            .click(viewRecipePage.btnCreateCompos)
            .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
              , createComposPage)
            .evaluate(page => document.querySelector(page.labelCreateCompos).innerText
              , createComposPage)
            .end()
            .then((element) => {
              expect(element).toBe(expected);
              done();
            });
        }, timeout);
        test('should have toast notification pop up when new composition added @view-recipe-page', (done) => {
          const toastNotifPage = new ToastNotifPage(pageConfig.recipe.simple.name);

          // Highlight the expected result
          const expectedCreating = toastNotifPage.varStatusCreating;
          const expectedComplete = toastNotifPage.varStatusComplete;

          const nightmare = new Nightmare();
          nightmare
            .goto(viewRecipePage.url)
            .wait(viewRecipePage.btnCreateCompos)
            .click(viewRecipePage.btnCreateCompos)
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
              , toastNotifPage)
              .end())
            .then((element) => {
              expect(element).toBe(expectedComplete);
              done();
            });
        }, timeout);
      });
    });
    describe('Components tab - Export Recipe To Manifest Test #acceptance', () => {
      const exportRecipePage = new ExportRecipePage();

      // More action menu
      const btnMoreAction = `${viewRecipePage.componentsTabRootElement} ${viewRecipePage.btnMore}`;
      const menuActionExport = `${viewRecipePage.componentsTabRootElement} ${viewRecipePage.menuActionExport}`;

      const tabComponents = viewRecipePage.tabLink('Components');

      test('should pop up dropdown-menu by clicking ":" button', (done) => {
        // Highlight the expected result
        const expected = viewRecipePage.toolBarMoreActionList.Export;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .evaluate(element => document.querySelector(element).innerText
            , menuActionExport)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
      test('should pop up Export Recipe window by clicking "Export"', (done) => {
        // Highlight the expected result
        const expected = exportRecipePage.varExportTitle;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .click(menuActionExport)
          .wait(page => document.querySelector(page.rootElement).style.display === 'block'
            , exportRecipePage)
          .wait(exportRecipePage.labelExportTitle)
          .evaluate(page => document.querySelector(page.labelExportTitle).innerText
            , exportRecipePage)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
      test('should show the correct dependence packages and total numbers of dependencies', (done) => {
        // Convert package name into a string
        const packNames = `${pageConfig.recipe.simple.packages[0].name},${pageConfig.recipe.simple.packages[1].name}`;

        function callback(packs) {
          const depList = packs.map(
            pack => pack.dependencies.map(module => `${module.name}-${module.version}-${module.release}`));
          const depCompSet = new Set(depList.reduce((acc, val) => [...acc, ...val]));

          // Highlight the expected result
          const expectedNumber = `${[...depCompSet].length} ${exportRecipePage.varTotalComponents}`;
          const expectedContent = [...depCompSet].sort().join('\n');

          const nightmare = new Nightmare();
          nightmare
            .goto(viewRecipePage.url)
            .wait(tabComponents)
            .click(tabComponents)
            .wait(btnMoreAction)
            .click(btnMoreAction)
            .wait(menuActionExport)
            .click(menuActionExport)
            .wait(page => document.querySelector(page.rootElement).style.display === 'block'
              , exportRecipePage)
            .wait(exportRecipePage.labelTotalComponents)
            .evaluate(page => document.querySelector(page.labelTotalComponents).innerText
              , exportRecipePage)
            .then((element) => {
              expect(element).toBe(expectedNumber);
            })
            .then(() => nightmare
              .evaluate(page => document.querySelector(page.textAreaContent).value
                , exportRecipePage)
              .end())
            .then((element) => {
              expect(element).toBe(expectedContent);
              done();
            });
        }

        apiCall.moduleInfo(packNames, callback, done);
      }, timeout);
      test('should copy and paste correct components', (done) => {
        // expected result should be the content in textarea
        let expected = '';

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
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
            })
            .end())
          .then((element) => {
            // remove the last "\n" from paste result with trim()
            expect(element.trim()).toBe(expected);
            done();
          });
      }, timeout);
    });
    describe('Details tab - Export Recipe To Manifest Test #acceptance', () => {
      const exportRecipePage = new ExportRecipePage();

      // More action menu
      const btnMoreAction = `${viewRecipePage.detailTabRootElement} ${viewRecipePage.btnMore}`;
      const menuActionExport = `${viewRecipePage.detailTabRootElement} ${viewRecipePage.menuActionExport}`;

      const tabComponents = viewRecipePage.tabLink('Details');

      test('should pop up dropdown-menu by clicking ":" button', (done) => {
        // Highlight the expected result
        const expected = viewRecipePage.toolBarMoreActionList.Export;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .evaluate(element => document.querySelector(element).innerText
            , menuActionExport)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
      test('should pop up Export Recipe window by clicking "Export"', (done) => {
        // Highlight the expected result
        const expected = exportRecipePage.varExportTitle;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .click(menuActionExport)
          .wait(page => document.querySelector(page.rootElement).style.display === 'block'
            , exportRecipePage)
          .wait(exportRecipePage.labelExportTitle)
          .evaluate(page => document.querySelector(page.labelExportTitle).innerText
            , exportRecipePage)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
      test('should show the correct dependence packages and total numbers of dependencies', (done) => {
        // Convert package name into a string
        const packNames = `${pageConfig.recipe.simple.packages[0].name},${pageConfig.recipe.simple.packages[1].name}`;

        function callback(packs) {
          const depList = packs.map(
            pack => pack.dependencies.map(module => `${module.name}-${module.version}-${module.release}`));
          const depCompSet = new Set(depList.reduce((acc, val) => [...acc, ...val]));

          // Highlight the expected result
          const expectedNumber = `${[...depCompSet].length} ${exportRecipePage.varTotalComponents}`;
          const expectedContent = [...depCompSet].sort().join('\n');

          const nightmare = new Nightmare();
          nightmare
            .goto(viewRecipePage.url)
            .wait(tabComponents)
            .click(tabComponents)
            .wait(btnMoreAction)
            .click(btnMoreAction)
            .wait(menuActionExport)
            .click(menuActionExport)
            .wait(page => document.querySelector(page.rootElement).style.display === 'block'
              , exportRecipePage)
            .wait(exportRecipePage.labelTotalComponents)
            .evaluate(page => document.querySelector(page.labelTotalComponents).innerText
              , exportRecipePage)
            .then((element) => {
              expect(element).toBe(expectedNumber);
            })
            .then(() => nightmare
              .evaluate(page => document.querySelector(page.textAreaContent).value
                , exportRecipePage)
              .end())
            .then((element) => {
              expect(element).toBe(expectedContent);
              done();
            });
        }

        apiCall.moduleInfo(packNames, callback, done);
      }, timeout);
      test('should copy and paste correct components', (done) => {
        // expected result should be the content in textarea
        let expected = '';

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
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
            })
            .end())
          .then((element) => {
            // remove the last "\n" from paste result with trim()
            expect(element.trim()).toBe(expected);
            done();
          });
      }, timeout);
    });
    describe('Compositions tab - Export Recipe To Manifest Test #acceptance', () => {
      const exportRecipePage = new ExportRecipePage();

      // More action menu
      const btnMoreAction = `${viewRecipePage.compositionsTabRootElement} ${viewRecipePage.btnMore}`;
      const menuActionExport = `${viewRecipePage.compositionsTabRootElement} ${viewRecipePage.menuActionExport}`;

      const tabComponents = viewRecipePage.tabLink('Compositions');

      test('should pop up dropdown-menu by clicking ":" button', (done) => {
        // Highlight the expected result
        const expected = viewRecipePage.toolBarMoreActionList.Export;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .evaluate(element => document.querySelector(element).innerText
            , menuActionExport)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
      test('should pop up Export Recipe window by clicking "Export"', (done) => {
        // Highlight the expected result
        const expected = exportRecipePage.varExportTitle;

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
          .wait(btnMoreAction)
          .click(btnMoreAction)
          .wait(menuActionExport)
          .click(menuActionExport)
          .wait(page => document.querySelector(page.rootElement).style.display === 'block'
            , exportRecipePage)
          .wait(exportRecipePage.labelExportTitle)
          .evaluate(page => document.querySelector(page.labelExportTitle).innerText
            , exportRecipePage)
          .end()
          .then((element) => {
            expect(element).toBe(expected);
            done();
          });
      }, timeout);
      test('should show the correct dependence packages and total numbers of dependencies', (done) => {
        // Convert package name into a string
        const packNames = `${pageConfig.recipe.simple.packages[0].name},${pageConfig.recipe.simple.packages[1].name}`;

        function callback(packs) {
          const depList = packs.map(
            pack => pack.dependencies.map(module => `${module.name}-${module.version}-${module.release}`));
          const depCompSet = new Set(depList.reduce((acc, val) => [...acc, ...val]));

          // Highlight the expected result
          const expectedNumber = `${[...depCompSet].length} ${exportRecipePage.varTotalComponents}`;
          const expectedContent = [...depCompSet].sort().join('\n');

          const nightmare = new Nightmare();
          nightmare
            .goto(viewRecipePage.url)
            .wait(tabComponents)
            .click(tabComponents)
            .wait(btnMoreAction)
            .click(btnMoreAction)
            .wait(menuActionExport)
            .click(menuActionExport)
            .wait(page => document.querySelector(page.rootElement).style.display === 'block'
              , exportRecipePage)
            .wait(exportRecipePage.labelTotalComponents)
            .evaluate(page => document.querySelector(page.labelTotalComponents).innerText
              , exportRecipePage)
            .then((element) => {
              expect(element).toBe(expectedNumber);
            })
            .then(() => nightmare
              .evaluate(page => document.querySelector(page.textAreaContent).value
                , exportRecipePage)
              .end())
            .then((element) => {
              expect(element).toBe(expectedContent);
              done();
            });
        }

        apiCall.moduleInfo(packNames, callback, done);
      }, timeout);
      test('should copy and paste correct components', (done) => {
        // expected result should be the content in textarea
        let expected = '';

        const nightmare = new Nightmare();
        nightmare
          .goto(viewRecipePage.url)
          .wait(tabComponents)
          .click(tabComponents)
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
            })
            .end())
          .then((element) => {
            // remove the last "\n" from paste result with trim()
            expect(element.trim()).toBe(expected);
            done();
          });
      }, timeout);
    });
  });
});
