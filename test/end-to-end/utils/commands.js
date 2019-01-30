const loginPage = require("../pages/login.page");
const blueprintsPage = require("../pages/blueprints.page");
const createBlueprintPage = require("../pages/createBlueprint.page");
const deleteBlueprintPage = require("../pages/deleteBlueprint.page");
const EditBlueprintPage = require("../pages/EditBlueprint.page");
const Blueprint = require("../components/Blueprint.component");
const AvailableComponents = require("../components/AvailableComponents.component");
const selectedComponents = require("../components/selectedComponents.component");
const pendingCommitPage = require("../pages/pendingCommit.page");
const ToastNotificationPage = require("../pages/ToastNotification.page");

module.exports = {
  login: function() {
    browser.url("/welder");
    loginPage.loadingCockpitLoginPage();
    loginPage.usernameBox.setValue(loginPage.username);
    loginPage.passwordBox.setValue(loginPage.password);
    // only for non-root user
    loginPage.username !== "root" && loginPage.authorizedCheckbox.click();
    loginPage.loginButton.click();
    // switch to Image Builder frame
    browser.frame(loginPage.imageBuilderIframe);
  },

  newBlueprint: function(name, description) {
    // on Blueprints page
    blueprintsPage.loading();
    blueprintsPage.createBlueprintButton.click();
    // pop up create blueprint dialog
    createBlueprintPage.loading();
    createBlueprintPage.nameBox.setValue(name);
    createBlueprintPage.descriptionBox.setValue(description);
    createBlueprintPage.createButton.click();
    // open edit blueprint page
    const editBlueprintPage = new EditBlueprintPage(name);
    editBlueprintPage.loading();
    browser.keys("Enter");
    // make sure new availabe components for new page loaded
    editBlueprintPage.loading();
    const filterContent = "httpd";
    editBlueprintPage.filterBox.setValue(filterContent);
    browser.keys("Enter");
    browser.waitForExist(editBlueprintPage.filterContentLabel, timeout);
    browser.waitUntil(
      () =>
        $(editBlueprintPage.filterContentLabel)
          .getText()
          .includes(filterContent),
      timeout,
      `Cannot find package - ${filterContent}`
    );
    const availableComponent = new AvailableComponents();
    availableComponent.addPackageByName(filterContent);
    // make sure the package added into selected components
    selectedComponents.loading();
    browser.waitUntil(
      () => selectedComponents.packageList.map(item => item.getText()).includes(filterContent),
      timeout,
      `Cannot add package ${filterContent} into blueprint ${name}`
    );
    editBlueprintPage.commitButton.click();
    // pop up Changes Pending Commit dialog
    pendingCommitPage.loading();
    pendingCommitPage.commit();
    // wait for Changes Pending Commit dialog fades out
    browser.waitForExist(pendingCommitPage.containerSelector, timeout, true);
    // wait for Toast Notification dialog fades out
    const toastNotificationPage = new ToastNotificationPage("committed");
    toastNotificationPage.loading();
    toastNotificationPage.close();
    browser.waitForExist('[id="cmpsr-toast-0"]', timeout, true);
    // go back to Blueprints page by clicking "Back To Blueprints" button
    editBlueprintPage.backToBlueprintsPage();
    blueprintsPage.loading();
  },

  deleteBlueprint: function(name) {
    const blueprintComponent = new Blueprint(name);
    blueprintsPage.loading();
    blueprintComponent.moreDropdownMenu.click();
    blueprintComponent.deleteOption.click();
    deleteBlueprintPage.loading();
    deleteBlueprintPage.deleteButton.click();
    browser.waitForExist(deleteBlueprintPage.containerSelector, timeout, true);
  }
};
