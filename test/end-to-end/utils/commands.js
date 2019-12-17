const blueprintsPage = require("../pages/blueprints.page");
const createBlueprintPage = require("../pages/createBlueprint.page");
const deleteBlueprintPage = require("../pages/deleteBlueprint.page");
const EditPackagesPage = require("../pages/EditPackages.page");
const Blueprint = require("../components/Blueprint.component");
const AvailableComponents = require("../components/AvailableComponents.component");
const selectedComponents = require("../components/selectedComponents.component");
const pendingCommitPage = require("../pages/pendingCommit.page");
const ToastNotificationPage = require("../pages/ToastNotification.page");

module.exports = {
  element: function() {
    this.waitForDisplayed(timeout, false, `!!!!Cannot locate element ${this}!!!!`);
    return this;
  },

  setInputValue: function(value) {
    // Edge does not work with "setValue"
    // work around https://github.com/webdriverio/webdriverio/issues/3324#issuecomment-460087037
    if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
      browser.elementSendKeys(this.elementId, "", value.split());
    } else {
      this.setValue(value);
    }
  },

  sendKey: function(unicode) {
    if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
      browser.elementSendKeys(this.elementId, "", [unicode]);
    } else {
      browser.elementSendKeys(this.elementId, unicode);
    }
  },

  login: function() {
    const username = process.env.COCKPIT_USERNAME || "root";
    const password = process.env.COCKPIT_PASSWORD || "foobar";

    browser.url("/composer");
    // wait for page loaded
    $('[id="badge"]').waitForDisplayed(timeout);
    // username and password
    $('input[id="login-user-input"]')
      .element()
      .setInputValue(username);
    $('input[id="login-password-input"]')
      .element()
      .setInputValue(password);
    // Always 'Reuse my password'
    if (!browser.execute(() => document.getElementById("authorized-input").checked)) {
        $('[id="authorized-input"]')
          .element()
          .click();
    }
    // "Log In"
    $('button[id="login-button"]')
      .element()
      .click();
  },

  switchToComposerFrame: function() {
    $('iframe[name="cockpit1:localhost/composer"]').waitForDisplayed(timeout);
    let iframe = $('iframe[name="cockpit1:localhost/composer"]');
    // work around for Edge https://github.com/webdriverio/webdriverio/issues/3880
    if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
      iframe = "cockpit1:localhost/composer";
    }
    browser.switchToFrame(iframe);
  },

  startLoraxIfItDoesNotStart: function() {
    if (process.env.TRY_RUN !== "true") {
      try {
        blueprintsPage.serviceStartButton.waitForDisplayed();
        const isAutostart = blueprintsPage.autostartCheckbox.isSelected();
        if (!isAutostart) {
          blueprintsPage.autostartCheckbox.click();
        }
        blueprintsPage.serviceStartButton.click();
        $(blueprintsPage.blueprintListView).waitForExist(timeout * 2);
        blueprintsPage.loading();
      } catch (e) {
        console.error(e);
        blueprintsPage.loading();
      }
    }
  },

  newBlueprint: function(name, description) {
    // on Blueprints page
    blueprintsPage.loading();
    blueprintsPage.createBlueprintButton.click();
    // pop up create blueprint dialog
    createBlueprintPage.loading();
    createBlueprintPage.nameBox.setInputValue(name);
    createBlueprintPage.descriptionBox.setInputValue(description);
    createBlueprintPage.createButton.click();
    // open edit blueprint page
    const editPackagesPage = new EditPackagesPage(name);
    editPackagesPage.loading();
    // make sure new availabe components for new page loaded
    const filterContent = "openssh-server";
    editPackagesPage.filterBox.setInputValue(filterContent);
    editPackagesPage.filterBox.sendKey("\uE007");
    editPackagesPage.filterContentLabel.waitForDisplayed(timeout);
    browser.waitUntil(
      () =>
        $(editPackagesPage.filterContentLabel)
          .getText()
          .includes(filterContent),
      timeout
    );
    const availableComponent = new AvailableComponents();
    availableComponent.addPackageByName(filterContent).click();
    // make sure the package added into selected components
    selectedComponents.loading();
    selectedComponents.packageByName(filterContent).waitForExist(timeout);
    editPackagesPage.commitButton.click();
    // pop up Changes Pending Commit dialog
    pendingCommitPage.loading();
    pendingCommitPage.commitButton.click();
    // wait for Changes Pending Commit dialog fades out
    $(pendingCommitPage.containerSelector).waitForExist(timeout, true);
    // wait for Toast Notification dialog fades out
    const toastNotificationPage = new ToastNotificationPage("committed");
    toastNotificationPage.loading();
    toastNotificationPage.closeButton.click();
    $(toastNotificationPage.containerSelector).waitForExist(timeout, true);
    // go back to Blueprints page by clicking "Back To Blueprints" button
    editPackagesPage.backToBlueprintsPageLink.click();
    blueprintsPage.loading();
  },

  deleteBlueprint: function(name) {
    const blueprintComponent = new Blueprint(name);
    blueprintsPage.loading();
    blueprintComponent.moreDropdownMenu.click();
    blueprintComponent.deleteOption.click();
    deleteBlueprintPage.loading();
    deleteBlueprintPage.deleteButton.waitForClickable();
    // deleteBlueprintPage.deleteButton.click() is not stable enough to close export page
    deleteBlueprintPage.deleteButton.sendKey("\uE007");
    $(deleteBlueprintPage.containerSelector).waitForExist(timeout, true);
    blueprintsPage.loading();
  },

  apiFetchTest: function(endpoint, options = { body: "" }) {
    options.path = endpoint;
    return browser.executeAsync(
      function(endpoint, options, done) {
        const t0 = performance.now();
        const testHttp = cockpit.http("/run/weldr/api.socket", { superuser: "try" });
        testHttp
          .request(options)
          .then(data => done({ success: true, data: data, latency: performance.now() - t0 }))
          .catch(err => done({ success: false, data: err }));
      },
      endpoint,
      options
    );
  }
};
