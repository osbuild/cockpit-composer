const assert = require('assert');
const helper = require('../utils/helper');
const config = require('../wdio.conf.js');
const testData = config.testData;

const EditBlueprintPage = require('../pages/editBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');


describe('Changes Pending Commit Page', () => {
  const editBlueprintPage = new EditBlueprintPage(testData.blueprint.bash.name);
  const changesPendingCommitPage = new ChangesPendingCommitPage();


  beforeEach(() => {
    CreateBlueprintPage.newBlueprint(testData.blueprint.bash, false);

    helper.goto(editBlueprintPage);

    browser
      .waitForExist(editBlueprintPage.componentListItemRootElement);
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
        .waitForVisible(editBlueprintPage.btnTheFirstComponent);

      const firstComponent = $(editBlueprintPage.theFirstComponentName).getText();
      browser
        .click(editBlueprintPage.btnTheFirstComponent)
        .waitForVisible(editBlueprintPage.contentSelectedComponents);

      browser
        .waitUntil(() => $(editBlueprintPage.contentSelectedComponents).getText().includes(firstComponent),
          config.config.waitforTimeout);

      // add 2nd component to the selection and wait for depsolve to complete
      browser
        .waitForVisible(editBlueprintPage.btnTheSecondComponent);

      const secondComponent = $(editBlueprintPage.theSecondComponentName).getText();
      browser
        .click(editBlueprintPage.btnTheSecondComponent)
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

    // repeat the test twice for each closing button
    [
      changesPendingCommitPage.btnClose,
      changesPendingCommitPage.btnXClose,
    ].forEach((button) => {
      it('should not commit by clicking Close or X buttons', () => {
        // close the dialog b/c it is already open
        browser.click(button);
        // wait until the dialog fades out
        browser
          .waitForVisible(editBlueprintPage.componentListItemRootElementSelect);

        // reload the page
        browser.reload();
        helper.goto(editBlueprintPage)
          .waitForVisible(editBlueprintPage.btnCommit);

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
});
