const faker = require("faker");
const addContext = require("mochawesome/addContext");
const commands = require("../utils/commands");

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

      it('"Details" tab should be active by default', function() {
        expect(viewBlueprintPage.detailsTab.getAttribute("aria-selected")).to.equal("true");
      });
    });

    describe('"Details" tab', function() {
      it(`blueprint description under "Details" tab should be "${description}"`, function() {
        expect(viewBlueprintPage.detailsTabBlueprintDescriptionLabel.getText()).to.equal(description);
      });

      it("click X button => blueprint description not updated", function() {
        viewBlueprintPage.editBlueprintDescriptionButton.click();
        viewBlueprintPage.descriptionInputBox.setValue(faker.lorem.sentence());
        viewBlueprintPage.cancelButton.click();
        expect(viewBlueprintPage.detailsTabBlueprintDescriptionLabel.getText()).to.equal(description);
      });

      it("blueprint description should be updated", function() {
        const updatedDescription = faker.lorem.sentence();
        viewBlueprintPage.editBlueprintDescriptionButton.click();
        viewBlueprintPage.descriptionInputBox.setValue(updatedDescription);
        viewBlueprintPage.okButton.click();
        expect(viewBlueprintPage.updatedBlueprintDescriptionLabel(updatedDescription).getText()).to.equal(
          updatedDescription
        );
      });

      it("hostname should be added", function() {
        const hostname = faker.lorem.slug();
        viewBlueprintPage.editHostnameButton.click();
        viewBlueprintPage.hostnameInputBox.setValue(hostname);
        viewBlueprintPage.okHostnameButton.click();
        // UI should get updated
        expect(viewBlueprintPage.detailsTabHostnameLabel(hostname).getText()).to.equal(hostname);

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
        expect(viewBlueprintPage.detailsTabHostnameLabel(hostname).getText()).to.equal(hostname);

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
        expect(viewBlueprintPage.detailsTabHostnameLabel(hostname).getText()).to.equal(hostname);
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

    describe("Edit Blueprint", function() {
      const EditBlueprintPage = require("../pages/EditBlueprint.page");
      const editBlueprintPage = new EditBlueprintPage(name);

      before(function() {
        viewBlueprintPage.editBlueprintButton.click();
        editBlueprintPage.loading();
      });

      after(function() {
        editBlueprintPage.blueprintNameLink.click();
        viewBlueprintPage.loading();
      });

      it("should go to Edit Blueprint page by clicking Edit Blueprint button", function() {
        expect(editBlueprintPage.blueprintNameLabel.getText()).to.equal(name);
      });
    });

    describe("Export Blueprint", function() {
      const ExportPage = require("../pages/Export.page");
      const exportPage = new ExportPage(name);
      it("should copy correct blueprint manifest", function() {
        viewBlueprintPage.moreButton.click();
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
        // back to view blueprint page for pasting
        viewBlueprintPage.selectedComponentsTab.click();
        // paste blueprint manifest here to test copy function
        viewBlueprintPage.selectedComponentFilter.setValue(["Control", "v"]);
        viewBlueprintPage.selectedComponentFilter.waitForValue(timeout);
        expect(viewBlueprintPage.selectedComponentFilter.getValue()).to.equal(blueprintManifest);
      });
    });

    describe("Create Image", function() {
      const CreateImagePage = require("../pages/CreateImage.page");
      const ToastNotificationPage = require("../pages/ToastNotification.page");
      const deleteImagePage = require("../pages/deleteImage.page");
      const createImagePage = new CreateImagePage(name);
      const toastNotificationPage = new ToastNotificationPage("imageWaiting");

      before(function() {
        viewBlueprintPage.createImageButton.click();
        createImagePage.loading();
        createImagePage.imageTypeSelect.selectByValue("tar");
        createImagePage.createButton.waitForEnabled(timeout);
        createImagePage.createButton.click();
        browser.waitForExist(createImagePage.containerSelector, timeout, true);
        toastNotificationPage.loadingInfoNotification();
        toastNotificationPage.close();
        viewBlueprintPage.imagesTab.click();
      });

      after(function() {
        viewBlueprintPage.imageMoreButton.click();
        browser.keys("ArrowDown");
        browser.keys("Enter");
        deleteImagePage.loading();
        deleteImagePage.deleteImageButton.click();
        browser.waitForExist(deleteImagePage.containerSelector, timeout, true);
      });

      it(`image name should contain blueprint name "${name}" and type "tar"`, function() {
        expect(viewBlueprintPage.imageNameLabel.getText())
          .to.include(name)
          .and.include("tar");
      });

      it("image type should be tar", function() {
        expect(viewBlueprintPage.imageTypeLabel("tar").getText()).to.equal("tar");
      });

      it('should show "Complete"', function() {
        expect(viewBlueprintPage.completeLebel.getText()).to.equal("Complete");
      });

      it("should show correct Complete icon", function() {
        expect(viewBlueprintPage.completeIcon.getAttribute("class")).to.include("pficon-ok");
      });

      describe("Delete Image Page", function() {
        before(function() {
          viewBlueprintPage.imageMoreButton.click();
          browser.keys("ArrowDown");
          browser.keys("Enter");
          deleteImagePage.loading();
        });

        after(function() {
          deleteImagePage.cancelButton.click();
          browser.waitForExist(deleteImagePage.containerSelector, timeout, true);
        });
        it("Delete Image page should show correct blueprint name", function() {
          expect(deleteImagePage.messageLabel.getText()).to.include(name);
        });
      });
    });
  });
});
