const faker = require("faker");
const commands = require("../utils/commands");

const Blueprint = require("../components/Blueprint.component");
const blueprintsPage = require("../pages/blueprints.page");
const EditBlueprintPage = require("../pages/EditBlueprint.page");
const AvailableComponents = require("../components/AvailableComponents.component");
const selectedComponents = require("../components/selectedComponents.component");
const dependencies = require("../components/dependencies.component");
const DetailsComponent = require("../components/Details.component");

describe("Edit Blueprint Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const editBlueprintPage = new EditBlueprintPage(name);

  before(function() {
    commands.login();
    commands.newBlueprint(name, description);
    blueprintComponent.editBlueprintButton.click();
    editBlueprintPage.loading();
  });

  after(function() {
    editBlueprintPage.backToBlueprintsPage();
    blueprintsPage.loading();
    commands.deleteBlueprint(name);
    blueprintsPage.loading();
  });

  describe("Sort, Redo and Undo", function() {
    const availableComponent = new AvailableComponents();
    const packageName = "cockpit-bridge";
    before(function() {
      editBlueprintPage.filterBox.setValue(packageName);
      browser.keys("Enter");
      browser.waitForExist(editBlueprintPage.filterContentLabel, timeout);
      browser.waitUntil(
        () =>
          $(editBlueprintPage.filterContentLabel)
            .getText()
            .includes(packageName),
        timeout,
        `Cannot find package - ${packageName}`
      );
      // add package to blueprint
      availableComponent.addPackageByName(packageName);
      selectedComponents.loading();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
        timeout,
        `Cannot add package ${packageName} into blueprint ${name}`
      );
    });

    after(function() {
      availableComponent.removePackageByName(packageName);
      selectedComponents.loading();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).indexOf(packageName) === -1,
        timeout,
        `Cannot add package ${packageName} into blueprint ${name}`
      );
    });

    it("should have correct order by default sort rule", function() {
      const defaultArray = selectedComponents.packageList.map(item => item.getText());
      // make a copy of default Array
      const sortedArray = [...defaultArray].sort();
      expect(defaultArray.every((value, index) => value === sortedArray[index])).to.be.true;
    });

    it("blueprint with reverse order by clicking A->Z sort button", function() {
      const defaultArray = selectedComponents.packageList.map(item => item.getText());
      editBlueprintPage.sortAscButton.click();
      editBlueprintPage.sortDescButton.waitForVisible(timeout);
      const sortedArray = selectedComponents.packageList.map(item => item.getText());
      expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
    });

    it("blueprint with reverse order by clicking Z->A sort button", function() {
      const defaultArray = selectedComponents.packageList.map(item => item.getText());
      editBlueprintPage.sortDescButton.click();
      editBlueprintPage.sortAscButton.waitForVisible(timeout);
      const sortedArray = selectedComponents.packageList.map(item => item.getText());
      expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
    });

    it("Redo butto should be disabled", function() {
      expect(browser.getAttribute('[data-button="redo"]', "class")).to.include("disabled");
    });

    it("Undo button should work", function() {
      editBlueprintPage.undoButton.click();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).indexOf(packageName) === -1,
        timeout,
        `Cannot add package ${packageName} into blueprint ${name}`
      );
      expect(selectedComponents.packageList.map(item => item.getText())).to.not.include(packageName);
    });

    it("Undo butto should be disabled", function() {
      expect(browser.getAttribute('[data-button="undo"]', "class")).to.include("disabled");
    });

    it("Redo button should work", function() {
      editBlueprintPage.redoButton.click();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
        timeout,
        `Cannot add package ${packageName} into blueprint ${name}`
      );
      expect(selectedComponents.packageList.map(item => item.getText())).to.include(packageName);
    });
  });

  describe("Selected Components Tab", function() {
    const packageName = "bash";
    before(function() {
      // get package name which will be removed
      const removedPackageName = selectedComponents.packageNameByNth(0);
      // remove added package
      selectedComponents.moreButtonByName(removedPackageName).click();
      browser.keys("ArrowDown"); // View
      browser.keys("ArrowDown"); // Edit
      browser.keys("ArrowDown"); // Remove
      browser.keys("Enter");
      // add cockpit-bridge into selected component
      editBlueprintPage.filterBox.setValue(packageName);
      browser.keys("Enter");
      browser.waitForExist(editBlueprintPage.filterContentLabel, timeout);
      browser.waitUntil(
        () =>
          $(editBlueprintPage.filterContentLabel)
            .getText()
            .includes(packageName),
        timeout,
        `Cannot find package - ${packageName}`
      );
      // add package to blueprint
      const availableComponent = new AvailableComponents();
      availableComponent.addPackageByName(packageName);
      selectedComponents.loading();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
        timeout,
        `Cannot add package ${packageName} into blueprint ${name}`
      );
    });

    it("The bedge should show the correct selected package number", function() {
      const totalSelectedComponents = selectedComponents.packageList.length;
      expect(editBlueprintPage.selectedComponentsTabBadge.getText()).to.equal(totalSelectedComponents.toString());
    });

    describe("Component expansion test", function() {
      before(function() {
        selectedComponents.angleRightButton(packageName).click();
        selectedComponents.loadingComponentExpansion(packageName);
      });

      after(function() {
        selectedComponents.angleDownButton(packageName).click();
        selectedComponents.loadingComponentCollapse(packageName);
      });

      it('should expand compotent and have "Show All" link', function() {
        expect(selectedComponents.showAllLink(packageName).getText()).to.equal("Show All");
      });

      it('should change to "Show Less" link by clicking "Show All" link', function() {
        selectedComponents.showAllLink(packageName).click();
        expect(selectedComponents.showLessLink(packageName).getText()).to.equal("Show Less");
      });

      it("should show all dependencies by clicking Show All link", function() {
        const totalDeps = selectedComponents.componentDependenciesBadge(packageName).getText();
        expect(selectedComponents.componentDependenciesList(packageName).length.toString()).to.equal(totalDeps);
      });

      it('should change to "Show All" link by clicking "Show Less" link', function() {
        selectedComponents.showLessLink(packageName).click();
        expect(selectedComponents.showLessLink(packageName).getText()).to.equal("Show All");
      });
    });
  });

  describe("Dependencies Tab", function() {
    before(function() {
      editBlueprintPage.dependenciesTabBadge.click();
    });

    it("The bedge should show the correct selected package number", function() {
      const totalDependencies = dependencies.depencenciesList.length;
      expect(editBlueprintPage.dependenciesTabBadge.getText()).to.equal(totalDependencies.toString());
    });
  });

  describe("Component Details", function() {
    const packageName = "sudo";
    const bashComponent = new AvailableComponents();
    const componentDetails = new DetailsComponent(packageName);

    before(function() {
      editBlueprintPage.filterBox.setValue(packageName);
      browser.keys("Enter");
      browser.waitForExist(editBlueprintPage.filterContentLabel, timeout);
      browser.waitUntil(
        () =>
          $(editBlueprintPage.filterContentLabel)
            .getText()
            .includes(packageName),
        timeout,
        `Cannot find package - ${packageName}`
      );
      bashComponent.nameLabelByName(packageName).click();
      browser.waitUntil(() => componentDetails.componentDescriptionLabel.getText() !== "", timeout);
    });

    it("Should show correct component name", function() {
      expect(componentDetails.componentNameLabel.getText().trim()).to.equal(packageName);
    });

    it("Should show correct component description", function() {
      const availableComponent = new AvailableComponents();
      expect(componentDetails.componentDescriptionLabel.getText()).to.equal(
        availableComponent.descriptionLabelByName(packageName).getText()
      );
    });

    it("Dependencies tab badge should show correct total dependent package number", function() {
      componentDetails.dependenciesNumberBadge.click();
      const totalDependencies = componentDetails.depencenciesList.length;
      expect(componentDetails.dependenciesNumberBadge.getText()).to.equal(totalDependencies.toString());
    });

    it(`should have a correct back to ${name} link`, function() {
      expect(componentDetails.backToLink.getText()).to.equal(`Back to ${name}`);
    });

    it(`should go back to selected component tab by clicking Back to ${name}`, function() {
      componentDetails.backToLink.click();
      selectedComponents.loading();
      expect($(selectedComponents.containerSelector).isExisting()).to.be.true;
    });
  });

  describe("Commit and Create", function() {
    const CreateImagePage = require("../pages/CreateImage.page");
    const createImagePage = new CreateImagePage(name);
    const bashComponent = new AvailableComponents();
    const packageName = "sudo";
    const componentDetails = new DetailsComponent(packageName);

    before(function() {
      editBlueprintPage.filterBox.setValue(packageName);
      browser.keys("Enter");
      browser.waitForExist(editBlueprintPage.filterContentLabel, timeout);
      browser.waitUntil(
        () =>
          $(editBlueprintPage.filterContentLabel)
            .getText()
            .includes(packageName),
        timeout,
        `Cannot find package - ${packageName}`
      );
      bashComponent.nameLabelByName(packageName).click();
      browser.waitUntil(() => componentDetails.componentDescriptionLabel.getText() !== "", timeout);
      componentDetails.addButton.click();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
        timeout,
        `Cannot add package ${packageName} into blueprint`
      );
      editBlueprintPage.createImageButton.click();
      createImagePage.loading();
    });

    after(function() {
      createImagePage.cancelButton.click();
      browser.waitForExist(createImagePage.containerSelector, timeout, true);
    });

    it("should show a correct alert message in Create Image dialog", function() {
      expect(createImagePage.alertMessage.getText().trim()).to.equal(
        "This blueprint has changes that are not committed. These changes will be committed before the image is created."
      );
    });
  });
});
