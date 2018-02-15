const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const BlueprintsPage = require('../pages/blueprints');
const CreateBlueprintPage = require('../pages/createBlueprint');
const CreateComposPage = require('../pages/createCompos');
const ToastNotifPage = require('../pages/toastNotif');
const ExportBlueprintPage = require('../pages/exportBlueprint');
const apiCall = require('../utils/apiCall');
const helper = require('../utils/helper');
const pageConfig = require('../config');
const fs = require('fs');
const coverage = require('../utils/coverage.js').coverage;

describe('Blueprints Page', () => {
  let nightmare;
  // Set case running timeout
  const timeout = 15000;

  // Check BDCS API and Web service first
  beforeAll(apiCall.serviceCheck);

  const blueprintsPage = new BlueprintsPage();

  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(pageConfig.nightmareTimeout), blueprintsPage);
  });

  describe('Page Info Check', () => {
    describe('Title Check', () => {
      const testSpec1 = test('should be Blueprints',
      (done) => {
        // Highlight the expected result
        const expected = blueprintsPage.title;

        nightmare
          .title()
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec1);
          });
      }, timeout);
    });
  });

  describe('Tool Bar', () => {
    describe('Create Blueprint Test', () => {
      const testSpec2 = test('should have the Create Blueprint button on the Blueprints page',
      (done) => {
        // Highlight the expected result
        const expected = blueprintsPage.varCreateBlueprint;

        nightmare
          .wait(blueprintsPage.btnCreateBlueprint)
          .evaluate(page => document.querySelector(page.btnCreateBlueprint).innerText
            , blueprintsPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec2);
          });
      }, timeout);
      const testSpec3 = test('should pop up Create Blueprint window when click Create Blueprint button',
      (done) => {
        const createBlueprintPage = new CreateBlueprintPage(pageConfig.blueprint.simple.name
          , pageConfig.blueprint.simple.description);

        // Highlight the expected result
        const expected = createBlueprintPage.varCreateBlueprint;

        nightmare
          .wait(blueprintsPage.btnCreateBlueprint)
          .click(blueprintsPage.btnCreateBlueprint)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createBlueprintPage)
          .wait(createBlueprintPage.labelCreateBlueprint)
          .evaluate(page => document.querySelector(page.labelCreateBlueprint).innerText
            , createBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec3);
          });
      }, timeout);
    });
  });

  describe('Blueprint List', () => {
    describe('Single Word Blueprint Name Scenario', () => {
      // Array of composition types and architechtures
      const compositions = pageConfig.composition;

      // Create a new blueprint before the first test run in this suite
      beforeAll((done) => {
        apiCall.newBlueprint(pageConfig.blueprint.simple, done);
      });

      // Delete added blueprint after all tests completed in this sute
      afterAll((done) => {
        apiCall.deleteBlueprint(pageConfig.blueprint.simple.name, done);
      });

      describe('Blueprint Content Check', () => {
        const testSpec4 = test('should have correct blueprint name on list after new blueprint added',
        (done) => {
          // Highlight the expected result
          const expected = pageConfig.blueprint.simple.name;

          const blueprintNameSelector = BlueprintsPage.blueprintNameSelector(expected);

          nightmare
            .wait(blueprintNameSelector)
            .evaluate(selector => document.querySelector(selector).innerText
              , blueprintNameSelector)
            .then((element) => {
              expect(element).toBe(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec4);
            });
        }, timeout);
        const testSpec5 = test('should have correct blueprint description on list after new blueprint added',
        (done) => {
          // Highlight the expected result
          const expected = pageConfig.blueprint.simple.description;

          nightmare
            .wait((page, descr) => Array.prototype.slice
                                     .call(document.querySelectorAll(page.labelBlueprintDescr))
                                     .map(x => x.innerText)
                                     .includes(descr)
              , blueprintsPage, expected)
            .evaluate(page => Array.prototype.slice.call(document.querySelectorAll(page.labelBlueprintDescr)).map(x => x.innerText)
              , blueprintsPage)
            .then((element) => {
              expect(element).toContain(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec5);
            });
        }, timeout);
      });

      compositions.forEach((composition) => {
        describe(`Create Composition Test For ${composition.type}`, () => {
          const createComposPage = new CreateComposPage(composition.type
            , composition.arch);

          // Create Composition button selector
          const btnCreateCompos = BlueprintsPage.btnCreateCompos(pageConfig.blueprint.simple.name);

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
          }, timeout);
          const testSpec7 = test('should have toast notification pop up when new composition added',
          (done) => {
            const toastNotifPage = new ToastNotifPage(pageConfig.blueprint.simple.name);

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
                const blueprintName = document.querySelector(page.labelBlueprintName).innerText;
                return blueprintName !== page.varEmptyName && blueprintName.includes(page.varEmptyName);
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
                  const blueprintName = document.querySelector(page.labelBlueprintName).innerText;
                  return blueprintName !== page.varEmptyName && blueprintName.includes(page.varEmptyName);
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
          }, timeout);
        });
      });
      describe('Export Blueprint To Manifest Test', () => {
        const exportBlueprintPage = new ExportBlueprintPage();

        // More action button
        const btnMoreAction = BlueprintsPage.btnMore(pageConfig.blueprint.simple.name);
        const menuActionExport = BlueprintsPage.menuActionExport(pageConfig.blueprint.simple.name);

        const testSpec8 = test('should pop up dropdown-menu by clicking ":" button',
        (done) => {
          // Highlight the expected result
          const expected = blueprintsPage.moreActionList.Export;

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
        }, timeout);
        const testSpec9 = test('should pop up Export Blueprint window by clicking "Export"',
        (done) => {
          // Highlight the expected result
          const expected = exportBlueprintPage.varExportTitle;

          nightmare
            .wait(btnMoreAction)
            .click(btnMoreAction)
            .wait(menuActionExport)
            .click(menuActionExport)
            .wait(page => document.querySelector(page.rootElement).style.display === 'block'
              , exportBlueprintPage)
            .wait(exportBlueprintPage.labelExportTitle)
            .evaluate(page => document.querySelector(page.labelExportTitle).innerText
              , exportBlueprintPage)
            .then((element) => {
              expect(element).toBe(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec9);
            });
        }, timeout);
        const testSpec10 = test('should show the correct dependence packages and total numbers of dependencies',
        (done) => {
          // Convert package name into a string
          const packNames = `${pageConfig.blueprint.simple.packages[0].name}`;

          function callback(packs) {
            const depList = packs.map(
              pack => pack.dependencies.map(module => `${module.name}-${module.version}-${module.release}`));
            const depCompSet = new Set(depList.reduce((acc, val) => [...acc, ...val]));

            // Highlight the expected result
            const expectedNumber = `${[...depCompSet].length} ${exportBlueprintPage.varTotalComponents}`;
            const zeroComponent = exportBlueprintPage.varEmptyTotalComponents;
            const expectedContent = [...depCompSet].sort().join('\n');

            nightmare
              .wait(btnMoreAction)
              .click(btnMoreAction)
              .wait(menuActionExport)
              .click(menuActionExport)
              .wait(page => document.querySelector(page.rootElement).style.display === 'block'
                , exportBlueprintPage)
              .wait(exportBlueprintPage.labelTotalComponents)
              .wait((page, zero) => document.querySelector(page.labelTotalComponents).innerText !== zero
                , exportBlueprintPage, zeroComponent)
              .evaluate(page => document.querySelector(page.labelTotalComponents).innerText
                , exportBlueprintPage)
              .then((element) => {
                expect(element).toBe(expectedNumber);
              })
              .then(() => nightmare
                .evaluate(page => document.querySelector(page.textAreaContent).value
                  , exportBlueprintPage))
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
        }, timeout);
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
              , exportBlueprintPage)
            .wait(exportBlueprintPage.textAreaContent)
            .evaluate(page => document.querySelector(page.textAreaContent).value
              , exportBlueprintPage)
            .then((element) => { expected = element; })
            .then(() => nightmare
              .wait(exportBlueprintPage.btnCopy)
              .click(exportBlueprintPage.btnCopy)
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
        }, timeout);
      });
    });
  });
});
