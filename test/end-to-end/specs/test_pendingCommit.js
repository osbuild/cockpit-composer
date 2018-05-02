const assert = require('assert');
const helper = require('../utils/helper');
const testData = require('../wdio.conf.js').testData;

const EditBlueprintPage = require('../pages/editBlueprint');
const ChangesPendingCommitPage = require('../pages/changesPendingCommit');
const CreateBlueprintPage = require('../pages/createBlueprint');
const DeleteBlueprintPage = require('../pages/deleteBlueprint');


describe('Changes Pending Commit Page', function() {
  const editBlueprintPage = new EditBlueprintPage(testData.blueprint.simple.name);
  const changesPendingCommitPage = new ChangesPendingCommitPage();


  beforeEach(function() {
    CreateBlueprintPage.newBlueprint(testData.blueprint.simple, false);

    helper.goto(editBlueprintPage);

    browser
      .waitForExist(editBlueprintPage.componentListItemRootElement);
  });


  afterEach(function() {
    DeleteBlueprintPage.deleteBlueprint(testData.blueprint.simple.name);
  });


  describe('Edit Blueprint Page', function() {
    // repeat the test twice for both links
    [
      editBlueprintPage.btnCommit,
      editBlueprintPage.linkPendingChange
    ].forEach(function(button) {
      it('should show Pending Changes', function() {
          browser
            .click(button)
            .waitForVisible(changesPendingCommitPage.labelPageTitle);

          const actualText = $(changesPendingCommitPage.labelPageTitle).getText();
          assert.equal(actualText, changesPendingCommitPage.varPageTitle);
      });
    });
  });

  describe('Pending Changes Commit Page', function() {
    beforeEach(function() {
      // bring up the pending changes dialog
      browser
        .click(editBlueprintPage.btnCommit)
        .waitForVisible(changesPendingCommitPage.labelPageTitle);
    });


    it('should show correct pending change content', function() {
      const actualText = $(changesPendingCommitPage.labelLine1PendingChangesAction).getText();
      assert.equal(actualText, 'Added');

      const actualComponent = $(changesPendingCommitPage.labelLine1PendingChangesComponent).getText();
      assert.equal(actualComponent.split('-')[0], 'httpd');
    });

    it('should show correct order of pending changes', function() {
      // close the dialog b/c it is already open
      browser.click(changesPendingCommitPage.btnClose);

      browser
        .waitForVisible(editBlueprintPage.componentListItemRootElementSelect);

      // add 1st component to the selection. Note: there's already httpd selected
      browser
        .waitForVisible(editBlueprintPage.btnTheFirstComponent);

      browser
        .click(editBlueprintPage.btnTheFirstComponent);

      // add 2nd component to the selection
      browser
        .waitForVisible(editBlueprintPage.btnTheSecondComponent);

      browser
        .click(editBlueprintPage.btnTheSecondComponent);

      // bring up the pending changes dialog again by clicking the commit button
      browser
        .click(editBlueprintPage.btnCommit)
        .waitForVisible(changesPendingCommitPage.labelPageTitle);


      // the component added last is at the top of the list
      const actualComponent1 = $(changesPendingCommitPage.labelLine1PendingChangesComponent).getText();
      assert.equal(actualComponent1.split('-')[0], 'apr');
      //  b/c apr is a dependency of httpd it was actually removed not added
      assert.equal('Removed', $(changesPendingCommitPage.labelLine1PendingChangesAction).getText());

      // the second component is the one which was added first
      const actualComponent2 = $(changesPendingCommitPage.labelLine2PendingChangesComponent).getText();
      assert.equal(actualComponent2.split('-')[0], 'acl');
      assert.equal('Added', $(changesPendingCommitPage.labelLine2PendingChangesAction).getText());
    });

    // repeat the test twice for each closing button
    [
      changesPendingCommitPage.btnClose,
      changesPendingCommitPage.btnXClose
    ].forEach(function(button) {
      it('should not commit by clicking Close or X buttons', function() {
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

        // there's still a pending commit for the httpd component added when the BP
        // was initially created !
        const actualComponent1 = $(changesPendingCommitPage.labelLine1PendingChangesComponent).getText();
        assert.equal(actualComponent1.split('-')[0], 'httpd');
      });
    });

  });
});
