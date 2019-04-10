const faker = require("faker");
const addContext = require("mochawesome/addContext");
const commands = require("../utils/commands");

const Blueprint = require("../components/Blueprint.component");
const blueprintsPage = require("../pages/blueprints.page");
const CreateImagePage = require("../pages/CreateImage.page");

describe("Create Image Page", function() {
  // blueprint name cannot contain space due to issue https://github.com/weldr/welder-web/issues/317
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

  it("Image Type should be a list of type", function() {
    let expectedSelectOption = [
      "Select one",
      "Amazon Machine Image Disk (.ami)",
      "Ext4 File System Image (.img)",
      "Live Bootable ISO (.iso)",
      "OpenStack Image (.qcow2)",
      "Raw Partitioned Disk Image (.img)",
      "QEMU QCOW2 Image (.qcow2)",
      "TAR Archive (.tar)",
      "Azure Disk Image (.vhd)",
      "VMware Virtual Machine Disk (.vmdk)"
    ];
    if (process.env.TEST_OS && process.env.TEST_OS.startsWith("rhel-7-")) {
      expectedSelectOption = [
        "Select one",
        "Ext4 File System Image (.img)",
        "Live Bootable ISO (.iso)",
        "Raw Partitioned Disk Image (.img)",
        "QEMU QCOW2 Image (.qcow2)",
        "TAR Archive (.tar)"
      ];
    }
    if (process.env.TEST_OS && process.env.TEST_OS.startsWith("rhel-8")) {
      expectedSelectOption = [
        "Select one",
        "alibaba",
        "Amazon Machine Image Disk (.ami)",
        "Ext4 File System Image (.img)",
        "google",
        "Live Bootable ISO (.iso)",
        "OpenStack Image (.qcow2)",
        "Raw Partitioned Disk Image (.img)",
        "QEMU QCOW2 Image (.qcow2)",
        "TAR Archive (.tar)",
        "Azure Disk Image (.vhd)",
        "VMware Virtual Machine Disk (.vmdk)"
      ];
    }
    const selectOption = createImagePage.selectOption.map(item => item.getText());
    expect(selectOption).to.deep.equal(expectedSelectOption);
  });

  it("should show correct help message by clicking ?", function() {
    const helpMessage = `This process can take a while. Images are built in the order they are started.`;
    createImagePage.helpButton.click();
    expect(createImagePage.helpMessage.getText()).to.equal(helpMessage);
  });
});
