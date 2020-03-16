import faker from "faker";

import Blueprint from "../components/Blueprint.component";
import blueprintsPage from "../pages/blueprints.page";
import ViewBlueprintPage from "../pages/ViewBlueprint.page";
import createUserAccount from "../pages/createUserAccount.page";
import createImagePage from "../pages/createImage.page";
import ToastNotificationPage from "../pages/ToastNotification.page";
import deleteImagePage from "../pages/deleteImage.page";

describe("View Blueprint Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const viewBlueprintPage = new ViewBlueprintPage(name, description);
  const toastNotificationPage = new ToastNotificationPage("imageWaiting");

  before(function() {
    browser.capabilities.browserName.toLowerCase().includes("edge") && this.skip();
    // create new blueprint with openssh-server installed
    browser.newBlueprint(name, description);
    blueprintComponent.blueprintNameLink.click();
    viewBlueprintPage.loading();

    // set hostname
    const hostname = faker.lorem.slug();
    viewBlueprintPage.editHostnameButton.click();
    viewBlueprintPage.hostnameInputBox.setInputValue(hostname);
    viewBlueprintPage.okHostnameButton.click();

    // add user admin with password and public key configured
    const username = "admin";
    const password = "123qwe!@#QWE";
    const sshKey =
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDhbIOLUndK2150PwjZqxEmYC/b0z1isMFUXyJ0n2Pl0gJoFk28WDJ4tNMBraqAGyxqHv2YyqaJEY54ne0Pb085b9+0bOiBWp7rRhzRUwOdYrMRYE6zAow4lPPKVu0cY/a2uIzXmGz6meK7nSZ3g+0cfsfs2z6vJ/ip/tgbNM6XCSmI63N0QezEUy8dxDLrA0C4PrTq3QPMF+lvi8njt6B/k6f3AzqcsIldN0MULBI3Hp98cjBkmhFS4ZFZ/EAe6ePPOezVorAxC/C/X/76mcbsJpEke9Cn0EPPbCODIa+tVXyZRYCK0l4pU4h5ShinQI0yvYA9Y3NcFyChRk25RAuR cockpit-composer@localhost.localhost";
    viewBlueprintPage.createUserAccountButton.click();
    createUserAccount.loading();
    do {
      createUserAccount.userNameBox.setInputValue(username);
    } while (createUserAccount.userNameBox.getAttribute("value") !== username);
    createUserAccount.fullNameBox.setInputValue(username);
    createUserAccount.roleCheckbox.click();
    createUserAccount.passwordBox.setInputValue(password);
    createUserAccount.confirmPasswordBox.setInputValue(password);
    createUserAccount.sshKeyBox.setInputValue(sshKey);
    createUserAccount.createButton.click();
    $(createUserAccount.containerSelector).waitForExist(timeout, true);
    viewBlueprintPage.userAccountSelector(username).waitForExist(timeout);

    // create tar image
    viewBlueprintPage.createImageButton.click();
    createImagePage.loading();
    createImagePage.imageTypeSelect.selectByAttribute("value", "tar");
    createImagePage.createButton.waitForEnabled(timeout);
    createImagePage.createButton.click();
    $(createImagePage.containerSelector).waitForExist(timeout, true);
    toastNotificationPage.loadingInfoNotification();
    toastNotificationPage.closeButton.click();
    $(toastNotificationPage.containerSelector).waitForExist(timeout, true);
    viewBlueprintPage.imagesTab.click();

    // show actions menu
    viewBlueprintPage.imageMoreButton.click();
  });

  after(function() {
    if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
      return;
    }
    // delete image
    viewBlueprintPage.imageMoreButton.click();
    viewBlueprintPage.deleteItem.click();
    deleteImagePage.loading();
    deleteImagePage.deleteImageButton.click();
    $(deleteImagePage.containerSelector).waitForExist(timeout, true);

    // delete blueprint
    viewBlueprintPage.backToBlueprintsLink.click();
    blueprintsPage.loading();
    browser.deleteBlueprint(name);
  });

  it(`image name should contain blueprint name "${name}" and type "Tar"`, function() {
    expect(viewBlueprintPage.imageNameLabel.getText())
      .to.include(name)
      .and.include("Tar");
  });

  it("image type should be Tar", function() {
    expect(viewBlueprintPage.imageTypeLabel("Tar").getText()).to.equal("Tar");
  });

  it('should show "Complete"', function() {
    // set test timeout to 20 minutes for image building case ONLY
    this.timeout(timeout * 10);
    viewBlueprintPage.waitForImageBuildComplete();
    expect(viewBlueprintPage.completeLabel.getText()).to.equal("Image build complete");
  });

  it("should show correct Complete icon", function() {
    expect(viewBlueprintPage.completeIcon.getAttribute("class")).to.include("pficon-ok");
  });

  it("should show correct download API in download link", function() {
    const link = viewBlueprintPage.imageDownloadButton.getAttribute("href");
    console.log(link);
    const jsonStr = link.split("?")[1];

    // decode base64 to json
    const jsonObj = JSON.parse(Buffer.from(jsonStr, "base64").toString("ascii"));

    // get blueprint info from API
    const endpoint = `/api/v0/compose/status/*?blueprint=${name}`;
    const result = browser.apiFetchTest(endpoint);
    // result looks like:
    // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L819
    const uuid = JSON.parse(result.data).uuids[0].id;

    expect(jsonObj.path).to.equal(`/api/v0/compose/image/${uuid}`);
    expect(jsonObj.unix).to.equal("/run/weldr/api.socket");
  });

  describe("Delete Image Page", function() {
    before(function() {
      viewBlueprintPage.imagesTab.click();
      viewBlueprintPage.imageMoreButton.click();
      viewBlueprintPage.deleteItem.click();
      deleteImagePage.loading();
    });

    after(function() {
      deleteImagePage.cancelButton.click();
      $(deleteImagePage.containerSelector).waitForExist(timeout, true);
    });
    it("Delete Image page should show correct blueprint name", function() {
      expect(deleteImagePage.messageLabel.getText()).to.include(name);
    });
  });
});
