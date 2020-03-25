import faker from "faker";

import Blueprint from "../components/Blueprint.component";
import blueprintsPage from "../pages/blueprints.page";
import EditPackagesPage from "../pages/EditPackages.page";
import AvailableComponents from "../components/AvailableComponents.component";
import selectedComponents from "../components/selectedComponents.component";
import dependencies from "../components/dependencies.component";
import DetailsComponent from "../components/Details.component";

describe("Edit Blueprint Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const editPackagesPage = new EditPackagesPage(name);

  before(function() {
    browser.newBlueprint(name, description);
    blueprintComponent.editPackagesButton.click();
    editPackagesPage.loading();
  });

  after(function() {
    editPackagesPage.backToBlueprintsPageLink.click();
    blueprintsPage.loading();
    browser.deleteBlueprint(name);
  });

  describe("Sort, Redo and Undo", function() {
    const availableComponent = new AvailableComponents();
    const packageName = "cockpit-bridge";
    before(function() {
      editPackagesPage.filterBox.setInputValue(packageName);
      editPackagesPage.filterBox.sendKey("\uE007");
      editPackagesPage.filterContentLabel.waitForDisplayed(timeout);
      browser.waitUntil(
        () =>
          $(editPackagesPage.filterContentLabel)
            .getText()
            .includes(packageName),
        timeout
      );
      // add package to blueprint
      availableComponent.addPackageByName(packageName).click();
      selectedComponents.loading();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
        timeout
      );
    });

    after(function() {
      availableComponent.removePackageByName(packageName).click();
      selectedComponents.loading();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).indexOf(packageName) === -1,
        timeout
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
      editPackagesPage.sortAscButton.click();
      editPackagesPage.sortDescButton.waitForDisplayed(timeout);
      const sortedArray = selectedComponents.packageList.map(item => item.getText());
      expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
    });

    it("blueprint with reverse order by clicking Z->A sort button", function() {
      const defaultArray = selectedComponents.packageList.map(item => item.getText());
      editPackagesPage.sortDescButton.click();
      editPackagesPage.sortAscButton.waitForDisplayed(timeout);
      const sortedArray = selectedComponents.packageList.map(item => item.getText());
      expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
    });

    it("Redo butto should be disabled", function() {
      expect($('[data-button="redo"]').getAttribute("class")).to.include("disabled");
    });

    it("Undo button should work", function() {
      editPackagesPage.undoButton.click();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).indexOf(packageName) === -1,
        timeout
      );
      expect(selectedComponents.packageList.map(item => item.getText())).to.not.include(packageName);
    });

    it("Undo butto should be disabled", function() {
      expect($('[data-button="undo"]').getAttribute("class")).to.include("disabled");
    });

    it("Redo button should work", function() {
      editPackagesPage.redoButton.click();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
        timeout
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
      browser.waitUntil(
        () =>
          selectedComponents
            .dropDownMenu(removedPackageName)
            .getAttribute("class")
            .includes("open") && selectedComponents.removeItem(removedPackageName).isDisplayed(),
        timeout
      );
      selectedComponents.removeItem(removedPackageName).click();
      $(selectedComponents.containerSelector).waitForExist(timeout, true);
      // add cockpit-bridge into selected component
      if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
        const valueLength = editPackagesPage.filterBox.getAttribute("value").length;
        for (let x = 0; x < valueLength; x++) {
          editPackagesPage.filterBox.sendKey("\uE003");
        }
      }
      editPackagesPage.filterBox.setInputValue(packageName);
      editPackagesPage.filterBox.sendKey("\uE007");
      editPackagesPage.filterContentLabel.waitForDisplayed(timeout);
      browser.waitUntil(
        () =>
          $(editPackagesPage.filterContentLabel)
            .getText()
            .includes(packageName),
        timeout
      );
      // add package to blueprint
      const availableComponent = new AvailableComponents();
      availableComponent.addPackageByName(packageName).click();
      selectedComponents.loading();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
        timeout
      );
    });

    it("The bedge should show the correct selected package number", function() {
      const totalSelectedComponents = selectedComponents.packageList.length;
      expect(editPackagesPage.selectedComponentsTabBadge.getText()).to.equal(totalSelectedComponents.toString());
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
      editPackagesPage.dependenciesTabBadge.click();
    });

    it("The bedge should show the correct selected package number", function() {
      const totalDependencies = dependencies.depencenciesList.length;
      expect(editPackagesPage.dependenciesTabBadge.getText()).to.equal(totalDependencies.toString());
    });
  });

  describe("Component Details", function() {
    const packageName = "tmux";
    const bashComponent = new AvailableComponents();
    const componentDetails = new DetailsComponent(packageName);

    before(function() {
      if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
        const valueLength = editPackagesPage.filterBox.getAttribute("value").length;
        for (let x = 0; x < valueLength; x++) {
          editPackagesPage.filterBox.sendKey("\uE003");
        }
      }
      editPackagesPage.filterBox.setInputValue(packageName);
      editPackagesPage.filterBox.sendKey("\uE007");
      editPackagesPage.filterContentLabel.waitForDisplayed(timeout);
      browser.waitUntil(
        () =>
          $(editPackagesPage.filterContentLabel)
            .getText()
            .includes(packageName),
        timeout
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
    const createImagePage = require("../pages/createImage.page");
    const bashComponent = new AvailableComponents();
    const packageName = "tmux";
    const componentDetails = new DetailsComponent(packageName);

    before(function() {
      if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
        const valueLength = editPackagesPage.filterBox.getAttribute("value").length;
        for (let x = 0; x < valueLength; x++) {
          editPackagesPage.filterBox.sendKey("\uE003");
        }
      }
      editPackagesPage.filterBox.setInputValue(packageName);
      editPackagesPage.filterBox.sendKey("\uE007");
      editPackagesPage.filterContentLabel.waitForDisplayed(timeout);
      browser.waitUntil(
        () =>
          $(editPackagesPage.filterContentLabel)
            .getText()
            .includes(packageName),
        timeout
      );
      bashComponent.nameLabelByName(packageName).click();
      componentDetails.componentOptionsBox.waitForDisplayed(timeout);
      componentDetails.addButton.click();
      browser.waitUntil(
        () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
        timeout
      );
      editPackagesPage.createImageButton.click();
      createImagePage.loading();
    });

    after(function() {
      createImagePage.cancelButton.click();
      $(createImagePage.containerSelector).waitForExist(timeout, true);
    });

    it("should show a correct alert message in Create Image dialog", function() {
      expect(createImagePage.alertMessage.getText().trim()).to.equal(
        "Warning alert:\n" +
          "This blueprint has changes that are not committed. These changes will be committed before the image is created."
      );
    });
  });
});
