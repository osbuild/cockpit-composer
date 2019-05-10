const faker = require("faker");
const commands = require("../utils/commands");

const Blueprint = require("../components/Blueprint.component");
const blueprintsPage = require("../pages/blueprints.page");
const ViewBlueprintPage = require("../pages/ViewBlueprint.page");
const createUserAccount = require("../pages/createUserAccount.page");
const CreateImagePage = require("../pages/CreateImage.page");
const ToastNotificationPage = require("../pages/ToastNotification.page");
const deleteImagePage = require("../pages/deleteImage.page");

describe("View Blueprint Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const viewBlueprintPage = new ViewBlueprintPage(name, description);
  const createImagePage = new CreateImagePage(name);
  const toastNotificationPage = new ToastNotificationPage("imageWaiting");

  before(function() {
    commands.login();
    commands.startLoraxIfItDoesNotStart();

    // create new blueprint with openssh-server installed
    commands.newBlueprint(name, description);
    blueprintComponent.blueprintNameLink.click();
    viewBlueprintPage.loading();

    // set hostname
    const hostname = faker.lorem.slug();
    viewBlueprintPage.editHostnameButton.click();
    viewBlueprintPage.hostnameInputBox.setValue(hostname);
    viewBlueprintPage.okHostnameButton.click();

    // add user admin with password and public key configured
    const username = "admin";
    const password = "123qwe!@#QWE";
    const sshKey =
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDhbIOLUndK2150PwjZqxEmYC/b0z1isMFUXyJ0n2Pl0gJoFk28WDJ4tNMBraqAGyxqHv2YyqaJEY54ne0Pb085b9+0bOiBWp7rRhzRUwOdYrMRYE6zAow4lPPKVu0cY/a2uIzXmGz6meK7nSZ3g+0cfsfs2z6vJ/ip/tgbNM6XCSmI63N0QezEUy8dxDLrA0C4PrTq3QPMF+lvi8njt6B/k6f3AzqcsIldN0MULBI3Hp98cjBkmhFS4ZFZ/EAe6ePPOezVorAxC/C/X/76mcbsJpEke9Cn0EPPbCODIa+tVXyZRYCK0l4pU4h5ShinQI0yvYA9Y3NcFyChRk25RAuR cockpit-composer@localhost.localhost";
    viewBlueprintPage.createUserAccountButton.click();
    createUserAccount.loading();
    createUserAccount.userNameBox.setValue(username);
    createUserAccount.fullNameBox.setValue(username);
    createUserAccount.roleCheckbox.click();
    createUserAccount.passwordBox.setValue(password);
    createUserAccount.confirmPasswordBox.setValue(password);
    createUserAccount.sshKeyBox.setValue(sshKey);
    createUserAccount.createButton.click();
    browser.waitForExist(createUserAccount.containerSelector, timeout, true);
    browser.waitForExist(`[data-tr=${username}] [data-td=username]`);

    // create tar image
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
    // delete image
    viewBlueprintPage.imageMoreButton.click();
    browser.keys("ArrowDown");
    browser.keys("Enter");
    deleteImagePage.loading();
    deleteImagePage.deleteImageButton.click();
    browser.waitForExist(deleteImagePage.containerSelector, timeout, true);

    // delete blueprint
    viewBlueprintPage.backToBlueprintsLink.click();
    blueprintsPage.loading();
    commands.deleteBlueprint(name);
    blueprintsPage.loading();
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
    // set test timeout to 40 minutes for image building case ONLY
    this.timeout(timeout * 20);
    expect(viewBlueprintPage.completeLebel.getText()).to.equal("Complete");
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
    const result = commands.apiFetchTest(endpoint).value;
    // result looks like:
    // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L819
    const uuid = JSON.parse(result.data).uuids[0].id;

    expect(jsonObj.path).to.equal(`/api/v0/compose/image/${uuid}`);
    expect(jsonObj.unix).to.equal("/run/weldr/api.socket");
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
