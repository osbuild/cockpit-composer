const addContext = require("mochawesome/addContext");
const commands = require("../utils/commands");

const blueprintsPage = require("../pages/blueprints.page");
const createBlueprintPage = require("../pages/createBlueprint.page");

describe("Create Blueprints Page", function() {
  before(function() {
    commands.login();
  });

  beforeEach(function() {
    blueprintsPage.createBlueprintButton.click();
    createBlueprintPage.loading();
  });

  afterEach(function() {
    const isOpen = browser.getAttribute(createBlueprintPage.containerSelector, "style").includes("display: block;");
    if (isOpen) {
      createBlueprintPage.cancelButton.click();
      browser.waitUntil(
        () => browser.getAttribute(createBlueprintPage.containerSelector, "style").includes("display: none;"),
        timeout,
        "Cannot close Create Blueprint dialog"
      );
    }
  });

  it("Help message should look good", function() {
    createBlueprintPage.nameBox.click();
    createBlueprintPage.descriptionBox.click();
    createBlueprintPage.helpBlock.waitForVisible(timeout);
    expect(createBlueprintPage.helpBlock.getText()).to.equal("A blueprint name is required.");
  });

  it("Alert message should look good - clicking create button", function() {
    addContext(this, "create blueprint without name (clicking create button)");
    createBlueprintPage.nameBox.click();
    createBlueprintPage.createButton.click();
    expect(createBlueprintPage.alert.getText()).to.equal("Required information is missing.");
  });

  it("Alert message should look good - pressing enter", function() {
    addContext(this, "create blueprint without name (pressing enter)");
    createBlueprintPage.nameBox.click();
    browser.keys("Enter");
    expect(createBlueprintPage.alert.getText()).to.equal("Required information is missing.");
  });

  it("should close by clicking X button", function() {
    createBlueprintPage.clickXButton();
    browser.waitUntil(
      () => browser.getAttribute(createBlueprintPage.containerSelector, "style").includes("display: none;"),
      timeout,
      "Cannot close Create Blueprint dialog"
    );
    expect(browser.getAttribute(createBlueprintPage.containerSelector, "style").includes("display: none;")).to.be.true;
  });
});
