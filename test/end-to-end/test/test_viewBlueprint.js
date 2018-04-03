const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const faker = require('faker');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const ViewBlueprintPage = require('../pages/viewBlueprint');
const CreateImagePage = require('../pages/createImage');
const ToastNotifPage = require('../pages/toastNotif');
const ExportBlueprintPage = require('../pages/exportBlueprint');
const apiCall = require('../utils/apiCall');
const helper = require('../utils/helper');
const pageConfig = require('../config');
const fs = require('fs');
const coverage = require('../utils/coverage.js').coverage;

describe('View Blueprint Page', () => {
  let nightmare;
  // Set case running timeout
  const timeout = pageConfig.nightmareOptions.waitTimeout * 3;

  // Check BDCS API and Web service first
  beforeAll(apiCall.serviceCheck);

  const viewBlueprintPage = new ViewBlueprintPage(pageConfig.blueprint.simple.name);

  // Switch to welder-web iframe if welder-web is integrated with Cockpit.
  // Cockpit web service is listening on TCP port 9090.
  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(pageConfig.nightmareOptions), viewBlueprintPage);
  });

  describe('Single Word Blueprint Name Scenario', () => {
    // Array of image types and architechtures
    const images = pageConfig.image;

    // Create a new blueprint before the first test run in this suite
    beforeAll((done) => {
      apiCall.newBlueprint(pageConfig.blueprint.simple, done);
    });

    // Delete added blueprint after all tests completed in this suite
    afterAll((done) => {
      DeleteBlueprintPage.deleteBlueprint(pageConfig.blueprint.simple.name, done);
    });

    describe('Menu Nav Bar Check', () => {
      const testSpec1 = test('should show a blueprint name',
      (done) => {
        // Highlight the expected result
        const expected = viewBlueprintPage.blueprintName;

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
          .wait(viewBlueprintPage.labelBlueprintName)
          .evaluate(page => document.querySelector(page.labelBlueprintName).innerText
            , viewBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec1);
          });
      }, timeout);
    });
    describe('Title Bar Check', () => {
      const testSpec2 = test('should show a blueprint name title',
      (done) => {
        // Highlight the expected result
        const expected = viewBlueprintPage.blueprintName;

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
          .wait(viewBlueprintPage.labelBlueprintTitle)
          .evaluate(page => document.querySelector(page.labelBlueprintTitle).innerText
            , viewBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec2);
          });
      }, timeout);
      const testSpec10 = test('should show correct blueprint description title',
      (done) => {
        // Highlight the expected result
        const expected = pageConfig.blueprint.simple.description;

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
          .wait(viewBlueprintPage.labelBlueprintDescription)
          .evaluate(page => document.querySelector(page.labelBlueprintDescription).innerText
            , viewBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec10);
          });
      }, timeout);
      const testSpec3 = test('should have Create Image button',
      (done) => {
        // Highlight the expected result
        const expected = viewBlueprintPage.varCreateImage;

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
          .wait(viewBlueprintPage.btnCreateImage)
          .evaluate(page => document.querySelector(page.btnCreateImage).innerText
            , viewBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec3);
          });
      }, timeout);
    });
    describe('Details Tab', () => {
      const testSpec11 = test('should show correct blueprint name',
      (done) => {
        // Highlight the expected result
        const expected = viewBlueprintPage.blueprintName;

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
          .wait(viewBlueprintPage.detailTabElement)
          .click(viewBlueprintPage.detailTabElement)
          .wait(viewBlueprintPage.labelNameUnderDetails)
          .evaluate(page => document.querySelector(page.labelNameUnderDetails).innerText
            , viewBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec11);
          });
      }, timeout);
      const testSpec12 = test('should show correct blueprint description',
      (done) => {
        // Highlight the expected result
        const expected = pageConfig.blueprint.simple.description;

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
          .wait(viewBlueprintPage.detailTabElement)
          .click(viewBlueprintPage.detailTabElement)
          .wait(viewBlueprintPage.labelDescriptionUnderDetails)
          .evaluate(page => document.querySelector(page.labelDescriptionUnderDetails).innerText
            , viewBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec12);
          });
      }, timeout);
      const testSpec13 = test('should update description',
      (done) => {
        // Highlight the expected result
        const expected = faker.lorem.sentence();

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
          .wait(viewBlueprintPage.detailTabElement)
          .click(viewBlueprintPage.detailTabElement)
          .wait(viewBlueprintPage.btnEditDescriptionUnderDetails)
          .click(viewBlueprintPage.btnEditDescriptionUnderDetails)
          .wait(viewBlueprintPage.inputTextDescriptionUnderDetails)
          .evaluate((page) => {
            document.querySelector(page.inputTextDescriptionUnderDetails).value = '';
          }, viewBlueprintPage)
          .insert(viewBlueprintPage.inputTextDescriptionUnderDetails, expected)
          .wait(viewBlueprintPage.btnOkDescriptionUnderDetails)
          .click(viewBlueprintPage.btnOkDescriptionUnderDetails)
          .wait(viewBlueprintPage.labelBlueprintDescription)
          .evaluate(page => document.querySelector(page.labelBlueprintDescription).innerText
            , viewBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec13);
          });
      }, timeout);
      const testSpec14 = test('should not update description if click cancel button',
      (done) => {
        // Highlight the expected result
        let expected = '';

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
          .evaluate(page => document.querySelector(page.labelBlueprintDescription).innerText
            , viewBlueprintPage)
          .then((element) => { expected = element; })
          .then(() => nightmare
            .wait(viewBlueprintPage.detailTabElement)
            .click(viewBlueprintPage.detailTabElement)
            .wait(viewBlueprintPage.btnEditDescriptionUnderDetails)
            .click(viewBlueprintPage.btnEditDescriptionUnderDetails)
            .wait(viewBlueprintPage.inputTextDescriptionUnderDetails)
            .evaluate((page) => {
              document.querySelector(page.inputTextDescriptionUnderDetails).value = '';
            }, viewBlueprintPage)
            .wait(viewBlueprintPage.btnCancelDescriptionUnderDetails)
            .click(viewBlueprintPage.btnCancelDescriptionUnderDetails)
            .wait(viewBlueprintPage.labelDescriptionUnderDetails)
            .evaluate(page => document.querySelector(page.labelDescriptionUnderDetails).innerText
              , viewBlueprintPage))
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec14);
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
            .wait(viewBlueprintPage.componentsTabElement)
            .click(viewBlueprintPage.componentsTabElement)
            .wait(viewBlueprintPage.tabSelectedComponents)
            .click(viewBlueprintPage.tabSelectedComponents)
            .wait(viewBlueprintPage.contentSelectedComponents)
            .wait(viewBlueprintPage.btnCreateImage)
            .click(viewBlueprintPage.btnCreateImage)
            .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
              , createImagePage)
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
            .wait(viewBlueprintPage.componentsTabElement)
            .click(viewBlueprintPage.componentsTabElement)
            .wait(viewBlueprintPage.tabSelectedComponents)
            .click(viewBlueprintPage.tabSelectedComponents)
            .wait(viewBlueprintPage.contentSelectedComponents)
            .wait(viewBlueprintPage.btnCreateImage)
            .click(viewBlueprintPage.btnCreateImage)
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

      // More action menu
      const btnMoreAction = `${viewBlueprintPage.pagelevelActions} ${viewBlueprintPage.btnMore}`;
      const menuActionExport = `${viewBlueprintPage.pagelevelActions} ${viewBlueprintPage.menuActionExport}`;

      const testSpec6 = test('should pop up dropdown-menu by clicking ":" button',
      (done) => {
        // Highlight the expected result
        const expected = viewBlueprintPage.toolBarMoreActionList.Export;

        nightmare
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
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
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
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
            .wait(viewBlueprintPage.componentsTabElement)
            .click(viewBlueprintPage.componentsTabElement)
            .wait(viewBlueprintPage.tabSelectedComponents)
            .click(viewBlueprintPage.tabSelectedComponents)
            .wait(viewBlueprintPage.contentSelectedComponents)
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
          .wait(viewBlueprintPage.componentsTabElement)
          .click(viewBlueprintPage.componentsTabElement)
          .wait(viewBlueprintPage.tabSelectedComponents)
          .click(viewBlueprintPage.tabSelectedComponents)
          .wait(viewBlueprintPage.contentSelectedComponents)
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
  });
});
