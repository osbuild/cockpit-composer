const addContext = require("mochawesome/addContext");
const commands = require("../utils/commands");

const blueprintsPage = require("../pages/blueprints.page");
const createBlueprintPage = require("../pages/createBlueprint.page");

describe("Create Blueprints Page", function() {
  let blueprintNameList; // used by duplicated blueprint name checking
  before(function() {
    commands.login();
    commands.startLoraxIfItDoesNotStart();
    blueprintsPage.loading();
    blueprintNameList = $$(blueprintsPage.blueprintListView).map(item => item.getAttribute("data-blueprint"));
  });

  beforeEach(function() {
    blueprintsPage.createBlueprintButton.click();
    createBlueprintPage.loading();
  });

  afterEach(function() {
    const isOpen = browser.isExisting(createBlueprintPage.containerSelector);
    if (isOpen) {
      createBlueprintPage.cancelButton.click();
      browser.waitUntil(
        () => !browser.isExisting(createBlueprintPage.containerSelector),
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

  it("Create button should be disabled when create blueprint dialog does not have name", function() {
    addContext(this, "cannot create blueprint without name");
    createBlueprintPage.createButton.click();
    createBlueprintPage.helpBlock.waitForVisible(timeout);
    expect(createBlueprintPage.createButton.getAttribute("disabled")).to.equal("true");
  });

  it("Create button should be enabled when create blueprint dialog has a valid name", function() {
    const validName = "-_.";
    createBlueprintPage.nameBox.setValue(validName);
    createBlueprintPage.descriptionBox.click();
    expect(createBlueprintPage.createButton.getAttribute("disabled")).to.equal(null);
  });

  describe("Invalid blueprint name help box should display when name contains ", function() {
    const invalidNameWithSpaces = "- _ .";
    const invalidNameWithChar = "-_.$";
    const invalidNameWithChars = "/*-_.";
    const invalidNameWithSpacesAndChar = "-_.= ";
    const invalidNameWithSpacesAndChars = "-_. ! '";

    it("spaces", function() {
      createBlueprintPage.nameBox.setValue(invalidNameWithSpaces);
      createBlueprintPage.helpBlock.waitForVisible(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal("Blueprint names cannot contain spaces.");
    });
    it("an invalid character", function() {
      createBlueprintPage.nameBox.setValue(invalidNameWithChar);
      createBlueprintPage.helpBlock.waitForVisible(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal("Blueprint names cannot contain the character: $");
    });
    it("multiple invalid characters", function() {
      createBlueprintPage.nameBox.setValue(invalidNameWithChars);
      createBlueprintPage.helpBlock.waitForVisible(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal("Blueprint names cannot contain the characters: / *");
    });
    it("spaces or an invalid character", function() {
      createBlueprintPage.nameBox.setValue(invalidNameWithSpacesAndChar);
      createBlueprintPage.helpBlock.waitForVisible(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal(
        "Blueprint names cannot contain spaces or the character: ="
      );
    });
    it("spaces or multiple invalid characters", function() {
      createBlueprintPage.nameBox.setValue(invalidNameWithSpacesAndChars);
      createBlueprintPage.helpBlock.waitForVisible(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal(
        "Blueprint names cannot contain spaces or the characters: ! '"
      );
    });
  });

  it("Duplicated blueprint name help message should be in place", function() {
    // WORKAROUND: issue setValue() doesn't clear input before setting new value
    // https://github.com/webdriverio/webdriverio/issues/1140
    const valueLength = createBlueprintPage.nameBox.getValue().length;
    const backSpaces = new Array(valueLength).fill("Backspace");
    createBlueprintPage.nameBox.setValue([...backSpaces, blueprintNameList[0]]);
    expect(createBlueprintPage.helpBlock.getText()).to.equal(`The name ${blueprintNameList[0]} already exists.`);
  });

  it("Duplicated blueprint name alert message should be in place - pressing enter", function() {
    // WORKAROUND: issue setValue() doesn't clear input before setting new value
    // https://github.com/webdriverio/webdriverio/issues/1140
    const valueLength = createBlueprintPage.nameBox.getValue().length;
    const backSpaces = new Array(valueLength).fill("Backspace");
    createBlueprintPage.nameBox.setValue(backSpaces);
    browser.keys("Enter");
    createBlueprintPage.nameBox.setValue(blueprintNameList[0]);
    browser.keys("Enter");
    expect(createBlueprintPage.alert.getText()).to.equal("Specify a new blueprint name.");
  });

  it("should close by clicking X button", function() {
    createBlueprintPage.clickXButton();
    browser.waitUntil(
      () => !browser.isExisting(createBlueprintPage.containerSelector),
      timeout,
      "Cannot close Create Blueprint dialog"
    );
    expect(!browser.isExisting(createBlueprintPage.containerSelector));
  });
});
