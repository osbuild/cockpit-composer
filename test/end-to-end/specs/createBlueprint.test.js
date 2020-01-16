import blueprintsPage from "../pages/blueprints.page";
import createBlueprintPage from "../pages/createBlueprint.page";

describe("Create Blueprints Page", function() {
  let blueprintNameList; // used by duplicated blueprint name checking
  before(function() {
    blueprintsPage.loading();
    blueprintNameList = $$(blueprintsPage.blueprintListView).map(item => item.getAttribute("data-blueprint"));
  });

  beforeEach(function() {
    blueprintsPage.createBlueprintButton.click();
    createBlueprintPage.loading();
  });

  afterEach(function() {
    // "should close by clicking X button" case will close the Create Blueprint dialog
    // afterEach will not have dialog to close, and go to cache block
    try {
      $(createBlueprintPage.containerSelector).waitForDisplayed(5000);
      createBlueprintPage.cancelButton.click();
      $(createBlueprintPage.containerSelector).waitForExist(timeout, true);
      blueprintsPage.loading();
    } catch (e) {
      console.error(e);
      blueprintsPage.loading();
    }
  });

  it("Help message should look good", function() {
    createBlueprintPage.nameBox.click();
    createBlueprintPage.descriptionBox.click();
    createBlueprintPage.helpBlock.waitForDisplayed(timeout);
    expect(createBlueprintPage.helpBlock.getText()).to.equal("A blueprint name is required.");
  });

  it("Create button should be disabled when create blueprint dialog does not have name", function() {
    createBlueprintPage.createButton.click();
    createBlueprintPage.helpBlock.waitForDisplayed(timeout);
    expect(createBlueprintPage.createButton.getAttribute("disabled")).to.equal("true");
  });

  it("Create button should be enabled without a help box notification when create blueprint dialog has a valid name", function() {
    const validName = "-_.";
    createBlueprintPage.nameBox.setInputValue(validName);
    $(createBlueprintPage.helpBlockSelector).waitForDisplayed(timeout, true);
    expect(createBlueprintPage.createButton.getAttribute("disabled")).to.equal(null);
  });

  describe("Invalid blueprint name help box should display when name contains ", function() {
    const invalidNameWithSpaces = "- _ .";
    const invalidNameWithChar = "-_.$";
    const invalidNameWithChars = "/*-_.";
    const invalidNameWithSpacesAndChar = "-_.= ";
    const invalidNameWithSpacesAndChars = "-_. ! '";

    it("spaces", function() {
      createBlueprintPage.nameBox.setInputValue(invalidNameWithSpaces);
      createBlueprintPage.helpBlock.waitForDisplayed(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal("Blueprint names cannot contain spaces.");
    });
    it("an invalid character", function() {
      createBlueprintPage.nameBox.setInputValue(invalidNameWithChar);
      createBlueprintPage.helpBlock.waitForDisplayed(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal("Blueprint names cannot contain the character: $");
    });
    it("multiple invalid characters", function() {
      createBlueprintPage.nameBox.setInputValue(invalidNameWithChars);
      createBlueprintPage.helpBlock.waitForDisplayed(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal("Blueprint names cannot contain the characters: / *");
    });
    it("spaces or an invalid character", function() {
      createBlueprintPage.nameBox.setInputValue(invalidNameWithSpacesAndChar);
      createBlueprintPage.helpBlock.waitForDisplayed(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal(
        "Blueprint names cannot contain spaces or the character: ="
      );
    });
    it("spaces or multiple invalid characters", function() {
      createBlueprintPage.nameBox.setInputValue(invalidNameWithSpacesAndChars);
      createBlueprintPage.helpBlock.waitForDisplayed(timeout);
      expect(createBlueprintPage.helpBlock.getText()).to.equal(
        "Blueprint names cannot contain spaces or the characters: ! '"
      );
    });
  });

  it("Duplicated blueprint name help message should be in place", function() {
    createBlueprintPage.nameBox.setInputValue(blueprintNameList[0]);
    expect(createBlueprintPage.helpBlock.getText()).to.equal(`The name ${blueprintNameList[0]} already exists.`);
  });

  it("Duplicated blueprint name alert message should be in place - pressing enter", function() {
    createBlueprintPage.nameBox.setInputValue(blueprintNameList[0]);
    createBlueprintPage.nameBox.sendKey("\uE007");
    expect(createBlueprintPage.alert.getText()).to.equal("Specify a new blueprint name.");
  });

  it("should close by clicking X button", function() {
    createBlueprintPage.xButton.waitForClickable();
    // createBlueprintPage.xButton.click() is not stable enough to close create blueprint page
    createBlueprintPage.xButton.sendKey("\uE007");
    $(createBlueprintPage.containerSelector).waitForExist(timeout, true);
  });
});
