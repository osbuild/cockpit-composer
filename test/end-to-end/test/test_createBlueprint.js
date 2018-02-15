const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const BlueprintsPage = require('../pages/blueprints');
const CreateBlueprintPage = require('../pages/createBlueprint');
const EditBlueprintPage = require('../pages/editBlueprint');
const apiCall = require('../utils/apiCall');
const helper = require('../utils/helper');
const pageConfig = require('../config');
const fs = require('fs');
const coverage = require('../utils/coverage.js').coverage;


describe('Create Blueprint Page', () => {
  let nightmare;
  // Set case running timeout
  const timeout = 15000;

  // Check BDCS API and Web service first
  beforeAll(apiCall.serviceCheck);

  const blueprintsPage = new BlueprintsPage();
  const createBlueprintPage = new CreateBlueprintPage(pageConfig.blueprint.simple.name
    , pageConfig.blueprint.simple.description);

  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(pageConfig.nightmareTimeout), blueprintsPage);
  });

  describe('Input Data Validation Test', () => {
    describe('Required Field Missing', () => {
      const testSpec1 = test('should show alert message by clicking Save button when create blueprint without name',
      (done) => {
        // Highlight the expected result
        const expectedAlertInfo = createBlueprintPage.varAlertInfo;
        const expectedHelpBlockMsg = createBlueprintPage.varHelpBlockMsg;

        nightmare
          .wait(blueprintsPage.btnCreateBlueprint)
          .click(blueprintsPage.btnCreateBlueprint)
          .wait(page => document.activeElement.id === page.inputNameEleId
            , createBlueprintPage)
          .wait(createBlueprintPage.btnSave)
          .click(createBlueprintPage.btnSave)
          .wait(createBlueprintPage.labelAlertInfo)
          .evaluate(page => document.querySelector(page.labelAlertInfo).innerText
            , createBlueprintPage)
          .then((element) => {
            expect(element).toBe(expectedAlertInfo);
          })
          .then(() => nightmare
            .wait(createBlueprintPage.spanHelpBlockMsg)
            .evaluate(page => document.querySelector(page.spanHelpBlockMsg).innerText
              , createBlueprintPage))
          .then((element) => {
            expect(element).toBe(expectedHelpBlockMsg);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec1);
          });
      }, timeout);
      const testSpec2 = test('should show alert message by clicking Enter key when create blueprint without name',
      (done) => {
        // Highlight the expected result
        const expectedAlertInfo = createBlueprintPage.varAlertInfo;
        const expectedHelpBlockMsg = createBlueprintPage.varHelpBlockMsg;

        nightmare
          .wait(blueprintsPage.btnCreateBlueprint)
          .click(blueprintsPage.btnCreateBlueprint)
          .wait(page => document.activeElement.id === page.inputNameEleId
            , createBlueprintPage)
          .wait(createBlueprintPage.btnSave)
          .type('body', '\u000d')
          .wait(createBlueprintPage.labelAlertInfo)
          .evaluate(page => document.querySelector(page.labelAlertInfo).innerText
            , createBlueprintPage)
          .then((element) => {
            expect(element).toBe(expectedAlertInfo);
          })
          .then(() => nightmare
            .wait(createBlueprintPage.spanHelpBlockMsg)
            .evaluate(page => document.querySelector(page.spanHelpBlockMsg).innerText
              , createBlueprintPage))
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
        const expected = createBlueprintPage.varHelpBlockMsg;

        nightmare
          .wait(blueprintsPage.btnCreateBlueprint)
          .click(blueprintsPage.btnCreateBlueprint)
          .wait(page => document.activeElement.id === page.inputNameEleId
            , createBlueprintPage)
          .evaluate(page => document.querySelector(page.inputDescription).focus()
            , createBlueprintPage)
          .wait(createBlueprintPage.spanHelpBlockMsg)
          .evaluate(page => document.querySelector(page.spanHelpBlockMsg).innerText
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
    describe('Simple Valid Input Test', () => {
      const editBlueprintPage = new EditBlueprintPage(pageConfig.blueprint.simple.name);

      // Delete created blueprint after each creation case
      afterEach((done) => {
        apiCall.deleteBlueprint(editBlueprintPage.blueprintName, done);
      });

      const testSpec4 = test('should switch to Edit Blueprint page - blueprint creation success',
      (done) => {
        nightmare
          .wait(blueprintsPage.btnCreateBlueprint)
          .click(blueprintsPage.btnCreateBlueprint)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createBlueprintPage)
          .insert(createBlueprintPage.inputName, createBlueprintPage.varRecName)
          .insert(createBlueprintPage.inputDescription, createBlueprintPage.varRecDesc)
          .click(createBlueprintPage.btnSave)
          .wait(editBlueprintPage.componentListItemRootElement)
          .exists(editBlueprintPage.componentListItemRootElement)
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
