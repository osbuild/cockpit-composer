import faker from "faker";
import Blueprint from "../components/Blueprint.component";
import createImagePage from "../pages/createImage.page";

describe("Create Image Page", function() {
  // blueprint name cannot contain space due to issue https://github.com/osbuild/cockpit-composer/issues/317
  // use lorem.slug() ("a-accusantium-repudiandae") instead of lorem.words() ("nulla placeat qui")
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  before(function() {
    browser.newBlueprint(name, description);
    blueprintComponent.createImageButton.click();
    createImagePage.loading();
  });

  after(function() {
    createImagePage.cancelButton.click();
    $(createImagePage.containerSelector).waitForExist(timeout, true);
    browser.deleteBlueprint(name);
  });

  it(`blueprint name should be ${name}`, function() {
    expect(name).to.equal(createImagePage.blueprintNameLabel.getText());
  });

  it("Create button should be disabled by default", function() {
    expect(createImagePage.createButton.isEnabled()).to.be.false;
  });

  it("Image Type should be include .ami and .qcow2", function() {
    const selectOption = createImagePage.selectOption.map(item => item.getText());
    expect(selectOption)
      .to.include("Amazon Machine Image Disk (.ami)")
      .and.include("QEMU QCOW2 Image (.qcow2)");
  });

  it("should show correct help message by clicking ?", function() {
    const helpMessage = `This process can take a while. Images are built in the order they are started.`;
    createImagePage.helpButton.click();
    expect(createImagePage.helpMessage.getText()).to.equal(helpMessage);
  });
});
