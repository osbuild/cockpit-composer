const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
const EditBlueprintPage = require('../pages/editBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');
const apiCall = require('../utils/apiCall');
const helper = require('../utils/helper');
const pageConfig = require('../config');
const fs = require('fs');
const coverage = require('../utils/coverage.js').coverage;

describe('Changes Pending Commit Page', () => {
  let nightmare;
  // Set case running timeout
  const timeout = pageConfig.nightmareOptions.waitTimeout * 3;

  // Check BDCS API and Web service first
  beforeAll(apiCall.serviceCheck);

  const editBlueprintPage = new EditBlueprintPage(pageConfig.blueprint.simple.name);
  const changesPendingCommitPage = new ChangesPendingCommitPage();

  beforeEach(() => {
    helper.gotoURL(nightmare = new Nightmare(pageConfig.nightmareOptions), editBlueprintPage);
  });

  describe('Open Changes Pending Commit Page', () => {
    // Create a new blueprint before the first test run in this suite
    beforeAll((done) => {
      apiCall.newBlueprint(pageConfig.blueprint.simple, done);
    });

    // Delete added blueprint after all tests completed in this suite
    afterAll((done) => {
      DeleteBlueprintPage.deleteBlueprint(pageConfig.blueprint.simple.name, done);
    });

    const testSpec1 = test('should show changes pending commit page by clicking Commit button',
      (done) => {
        // Highlight the expected result
        const expected = pageConfig.blueprint.simple.name;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.btnCommit)
          .click(editBlueprintPage.btnCommit)
          .wait(changesPendingCommitPage.labelBlueprintName)
          .evaluate(page => document.querySelector(page.labelBlueprintName).innerText
            , changesPendingCommitPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec1);
          });
      }, timeout);
    const testSpec2 = test('should show changes pending commit page by clicking pending changes link',
      (done) => {
        // Highlight the expected result
        const expected = pageConfig.blueprint.simple.name;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.linkPendingChange)
          .click(editBlueprintPage.linkPendingChange)
          .wait(changesPendingCommitPage.labelBlueprintName)
          .evaluate(page => document.querySelector(page.labelBlueprintName).innerText
            , changesPendingCommitPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec2);
          });
      }, timeout);
  });
  describe('Changes Pending Commit Page', () => {
    // Create a new blueprint before the first test run in this suite
    beforeEach((done) => {
      apiCall.newBlueprint(pageConfig.blueprint.simple, done);
    });

    // Delete added blueprint after all tests completed in this sute
    afterEach((done) => {
      DeleteBlueprintPage.deleteBlueprint(pageConfig.blueprint.simple.name, done);
    });

    const testSpec3 = test('should show correct pending change content',
      (done) => {
        // Highlight the expected result
        const expectedAction = 'Added';
        let expectedName;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .evaluate(page => document.querySelector(page.theFirstComponentName).innerText
            , editBlueprintPage)
          .then((element) => { expectedName = element; })
          .then(() => nightmare
            .wait(editBlueprintPage.componentListItemRootElementSelect)
            .click(editBlueprintPage.componentListItemRootElementSelect)
            .wait(editBlueprintPage.btnCommit)
            .click(editBlueprintPage.btnCommit)
            .wait(changesPendingCommitPage.labelLine1PendingChangesAction)
            .evaluate(page => document.querySelector(page.labelLine1PendingChangesAction).innerText
              , changesPendingCommitPage))
          .then((element) => {
            expect(element).toBe(expectedAction);
          })
          .then(() => nightmare
            .evaluate(page => document.querySelector(page.labelLine1PendingChangesComponent).innerText
              , changesPendingCommitPage))
          .then((element) => {
            // element = acl-2.2.52-15.fc26
            expect(element.split('-')[0]).toBe(expectedName);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec3);
          });
      }, timeout);
    const testSpec4 = test('should show correct order of pending changes',
      (done) => {
        // Highlight the expected result
        let expectedFirstComponentName;
        let expectedSecondComponentName;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .evaluate(page => document.querySelector(page.theFirstComponentName).innerText
            , editBlueprintPage)
          .then((element) => { expectedFirstComponentName = element; })
          .then(() => nightmare
            .evaluate(page => document.querySelector(page.theSecondComponentName).innerText
              , editBlueprintPage)
          .then((element) => { expectedSecondComponentName = element; }))
          .then(() => nightmare
            .wait(editBlueprintPage.btnTheFirstComponent)
            .click(editBlueprintPage.btnTheFirstComponent)
            .wait(editBlueprintPage.linkPendingChange)
            .wait(editBlueprintPage.btnTheSecondComponent)
            .click(editBlueprintPage.btnTheSecondComponent)
            .wait(page => document.querySelector(page.linkPendingChange).innerText === `2 ${page.labelLinkPendingChange}`
              , editBlueprintPage)
            .wait(editBlueprintPage.btnCommit)
            .click(editBlueprintPage.btnCommit)
            .wait(changesPendingCommitPage.labelLine1PendingChangesComponent)
            .evaluate(page => document.querySelector(page.labelLine1PendingChangesComponent).innerText
              , changesPendingCommitPage))
          .then((element) => {
            // element = acl-2.2.52-15.fc26
            expect(element.split('-')[0]).toBe(expectedSecondComponentName);
          })
          .then(() => nightmare
            .evaluate(page => document.querySelector(page.labelLine2PendingChangesComponent).innerText
              , changesPendingCommitPage))
          .then((element) => {
            // element = acl-2.2.52-15.fc26
            expect(element.split('-')[0]).toBe(expectedFirstComponentName);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec4);
          });
      }, timeout);
    const testSpec5 = test('should not commit by clicking Close button',
      (done) => {
        // Highlight the expected result
        const expected = '1 Pending Change';

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.btnCommit)
          .click(editBlueprintPage.btnCommit)
          .wait(changesPendingCommitPage.btnClose)
          .click(changesPendingCommitPage.btnClose)
          .wait(editBlueprintPage.linkPendingChange)
          .evaluate(page => document.querySelector(page.linkPendingChange).innerText
            , editBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec5);
          });
      }, timeout);
    const testSpec6 = test('should not commit by clicking X button',
      (done) => {
        // Highlight the expected result
        const expected = '1 Pending Change';

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.btnCommit)
          .click(editBlueprintPage.btnCommit)
          .wait(changesPendingCommitPage.btnXClose)
          .click(changesPendingCommitPage.btnXClose)
          .wait(editBlueprintPage.linkPendingChange)
          .evaluate(page => document.querySelector(page.linkPendingChange).innerText
            , editBlueprintPage)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec6);
          });
      }, timeout);
    const testSpec7 = test('should commit changes by clicking Commit button',
      (done) => {
        // Highlight the expected result
        const expected = false;

        nightmare
          .wait(editBlueprintPage.componentListItemRootElement)
          .wait(editBlueprintPage.componentListItemRootElementSelect)
          .click(editBlueprintPage.componentListItemRootElementSelect)
          .wait(editBlueprintPage.btnCommit)
          .click(editBlueprintPage.btnCommit)
          .wait(changesPendingCommitPage.btnCommit)
          .click(changesPendingCommitPage.btnCommit)
          .wait(editBlueprintPage.btnDisabledCommit)
          .exists(editBlueprintPage.linkPendingChange)
          .then((element) => {
            expect(element).toBe(expected);

            coverage(nightmare, done);
          })
          .catch((error) => {
            helper.gotoError(error, nightmare, testSpec7);
          });
      }, timeout);
  });
});
