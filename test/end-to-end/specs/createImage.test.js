const faker = require("faker");
const addContext = require("mochawesome/addContext");
const commands = require("../utils/commands");

const Blueprint = require("../components/Blueprint.component");
const blueprintsPage = require("../pages/blueprints.page");
const CreateImagePage = require("../pages/CreateImage.page");

describe("Create Image Page", function() {
  // blueprint name cannot contain space due to issue https://github.com/weldr/cockpit-composer/issues/317
  // use lorem.slug() ("a-accusantium-repudiandae") instead of lorem.words() ("nulla placeat qui")
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const createImagePage = new CreateImagePage(name);
  before(function() {
    commands.login();
    addContext(this, `create new blueprint with name, ${name}, and description, ${description}`);
    commands.newBlueprint(name, description);
    blueprintComponent.createImageButton.click();
    createImagePage.loading();
  });

  after(function() {
    createImagePage.cancelButton.click();
    browser.waitForExist(createImagePage.containerSelector, timeout, true);
    commands.deleteBlueprint(name);
    blueprintsPage.loading();
  });

  it(`blueprint name should be ${name}`, function() {
    expect(name).to.equal(createImagePage.blueprintNameLabel.getText());
  });

  it("Create button should be disabled by default", function() {
    expect(createImagePage.createButton.isEnabled()).to.be.false;
  });

  it("Image Type should be include .iso and .qcow2", function() {
    const selectOption = createImagePage.selectOption.map(item => item.getText());
    expect(selectOption)
      .to.include("Live Bootable ISO (.iso)")
      .and.include("QEMU QCOW2 Image (.qcow2)");
  });

  it("should show correct help message by clicking ?", function() {
    const helpMessage = `This process can take a while. Images are built in the order they are started.`;
    createImagePage.helpButton.click();
    expect(createImagePage.helpMessage.getText()).to.equal(helpMessage);
  });
});
