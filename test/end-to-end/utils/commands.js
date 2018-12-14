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
    // generate a random page number between 1 to max page which is fetched from web page
    // Edge returns '\n of xxxx\n', but others return just 'of xxxx'
    const pagination = $(".pagination-cmpsr-pages")
      .getText()
      .replace(/^\s+|\s+$/g, "");
    const totalPage = parseInt(pagination.split(" ")[1], 10);
    // go to a random page by inputing random number and pressing enter key
    const randomPageNum = Math.floor(Math.random() * totalPage) + 1;
    editBlueprintPage.nthPageBox.setValue(randomPageNum);
    browser.keys("Enter");
    // make sure new availabe components for new page loaded
    editBlueprintPage.loading();
    console.log(`Random Page Number: ${randomPageNum}`);
    // add nth package to selected components
    const nth = Math.floor(Math.random() * 50) + 1;
    const availableComponent = new AvailableComponents(nth);
    const packageName = availableComponent.nameLabel.getText();
    const s = ["th", "st", "nd", "rd"];
    const v = nth % 100;
    console.log(`Add the ${nth + (s[(v - 20) % 10] || s[v] || s[0])} package "${packageName}" to blueprint`);
    availableComponent.addPackageByNth();
    // make sure the package added into selected components
    selectedComponents.loading();
    browser.waitUntil(
      () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
      timeout,
      `Cannot add package ${packageName} into blueprint ${name}`
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
