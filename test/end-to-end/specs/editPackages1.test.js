import faker from "faker";

import Blueprint from "../components/Blueprint.component";
import blueprintsPage from "../pages/blueprints.page";
import EditPackagesPage from "../pages/EditPackages.page";
import AvailableComponents from "../components/AvailableComponents.component";
import selectedComponents from "../components/selectedComponents.component";

describe("Edit Blueprint Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const editPackagesPage = new EditPackagesPage(name);

  after(function() {
    browser.deleteBlueprint(name);
  });

  describe("Run test on a new blueprint", function() {
    before(function() {
      browser.newBlueprint(name, description);
      blueprintComponent.editPackagesButton.click();
      editPackagesPage.loading();
    });

    after(function() {
      editPackagesPage.backToBlueprintsPageLink.click();
      blueprintsPage.loading();
    });

    describe("Page element checking", function() {
      it(`blueprint link should be linked to "#/blueprint/${name}"`, function() {
        // href attribute retruns: https://localhost:9090/cockpit/
        // $5d3f0c4e73267bcf41ad3452b142173cba11c63a2ebcd1ee50a02441ebf9d8eb/welder/index.html#/blueprint/example-atlas
        expect(editPackagesPage.blueprintNameLink.getAttribute("href")).to.include(`#/blueprint/${name}`);
      });

      it("pending changes should not exist by default", function() {
        expect(editPackagesPage.pendingChangeLink.isExisting()).to.be.false;
      });

      it(`title should be blueprint name "${name}"`, function() {
        expect(editPackagesPage.blueprintNameLabel.getText()).to.equal(name);
      });

      it("Commit button should be disabled by default", function() {
        expect(editPackagesPage.commitButton.getAttribute("class")).to.include("disabled");
      });

      it("Discard Changes button should be disabled by default", function() {
        expect(editPackagesPage.discardChangeButton.getAttribute("class")).to.include("disabled");
      });

      it("> button should work", function() {
        const pageNumber = editPackagesPage.nthPageBox.getAttribute("value");
        editPackagesPage.nextButton.click();
        editPackagesPage.loading();
        expect(parseInt(editPackagesPage.nthPageBox.getAttribute("value"), 10)).to.equal(parseInt(pageNumber, 10) + 1);
      });

      it("< button should work", function() {
        const pageNumber = editPackagesPage.nthPageBox.getAttribute("value");
        editPackagesPage.previousButton.click();
        editPackagesPage.loading();
        expect(parseInt(editPackagesPage.nthPageBox.getAttribute("value"), 10)).to.equal(parseInt(pageNumber, 10) - 1);
      });
    });

    describe("Filter test", function() {
      const filterContent = "cockpit-bridge";
      const filterLabel = `Name: ${filterContent}`;
      beforeEach(function() {
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
      });

      it(`Filtered package name should contain "${filterContent}" and should be cleared by clicking "Clear All Filter" link`, function() {
        const packageNameList = editPackagesPage.packageList.map(item => item.getText());
        expect(packageNameList)
          .to.be.an("array")
          .that.includes(filterContent);
        // another test on clear filter
        editPackagesPage.clearAllFiltersLink.click();
        editPackagesPage.loading();
        expect(editPackagesPage.filterContentLabel.isExisting()).to.be.false;
      });

      it(`Filter content label should be "${filterLabel}" and should be cleared by clicking X button`, function() {
        expect(editPackagesPage.filterContentLabel.getText()).to.equal(filterLabel);
        // another test on clear filter
        editPackagesPage.xLabelButton.click();
        editPackagesPage.loading();
        expect(editPackagesPage.filterContentLabel.isExisting()).to.be.false;
      });
    });

    describe("Package icon", function() {
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
      });

      after(function() {
        availableComponent.removePackageByName(packageName).click();
        selectedComponents.loading();
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).indexOf(packageName) === -1,
          timeout
        );
      });

      it("Unselected package icon should not have blue border", function() {
        expect(availableComponent.iconByName(packageName).getAttribute("class")).to.not.include(
          "list-pf-icon-bordered"
        );
      });

      it("Selected package icon should have blue border", function() {
        // add package to blueprint
        availableComponent.addPackageByName(packageName).click();
        selectedComponents.loading();
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
          timeout
        );
        // icon should be blue bordered
        expect(availableComponent.iconByName(packageName).getAttribute("class")).to.include("list-pf-icon-bordered");
      });
    });

    describe("Create Image button test", function() {
      const createImagePage = require("../pages/createImage.page");
      beforeEach(function() {
        editPackagesPage.createImageButton.click();
        createImagePage.loading();
      });

      afterEach(function() {
        createImagePage.cancelButton.click();
        $(createImagePage.containerSelector).waitForExist(timeout, true);
      });

      it("Create Image dialog should pop up", function() {
        expect($(createImagePage.containerSelector).isExisting()).to.be.true;
      });
    });

    describe("Export dropdown item test", function() {
      const exportPage = require("../pages/export.page");
      beforeEach(function() {
        editPackagesPage.moreButton.click();
        browser.waitUntil(
          () =>
            editPackagesPage.dropDownMenu.getAttribute("class").includes("open") &&
            editPackagesPage.exportItem.isDisplayed(),
          timeout
        );
        editPackagesPage.exportItem.click();
        exportPage.loading();
      });

      afterEach(function() {
        exportPage.closeButton.waitForClickable();
        exportPage.closeButton.click();
        $(exportPage.containerSelector).waitForExist(timeout, true);
      });

      it("Export dialog should pop up", function() {
        expect($(exportPage.containerSelector).isExisting()).to.be.true;
      });
    });

    describe("Pending Commit", function() {
      const pendingCommitPage = require("../pages/pendingCommit.page");
      let removedPackageName, addedPackageName;
      before(function() {
        // get package name which will be removed
        removedPackageName = selectedComponents.packageNameByNth(0);
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
        // add a new package
        const availableComponent = new AvailableComponents(1);
        addedPackageName = availableComponent.nameLabel.getText();
        availableComponent.addPackageByNth.click();
        // make sure the package added into selected components
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).includes(addedPackageName),
          timeout
        );
      });

      after(function() {
        editPackagesPage.discardChangeButton.click();
        browser.waitUntil(
          () => editPackagesPage.discardChangeButton.getAttribute("class").includes("disabled"),
          timeout
        );
      });

      describe("Page element checking", function() {
        it("should show pending changes", function() {
          expect(editPackagesPage.pendingChangeLink.isExisting()).to.be.true;
        });

        it('should show "2 Pending Changes"', function() {
          expect(editPackagesPage.pendingChangeLink.getText()).to.equal("2 Pending Changes");
        });

        it("Commit button should be enabled", function() {
          expect(editPackagesPage.commitButton.getAttribute("class")).to.not.include("disabled");
        });

        it("Discard Changes button should enabled", function() {
          expect(editPackagesPage.discardChangeButton.getAttribute("class")).to.not.include("disabled");
        });
      });

      describe("Changes Pending Commit Page", function() {
        before(function() {
          editPackagesPage.pendingChangeLink.click();
          pendingCommitPage.loading();
        });

        after(function() {
          pendingCommitPage.closeButton.click();
          $(pendingCommitPage.containerSelector).waitForExist(timeout, true);
        });

        it('info message should be "Only changes to selected components are shown."', function() {
          expect(pendingCommitPage.infoMessage.getText()).to.equal("Only changes to selected components are shown.");
        });

        it("should show correct blueprint name", function() {
          expect(pendingCommitPage.blueprintNameLabel.getText()).to.include(name);
        });

        it("change log list should have 2 items", function() {
          expect(pendingCommitPage.changeLogList).to.have.lengthOf(2);
        });

        it('the 1st change action should be "Added" in change list', function() {
          expect(pendingCommitPage.actionNameOnNth(0)).to.equal("Added");
        });

        it(`the 1st changed package name should be "${addedPackageName}" in change list`, function() {
          expect(pendingCommitPage.changedPackageNameOnNth(0)).to.include(addedPackageName);
        });

        it('the 2nd change action should be "Removed" in change list', function() {
          expect(pendingCommitPage.actionNameOnNth(1)).to.equal("Removed");
        });

        it(`the 2nd changed package name should be "${removedPackageName}" in change list`, function() {
          expect(pendingCommitPage.changedPackageNameOnNth(1)).to.include(removedPackageName);
        });

        it("should not commit changes if not clicking Commit button", function() {
          // not commit changes
          pendingCommitPage.xButton.click();
          $(pendingCommitPage.containerSelector).waitForExist(timeout, true);
          // go back to blueprints page
          editPackagesPage.backToBlueprintsPageLink.click();
          blueprintsPage.loading();
          // go to edit blueprint page again
          blueprintComponent.editPackagesButton.click();
          editPackagesPage.loading();
          editPackagesPage.commitButton.click();
          // pop up Changes Pending Commit dialog
          pendingCommitPage.loading();
          // still have to pending changes here
          expect(pendingCommitPage.changeLogList).to.have.lengthOf(2);
        });
      });
    });
  });
});
