const faker = require("faker");
const addContext = require("mochawesome/addContext");
const commands = require("../utils/commands");
const wdioConfig = require("../wdio.conf.js");

const Blueprint = require("../components/Blueprint.component");
const blueprintsPage = require("../pages/blueprints.page");
const ViewBlueprintPage = require("../pages/ViewBlueprint.page");

describe("View Blueprint Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const viewBlueprintPage = new ViewBlueprintPage(name, description);

  before(function() {
    commands.login();
    commands.startLoraxIfItDoesNotStart();
  });

  after(function() {
    commands.deleteBlueprint(name);
    blueprintsPage.loading();
  });

  describe("Run test on a new blueprint", function() {
    before(function() {
      addContext(this, `create new blueprint with name, ${name}, and description, ${description}`);
      commands.newBlueprint(name, description);
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
        viewBlueprintPage.hostnameInputBox.setValue(hostname);
        viewBlueprintPage.okHostnameButton.click();
        // UI should get updated
        expect(viewBlueprintPage.customizationsTabHostnameLabel(hostname).getText()).to.equal(hostname);

        // get dependencies from API
        const endpoint = `/api/v0/blueprints/info/${name}`;
        const result = commands.apiFetchTest(endpoint).value;
        // result looks like:
        // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L66
        const result_hostname = JSON.parse(result.data).blueprints[0].customizations.hostname;
        // new hostname should be stored
        expect(result_hostname).to.equal(hostname);
      });

      it("hostname should be updated", function() {
        const hostname = faker.lorem.slug();
        viewBlueprintPage.editHostnameButton.click();
        viewBlueprintPage.hostnameInputBox.setValue(hostname);
        viewBlueprintPage.okHostnameButton.click();
        // UI should get updated
        expect(viewBlueprintPage.customizationsTabHostnameLabel(hostname).getText()).to.equal(hostname);

        // get dependencies from API
        const endpoint = `/api/v0/blueprints/info/${name}`;
        const result = commands.apiFetchTest(endpoint).value;
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
        viewBlueprintPage.hostnameInputBox.setValue(hostname);
        viewBlueprintPage.okHostnameButton.click();
        // update hostname and click X button
        viewBlueprintPage.editHostnameButton.click();
        viewBlueprintPage.hostnameInputBox.setValue(faker.lorem.slug());
        viewBlueprintPage.cancelHostnameButton.click();
        // UI should get updated
        expect(viewBlueprintPage.customizationsTabHostnameLabel(hostname).getText()).to.equal(hostname);
      });

      it("disable OK button and show error input box if hostname has invalid character", function() {
        viewBlueprintPage.editHostnameButton.click();
        // input ?, invalid hostname character
        viewBlueprintPage.hostnameInputBox.setValue("?");
        // OK button should be disabled
        expect(viewBlueprintPage.okHostnameButton.getAttribute("type")).to.equal("button");
        expect(viewBlueprintPage.okHostnameButton.getAttribute("disabled")).to.equal("true");
        // input box should be an error box
        expect(browser.getAttribute('[data-form="hostname"]', "class")).to.include("has-error");
        // cancel edit to clear environment
        viewBlueprintPage.cancelHostnameButton.click();
      });
    });

    describe("Edit description", function() {
      const editDescriptionPage = require("../pages/editDescription.page");
      it("should show correct description", function() {
        viewBlueprintPage.moreButton.click();
        browser.keys("ArrowDown");
        browser.keys("Enter");
        editDescriptionPage.loading();
        expect(editDescriptionPage.descriptionInputBox.getValue()).to.equal(description);
        editDescriptionPage.cancelButton.click();
        browser.waitUntil(
          () => !browser.isExisting(editDescriptionPage.containerSelector),
          timeout,
          "Cannot close Edit Description dialog"
        );
      });

      it("should not update blueprint description after clicking X button", function() {
        viewBlueprintPage.moreButton.click();
        browser.keys("ArrowDown");
        browser.keys("Enter");
        editDescriptionPage.loading();
        editDescriptionPage.xButton.click();
        browser.waitUntil(
          () => !browser.isExisting(editDescriptionPage.containerSelector),
          timeout,
          "Cannot close Edit Description dialog"
        );
        expect(viewBlueprintPage.headerBlueprintDescriptionLabel.getText()).to.equal(description);
      });

      it("should update blueprint description after apply", function() {
        viewBlueprintPage.moreButton.click();
        browser.keys("ArrowDown");
        browser.keys("Enter");
        editDescriptionPage.loading();

        const newDescription = faker.lorem.sentence();
        editDescriptionPage.descriptionInputBox.setValue(newDescription);
        editDescriptionPage.saveButton.click();
        browser.waitUntil(
          () => !browser.isExisting(editDescriptionPage.containerSelector),
          timeout,
          "Cannot close Edit Description dialog"
        );
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
      const ExportPage = require("../pages/Export.page");
      const exportPage = new ExportPage(name);
      it("should copy correct blueprint manifest", function() {
        viewBlueprintPage.moreButton.click();
        browser.keys("ArrowDown");
        browser.keys("ArrowDown");
        browser.keys("Enter");
        exportPage.loading();
        // getText() does not work here on Edge, but works on Firefox and Chrome
        // the copied content should replace '\n' with space because
        // the text in blueprint description box does not include '\n', but space
        const blueprintManifest = exportPage.contentsTextarea.getValue().replace(/\n/g, " ");
        exportPage.copyButton.click();
        exportPage.closeButton.click();
        browser.waitForExist(exportPage.containerSelector, timeout, true);
        if (wdioConfig.config.capabilities[0].browserName !== "MicrosoftEdge") {
          // back to view blueprint page for pasting
          viewBlueprintPage.packagesTab.click();
          // paste blueprint manifest here to test copy function
          viewBlueprintPage.selectedComponentFilter.click();
          viewBlueprintPage.selectedComponentFilter.setValue(["Control", "v"]);
          viewBlueprintPage.selectedComponentFilter.waitForValue(timeout);
          expect(viewBlueprintPage.selectedComponentFilter.getValue()).to.equal(blueprintManifest);
        }
      });
    });
  });
});
