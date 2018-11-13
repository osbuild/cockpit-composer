const assert = require('assert');
const config = require('../wdio.conf.js');
const testData = config.testData;

const BlueprintsPage = require('../pages/blueprints');
const EditBlueprintPage = require('../pages/editBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');


describe('Changes Pending Commit Page', () => {
  const editBlueprintPage = new EditBlueprintPage(testData.blueprint.bash.name);
  const changesPendingCommitPage = new ChangesPendingCommitPage();


  beforeEach(() => {
    CreateBlueprintPage.newBlueprint(testData.blueprint.bash, false);
    const blueprintsPage = new BlueprintsPage();
    const blueprintName = testData.blueprint.bash.name;
    const rowSelector = `${blueprintsPage.itemsBlueprint}[data-blueprint="${blueprintName}"]`;

    browser
      .waitForVisible(`${rowSelector} a[href*="edit"]`);

    browser
      .click(`${rowSelector} a[href*="edit"]`);
    $('.cmpsr-list-pf__compacted').waitForText(90000);
  });


  afterEach(() => {
    DeleteBlueprintPage.deleteBlueprint(testData.blueprint.bash.name);
  });


  describe('Edit Blueprint Page', () => {
    // repeat the test twice for both links
    [
      editBlueprintPage.btnCommit,
      editBlueprintPage.linkPendingChange,
    ].forEach((button) => {
      it('should show Pending Changes', () => {
        browser
          .click(button)
          .waitForVisible(changesPendingCommitPage.labelPageTitle);

        const actualText = $(changesPendingCommitPage.labelPageTitle).getText();
        assert.equal(actualText, changesPendingCommitPage.varPageTitle);
      });
    });
  });

  describe('Pending Changes Commit Page', () => {
    beforeEach(() => {
      // bring up the pending changes dialog
      browser
        .click(editBlueprintPage.btnCommit)
        .waitForVisible(changesPendingCommitPage.labelPageTitle);
    });


    it('should show correct pending change content', () => {
      const actualText = $(changesPendingCommitPage.labelLine1PendingChangesAction).getText();
      assert.equal(actualText, 'Added');

      const actualComponent = $(changesPendingCommitPage.labelLine1PendingChangesComponent).getText();
      assert.equal(actualComponent.split('-')[0], 'bash');
    });

    it('should show correct order of pending changes', () => {
      // close the dialog b/c it is already open
      browser.click(changesPendingCommitPage.btnClose);

      browser
        .waitForVisible(editBlueprintPage.componentListItemRootElementSelect);

      // add 1st component to the selection. Note: there's already bash selected
      browser
        .waitForVisible(editBlueprintPage.plusButtonOfTheFirstComponent);

      const firstComponent = $(editBlueprintPage.nameOfTheFirstComponent).getText();

      // browser.click() does not work with Edge due to "Element is Obscured" error.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
      browser.execute((clicked) => {
        document.querySelector(clicked).click();
        return true;
      }, editBlueprintPage.plusButtonOfTheFirstComponent);

      browser
        .waitForVisible(editBlueprintPage.contentSelectedComponents);

      browser
        .waitUntil(() => $(editBlueprintPage.contentSelectedComponents).getText().includes(firstComponent),
          config.config.waitforTimeout);

      // add 2nd component to the selection and wait for depsolve to complete
      browser
        .waitForVisible(editBlueprintPage.plusButtonOfTheSecondComponent);

      const secondComponent = $(editBlueprintPage.nameOfTheSecondComponent).getText();
      browser
        .click(editBlueprintPage.plusButtonOfTheSecondComponent)
        .waitForVisible(editBlueprintPage.contentSelectedComponents);

      browser
        .waitUntil(() => $(editBlueprintPage.contentSelectedComponents).getText().includes(secondComponent),
          config.config.waitforTimeout);

      // bring up the pending changes dialog again by clicking the commit button
      browser
        .click(editBlueprintPage.btnCommit)
        .waitForVisible(changesPendingCommitPage.labelPageTitle);

      // the component added last is at the top of the list
      const actualComponent1 = $(changesPendingCommitPage.labelLine1PendingChangesComponent).getText();
      assert(actualComponent1.includes(secondComponent));
      assert.equal('Added', $(changesPendingCommitPage.labelLine1PendingChangesAction).getText());

      // the second component in the list is the one which was added first
      const actualComponent2 = $(changesPendingCommitPage.labelLine2PendingChangesComponent).getText();
      assert(actualComponent2.includes(firstComponent));
      assert.equal('Added', $(changesPendingCommitPage.labelLine2PendingChangesAction).getText());
    });

    it('should not commit by clicking Close', () => {
      // close the dialog b/c it is already open
      browser.click(changesPendingCommitPage.btnClose);
      // wait until "Changes Pending Commit" dialog fades out
      browser.waitForExist(changesPendingCommitPage.rootElement, config.config.waitforTimeout, true);

      $('.cmpsr-list-pf__compacted').waitForText(90000);

      const blueprintsPage = new BlueprintsPage();
      const blueprintName = testData.blueprint.bash.name;
      const rowSelector = `${blueprintsPage.itemsBlueprint}[data-blueprint="${blueprintName}"]`;

      // browser.click() does not work with Edge due to "Element is Obscured" error.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
      browser.execute((clicked) => {
        document.querySelector(clicked).click();
        return true;
      }, editBlueprintPage.linkBackToBlueprints);

      browser
        .waitForVisible(`${rowSelector} a[href*="edit"]`);

      browser
        .click(`${rowSelector} a[href*="edit"]`);
      $('.cmpsr-list-pf__compacted').waitForText(90000);

      // bring up the pending changes dialog again by clicking the commit button
      browser
        .click(editBlueprintPage.btnCommit)
        .waitForVisible(changesPendingCommitPage.labelPageTitle);

      const actualText = $(changesPendingCommitPage.labelLine1PendingChangesAction).getText();
      assert.equal(actualText, 'Added');

      // there's still a pending commit for the bash component added when the BP
      // was initially created !
      const actualComponent1 = $(changesPendingCommitPage.labelLine1PendingChangesComponent).getText();
      assert.equal(actualComponent1.split('-')[0], 'bash');
    });

    it('should not commit by clicking X buttons', () => {
      // close the dialog b/c it is already open
      browser.click(changesPendingCommitPage.btnXClose);
      // wait until "Changes Pending Commit" dialog fades out
      browser.waitForExist(changesPendingCommitPage.rootElement, config.config.waitforTimeout, true);

      browser
        .waitForVisible(editBlueprintPage.componentListItemRootElementSelect);

      const blueprintsPage = new BlueprintsPage();
      const blueprintName = testData.blueprint.bash.name;
      const rowSelector = `${blueprintsPage.itemsBlueprint}[data-blueprint="${blueprintName}"]`;

      // browser.click() does not work with Edge due to "Element is Obscured" error.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5238133/
      browser.execute((clicked) => {
        document.querySelector(clicked).click();
        return true;
      }, editBlueprintPage.linkBackToBlueprints);

      browser
        .waitForVisible(`${rowSelector} a[href*="edit"]`);

      browser
        .click(`${rowSelector} a[href*="edit"]`);
      $('.cmpsr-list-pf__compacted').waitForText(90000);

      // bring up the pending changes dialog again by clicking the commit button
      browser
        .click(editBlueprintPage.btnCommit)
        .waitForVisible(changesPendingCommitPage.labelPageTitle);

      const actualText = $(changesPendingCommitPage.labelLine1PendingChangesAction).getText();
      assert.equal(actualText, 'Added');

      // there's still a pending commit for the bash component added when the BP
      // was initially created !
      const actualComponent1 = $(changesPendingCommitPage.labelLine1PendingChangesComponent).getText();
      assert.equal(actualComponent1.split('-')[0], 'bash');
    });
  });
});
