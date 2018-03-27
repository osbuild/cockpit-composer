const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const EditBlueprintPage = require('../pages/editBlueprint');
const CreateImagePage = require('../pages/createImage');
const ToastNotifPage = require('../pages/toastNotif');
const ExportBlueprintPage = require('../pages/exportBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');
const apiCall = require('../utils/apiCall');
const helper = require('../utils/helper');
const pageConfig = require('../config');
const fs = require('fs');
const coverage = require('../utils/coverage.js').coverage;

describe('Edit Blueprint Page', () => {
  let nightmare;
  // Set case running timeout
  const timeout = pageConfig.nightmareTimeout.waitTimeout * 3;

  // Check BDCS API and Web service first
  beforeAll(apiCall.serviceCheck);

  const editBlueprintPage = new EditBlueprintPage(pageConfig.blueprint.simple.name);

  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(pageConfig.nightmareTimeout), editBlueprintPage);
  });

  describe('Single Word Blueprint Name Scenario', () => {
    // Array of image types and architechtures
    const images = pageConfig.image;

    // Create a new blueprint before the first test run in this suite
    beforeAll((done) => {
      apiCall.newBlueprint(pageConfig.blueprint.simple, done);
    });

    // Delete added blueprint after all tests completed in this sute
    afterAll((done) => {
      apiCall.deleteBlueprint(pageConfig.blueprint.simple.name, done);
    });

    describe('Menu Nav Bar Check', () => {
      const testSpec1 = test('should show a blueprint name with a correct link address',
      (done) => {
        // Highlight the expected result
        const expectedBlueprintName = editBlueprintPage.blueprintName;
        const expectedViewBlueprintLinke = editBlueprintPage.varLinkToViewRec;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.linkBlueprintName)
          .then(() => nightmare
            .evaluate(page => document.querySelector(page.linkBlueprintName).innerText
              , editBlueprintPage))
          .then((element) => {
            expect(element).toBe(expectedBlueprintName);
          })
          .then(() => nightmare
            .evaluate(page => document.querySelector(page.linkBlueprintName).href
              , editBlueprintPage))
          .then((element) => {
            expect(element).toBe(expectedViewBlueprintLinke);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec1);
          });
      }, timeout);
      const testSpec15 = test('Commit button should be in disabled stauts',
      (done) => {
        // Highlight the expected result
        const expected = true;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .exists(editBlueprintPage.btnDisabledCommit)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec15);
          });
      }, timeout);
      const testSpec16 = test('Discard Changes button should be in disabled stauts',
      (done) => {
        // Highlight the expected result
        const expected = true;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .exists(editBlueprintPage.btnDisabledDiscard)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec16);
          });
      }, timeout);
      const testSpec18 = test('Commit button should be in enabled stauts',
      (done) => {
        // Highlight the expected result
        const expected = true;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.btnCommit)
          .exists(editBlueprintPage.btnCommit)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec18);
          });
      }, timeout);
      const testSpec17 = test('Discard Changes button should be in enabled stauts',
      (done) => {
        // Highlight the expected result
        const expected = true;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.btnDiscard)
          .exists(editBlueprintPage.btnDiscard)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec17);
          });
      }, timeout);
      const testSpec20 = test('Pending Changes link should not exist',
      (done) => {
        // Highlight the expected result
        const expected = false;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .exists(editBlueprintPage.linkPendingChange)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec20);
          });
      }, timeout);
      const testSpec19 = test('Pending Changes link should be displayed',
      (done) => {
        // Highlight the expected result
        const expected = true;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.linkPendingChange)
          .exists(editBlueprintPage.linkPendingChange)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec19);
          });
      }, timeout);
    });
    describe('Title Bar Check', () => {
      const testSpec2 = test('should show a blueprint name title',
      (done) => {
        // Highlight the expected result
        const expected = editBlueprintPage.blueprintName;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.labelBlueprintTitle)
          .evaluate(page => document.querySelector(page.labelBlueprintTitle).innerText
            , editBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec2);
          });
      }, timeout);
      const testSpec3 = test('should have Create Image button',
      (done) => {
        // Highlight the expected result
        const expected = editBlueprintPage.varCreateImage;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.btnCreateImage)
          .evaluate(page => document.querySelector(page.btnCreateImage).innerText
            , editBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec3);
          });
      }, timeout);
    });
    images.forEach((image) => {
      describe(`Create Image Test For ${image.type}`, () => {
        const createImagePage = new CreateImagePage(image.type
          , image.arch);


        const testSpec4 = test('should pop up Create Image window by clicking Create Image button',
        (done) => {
          // Highlight the expected result
          const expected = createImagePage.varCreateImage;

          nightmare
            .wait(editBlueprintPage.componentListItemRootElement)
            .wait(editBlueprintPage.btnCreateImage)
            .click(editBlueprintPage.btnCreateImage)
            .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
              , createImagePage)
            .wait(createImagePage.labelCreateImage)
            .evaluate(page => document.querySelector(page.labelCreateImage).innerText
              , createImagePage)
            .then((element) => {
              expect(element).toBe(expected);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec4);
            });
        }, timeout);
        const testSpec5 = test('should have toast notification pop up when new image added',
        (done) => {
          const toastNotifPage = new ToastNotifPage(pageConfig.blueprint.simple.name);

          // Highlight the expected result
          const expectedCreating = toastNotifPage.varStatusCreating;
          const expectedComplete = toastNotifPage.varStatusComplete;

          nightmare
            .wait(editBlueprintPage.componentListItemRootElement)
            .wait(editBlueprintPage.btnCreateImage)
            .click(editBlueprintPage.btnCreateImage)
            .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
              , createImagePage)
            .select(createImagePage.selectImageType, createImagePage.imageType)
            .select(createImagePage.selectImageArch, createImagePage.imageArch)
            .click(createImagePage.btnCreate)
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
              helper.gotoError(error, nightmare, testSpec5);
            });
        }, timeout);
      });
    });
    describe('Export Blueprint To Manifest Test', () => {
      const exportBlueprintPage = new ExportBlueprintPage();

      // More action button
      const btnMoreAction = editBlueprintPage.btnMore;
      const menuActionExport = editBlueprintPage.menuActionExport;

      const testSpec6 = test('should pop up dropdown-menu by clicking ":" button',
      (done) => {
        // Highlight the expected result
        const expected = editBlueprintPage.moreActionList.Export;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
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
            helper.gotoError(error, nightmare, testSpec6);
          });
      }, timeout);
      const testSpec7 = test('should pop up Export Blueprint window by clicking "Export"',
      (done) => {
        // Highlight the expected result
        const expected = exportBlueprintPage.varExportTitle;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
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
            helper.gotoError(error, nightmare, testSpec7);
          });
      }, timeout);
      const testSpec8 = test('should show the correct dependence packages and total numbers of dependencies',
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
            .wait(editBlueprintPage.componentListItemRootElement)
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
              helper.gotoError(error, nightmare, testSpec8);
            });
        }

        apiCall.moduleInfo(packNames, callback, done);
      }, timeout);
      const testSpec9 = test('should copy and paste correct components',
      (done) => {
        // expected result should be the content in textarea
        let expected = '';

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
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
            helper.gotoError(error, nightmare, testSpec9);
          });
      }, timeout);
    });
    describe('Commit Blueprint Test', () => {
      const testSpec10 = test('should have toast notification pop up when Commit button clicked',
      (done) => {
        const toastNotifPage = new ToastNotifPage(pageConfig.blueprint.simple.name);
        const changesPendingCommitPage = new ChangesPendingCommitPage();

        // Highlight the expected result
        const expected = toastNotifPage.varStatusCommitted;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.btnCommit)
          .click(editBlueprintPage.btnCommit)
          .wait(changesPendingCommitPage.btnCommit)
          .click(changesPendingCommitPage.btnCommit)
          .wait(toastNotifPage.iconCreating)
          .wait((page) => {
            const blueprintName = document.querySelector(page.labelBlueprintName).innerText;
            return blueprintName !== page.varEmptyName && blueprintName.includes(page.varEmptyName);
          }, toastNotifPage)
          .then(() => nightmare
            .wait(toastNotifPage.iconComplete)
            .wait((page) => {
              const blueprintName = document.querySelector(page.labelBlueprintName).innerText;
              return blueprintName !== page.varEmptyName && blueprintName.includes(page.varEmptyName);
            }, toastNotifPage)
            .evaluate(page => document.querySelector(page.labelStatus).innerText
            , toastNotifPage))
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec10);
          });
      }, timeout);
    });
    describe('Component Filter', () => {
      const testSpec11 = test('should have correct filter content label',
      (done) => {
        const filterContent = 'http';
        // Highlight the expected result
        let expected = '';

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.inputFilter)
          .insert(editBlueprintPage.inputFilter, filterContent)
          .type(editBlueprintPage.inputFilter, '\u000d')
          .wait(editBlueprintPage.linkClearAllFilters)
          .evaluate(page => document.querySelector(page.labelFilterType).innerText
            , editBlueprintPage)
          .then((element) => { expected = `${element}: ${filterContent}`; })
          .then(() => nightmare
            .wait(editBlueprintPage.labelFilterContent)
            .evaluate(page => document.querySelector(page.labelFilterContent).innerText
              , editBlueprintPage))
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec11);
          });
      }, timeout);
      const testSpec12 = test('should show correct filtered components name and number',
      (done) => {
        const filterContent = 'http';
        const packNames = pageConfig.blueprint.simple.packages[0].name;

        function callback(packs) {
          const depLists = packs.map(
            pack => pack.dependencies.map(module => module.name)
                                     .filter(elem => elem.includes(filterContent)));
          const depList = depLists.reduce((acc, val) => [...acc, ...val]);

          // Highlight the expected result
          const expectedNumber = depList.length <= 50 ?
            `1 - ${depList.length} of ${depList.length}` : `1 - 50 of ${depList.length}`;
          const expectedContent = depList.sort();

          nightmare
            .wait(editBlueprintPage.componentListItemRootElement)
            .wait(editBlueprintPage.inputFilter)
            .insert(editBlueprintPage.inputFilter, filterContent)
            .type(editBlueprintPage.inputFilter, '\u000d')
            .wait(editBlueprintPage.linkClearAllFilters)
            .evaluate(page => document.querySelector(page.totalComponentCount).innerText
              , editBlueprintPage)
            .then((element) => {
              expect(element).toBe(expectedNumber);
            })
            .then(() => nightmare
              .evaluate(page => Array.prototype.slice
                                .call(document.querySelectorAll(page.filterResult))
                                .map(x => x.innerText).sort()
                , editBlueprintPage))
            .then((element) => {
              expect(element).not.toBeFalsy();
              expect(element).toMatchObject(expectedContent);

              coverage(nightmare, done);
            })
            .catch((error) => {
              helper.gotoError(error, nightmare, testSpec12);
            });
        }

        apiCall.moduleInfo(packNames, callback, done);
      }, timeout);
      const testSpec13 = test('should clear filter result by clicking X button on filter label',
      (done) => {
        const filterContent = 'http';
        // Highlight the expected result
        let expected = '';

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .evaluate(page => document.querySelector(page.totalComponentCount).innerText
            , editBlueprintPage)
          .then((element) => { expected = element; })
          .then(() => nightmare
            .wait(editBlueprintPage.inputFilter)
            .insert(editBlueprintPage.inputFilter, filterContent)
            .type(editBlueprintPage.inputFilter, '\u000d')
            .wait(editBlueprintPage.linkClearAllFilters)
            .wait(editBlueprintPage.btnClearFilter)
            .click(editBlueprintPage.btnClearFilter)
            .wait(editBlueprintPage.componentListItemRootElement)
            .evaluate(page => document.querySelector(page.totalComponentCount).innerText
              , editBlueprintPage))
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec13);
          });
      }, timeout);
      const testSpec14 = test('should clear filter result by clicking Clear All Filters link',
      (done) => {
        const filterContent = 'http';
        // Highlight the expected result
        let expected = '';

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .evaluate(page => document.querySelector(page.totalComponentCount).innerText
            , editBlueprintPage)
          .then((element) => { expected = element; })
          .then(() => nightmare
            .wait(editBlueprintPage.inputFilter)
            .insert(editBlueprintPage.inputFilter, filterContent)
            .type(editBlueprintPage.inputFilter, '\u000d')
            .wait(editBlueprintPage.linkClearAllFilters)
            .click(editBlueprintPage.linkClearAllFilters)
            .wait(editBlueprintPage.componentListItemRootElement)
            .evaluate(page => document.querySelector(page.totalComponentCount).innerText
              , editBlueprintPage))
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec14);
          });
      }, timeout);
    });
  });
});
