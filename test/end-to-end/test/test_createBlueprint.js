const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const faker = require('faker');
const BlueprintsPage = require('../pages/blueprints');
const CreateBlueprintPage = require('../pages/createBlueprint');
const EditBlueprintPage = require('../pages/editBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');
const ToastNotifPage = require('../pages/toastNotif');
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
      const testSpec1 = test('should show alert message by clicking Create button when create blueprint without name',
      (done) => {
        // Highlight the expected result
        const expectedAlertInfo = createBlueprintPage.varAlertInfo;
        const expectedHelpBlockMsg = createBlueprintPage.varHelpBlockMsg;

        nightmare
          .wait(blueprintsPage.btnCreateBlueprint)
          .click(blueprintsPage.btnCreateBlueprint)
          .wait(page => document.activeElement.id === page.inputNameEleId
            , createBlueprintPage)
          .wait(createBlueprintPage.btnCreate)
          .click(createBlueprintPage.btnCreate)
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
          .wait(createBlueprintPage.btnCommit)
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
          .click(createBlueprintPage.btnCreate)
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
    describe('Create Blueprint', () => {
      const blueprintName = faker.lorem.words();
      const blueprintDescription = faker.lorem.sentence();
      const blueprintComponentName = pageConfig.blueprint.simple.packages[0].name;
      const editBlueprintPage = new EditBlueprintPage(blueprintName);
      const blueprintNameSelector = BlueprintsPage.blueprintNameSelector(blueprintName);
      const changesPendingCommitPage = new ChangesPendingCommitPage();
      const toastNotifPage = new ToastNotifPage(blueprintName);

      // Delete created blueprint after each creation case
      afterEach((done) => {
        apiCall.deleteBlueprint(blueprintName, done);
      });

      const testSpec5 = test('should successfuly create a blueprint',
      (done) => {
        // Highlight the expected result
        const expected = blueprintName;

        nightmare
          .wait(blueprintsPage.btnCreateBlueprint)
          .click(blueprintsPage.btnCreateBlueprint)
          .wait(page => document.querySelector(page.dialogRootElement).style.display === 'block'
            , createBlueprintPage)
          .insert(createBlueprintPage.inputName, blueprintName)
          .insert(createBlueprintPage.inputDescription, blueprintDescription)
          .click(createBlueprintPage.btnCreate)
          .wait(editBlueprintPage.httpdComponent)
          .click(editBlueprintPage.httpdComponent)
          .wait((page, name) => document.querySelector(page.labelComponentName).innerText.includes(name)
            , editBlueprintPage, blueprintComponentName)
          .wait(editBlueprintPage.btnHttpdComponent)
          .click(editBlueprintPage.btnHttpdComponent)
          .wait(editBlueprintPage.boxFirstSelectedComponent)
          .wait((page, name) => document.querySelector(page.labelFirstComponentName).text === name
            , editBlueprintPage, blueprintComponentName)
          .click(editBlueprintPage.btnCommit)
          .wait(changesPendingCommitPage.btnCommit)
          .click(changesPendingCommitPage.btnCommit)
          .wait(toastNotifPage.iconComplete)
          .click(editBlueprintPage.linkBackToBlueprints)
          .wait(blueprintNameSelector)
          .evaluate(selector => document.querySelector(selector).innerText
              , blueprintNameSelector)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec5);
          });
      }, timeout);
    });
  });
});
