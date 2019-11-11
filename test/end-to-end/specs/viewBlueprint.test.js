import faker from "faker";

import Blueprint from "../components/Blueprint.component";
import blueprintsPage from "../pages/blueprints.page";
import ViewBlueprintPage from "../pages/ViewBlueprint.page";

describe("View Blueprint Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const viewBlueprintPage = new ViewBlueprintPage(name, description);

  after(function() {
    browser.deleteBlueprint(name);
  });

  describe("Run test on a new blueprint", function() {
    before(function() {
      browser.newBlueprint(name, description);
      blueprintComponent.blueprintNameLink.click();
      viewBlueprintPage.loading();
    });

    after(function() {
      viewBlueprintPage.backToBlueprintsLink.click();
      blueprintsPage.loading();
    });

    describe("Page element checking", function() {
      it(`blueprint name in navigation bar should be "${name}"`, function() {
        expect(viewBlueprintPage.navigationBlueprintNameLabel.getText()).to.equal(name);
      });

      it(`blueprint name in header should be "${name}"`, function() {
        expect(viewBlueprintPage.headerBlueprintNameLabel.getText()).to.equal(name);
      });

      it(`blueprint description in header should be "${description}"`, function() {
        expect(viewBlueprintPage.headerBlueprintDescriptionLabel.getText()).to.equal(description);
      });

      it('"Customizations" tab should be active by default', function() {
        expect(viewBlueprintPage.customizationsTab.getAttribute("aria-selected")).to.equal("true");
      });
    });

    describe('"Customizations" tab', function() {
      it(`blueprint description under "Customizations" tab should be "${description}"`, function() {
        expect(viewBlueprintPage.customizationsTabBlueprintDescriptionLabel.getText()).to.equal(description);
      });

      it("hostname should be added", function() {
        const hostname = faker.lorem.slug();
        viewBlueprintPage.editHostnameButton.click();
        viewBlueprintPage.hostnameInputBox.setInputValue(hostname);
        viewBlueprintPage.okHostnameButton.click();
        // UI should get updated
        expect(viewBlueprintPage.customizationsTabHostnameLabel(hostname).getText()).to.equal(hostname);

        // get dependencies from API
        const endpoint = `/api/v0/blueprints/info/${name}`;
        const result = browser.apiFetchTest(endpoint);
        // result looks like:
        // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L66
        const result_hostname = JSON.parse(result.data).blueprints[0].customizations.hostname;
        // new hostname should be stored
        expect(result_hostname).to.equal(hostname);
      });

      it("hostname should be updated", function() {
        const hostname = faker.lorem.slug();
        viewBlueprintPage.editHostnameButton.click();
        viewBlueprintPage.hostnameInputBox.setInputValue(hostname);
        viewBlueprintPage.okHostnameButton.click();
        // UI should get updated
        expect(viewBlueprintPage.customizationsTabHostnameLabel(hostname).getText()).to.equal(hostname);

        // get dependencies from API
        const endpoint = `/api/v0/blueprints/info/${name}`;
        const result = browser.apiFetchTest(endpoint);
        // result looks like:
        // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L66
        const result_hostname = JSON.parse(result.data).blueprints[0].customizations.hostname;
        // new hostname should be stored
        expect(result_hostname).to.equal(hostname);
      });

      it("hostname should not get updated by clicking X button", function() {
        // set a new hostname in this test
        const hostname = faker.lorem.slug();
        viewBlueprintPage.editHostnameButton.click();
        viewBlueprintPage.hostnameInputBox.setInputValue(hostname);
        viewBlueprintPage.okHostnameButton.click();
        // update hostname and click X button
        viewBlueprintPage.editHostnameButton.click();
        viewBlueprintPage.hostnameInputBox.setInputValue(faker.lorem.slug());
        viewBlueprintPage.cancelHostnameButton.click();
        // UI should get updated
        expect(viewBlueprintPage.customizationsTabHostnameLabel(hostname).getText()).to.equal(hostname);
      });

      it("disable OK button and show error input box if hostname has invalid character", function() {
        viewBlueprintPage.editHostnameButton.click();
        // input ?, invalid hostname character
        viewBlueprintPage.hostnameInputBox.setInputValue("?");
        // OK button should be disabled
        expect(viewBlueprintPage.okHostnameButton.getAttribute("type")).to.equal("button");
        expect(viewBlueprintPage.okHostnameButton.getAttribute("disabled")).to.equal("true");
        // input box should be an error box
        expect($('[data-form="hostname"]').getAttribute("class")).to.include("has-error");
        // cancel edit to clear environment
        viewBlueprintPage.cancelHostnameButton.click();
      });
    });

    describe("Edit description", function() {
      const editDescriptionPage = require("../pages/editDescription.page");
      it("should show correct description", function() {
        viewBlueprintPage.moreButton.click();
        viewBlueprintPage.editDescriptionItem.click();
        editDescriptionPage.loading();
        expect(editDescriptionPage.descriptionInputBox.getAttribute("value")).to.equal(description);
        editDescriptionPage.cancelButton.click();
        $(editDescriptionPage.containerSelector).waitForExist(timeout, true);
      });

      it("should not update blueprint description after clicking X button", function() {
        viewBlueprintPage.moreButton.click();
        viewBlueprintPage.editDescriptionItem.click();
        editDescriptionPage.loading();

        const newDescription = faker.lorem.sentence();
        if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
          const valueLength = editDescriptionPage.descriptionInputBox.getAttribute("value").length;
          for (let x = 0; x < valueLength; x++) {
            editDescriptionPage.descriptionInputBox.sendKey("\uE003");
          }
        }
        editDescriptionPage.descriptionInputBox.setInputValue(newDescription);
        editDescriptionPage.xButton.click();
        $(editDescriptionPage.containerSelector).waitForExist(timeout, true);
        expect(viewBlueprintPage.headerBlueprintDescriptionLabel.getText()).to.equal(description);
      });

      it("should update blueprint description after apply", function() {
        viewBlueprintPage.headerBlueprintDescriptionLabel.click();
        editDescriptionPage.loading();

        const newDescription = faker.lorem.sentence();
        if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
          const valueLength = editDescriptionPage.descriptionInputBox.getAttribute("value").length;
          for (let x = 0; x < valueLength; x++) {
            editDescriptionPage.descriptionInputBox.sendKey("\uE003");
          }
        }
        editDescriptionPage.descriptionInputBox.setInputValue(newDescription);
        editDescriptionPage.saveButton.click();
        $(editDescriptionPage.containerSelector).waitForExist(timeout, true);
        expect(viewBlueprintPage.headerBlueprintDescriptionLabel.getText()).to.equal(newDescription);
      });
    });

    describe("Edit Blueprint", function() {
      const EditPackagesPage = require("../pages/EditPackages.page");
      const editPackagesPage = new EditPackagesPage(name);

      before(function() {
        viewBlueprintPage.editPackagesButton.click();
        editPackagesPage.loading();
      });

      after(function() {
        editPackagesPage.blueprintNameLink.click();
        viewBlueprintPage.loading();
      });

      it("should go to Edit Blueprint page by clicking Edit Blueprint button", function() {
        expect(editPackagesPage.blueprintNameLabel.getText()).to.equal(name);
      });
    });

    describe("Export Blueprint", function() {
      const exportPage = require("../pages/export.page");
      it("should copy correct blueprint manifest", function() {
        viewBlueprintPage.moreButton.click();
        viewBlueprintPage.exportItem.click();
        exportPage.loading();
        // getText() does not work here on Edge, but works on Firefox and Chrome
        // the copied content should replace '\n' with space because
        // the text in blueprint description box does not include '\n', but space
        let blueprintManifest;
        if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
          blueprintManifest = exportPage.contentsTextarea.getAttribute("value").replace(/\n/g, " ");
        } else {
          blueprintManifest = exportPage.contentsTextarea.getText().replace(/\n/g, " ");
        }
        exportPage.copyButton.waitForClickable(timeout);
        exportPage.copyButton.click();
        exportPage.closeButton.click();
        $(exportPage.containerSelector).waitForExist(timeout, true);

        // back to view blueprint page for pasting
        viewBlueprintPage.packagesTab.click();
        // paste blueprint manifest here to test copy function
        viewBlueprintPage.selectedComponentFilter.click();
        if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
          browser.elementSendKeys(viewBlueprintPage.selectedComponentFilter.elementId, "", ["\uE009", "v"]);
        } else {
          viewBlueprintPage.selectedComponentFilter.setValue(["Control", "v"]);
        }
        browser.waitUntil(() => viewBlueprintPage.selectedComponentFilter.getAttribute("value") !== "", timeout);
        expect(viewBlueprintPage.selectedComponentFilter.getAttribute("value")).to.equal(blueprintManifest);
      });
    });
  });
});
