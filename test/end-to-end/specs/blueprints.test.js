const faker = require("faker");
const addContext = require("mochawesome/addContext");
const commands = require("../utils/commands");

const blueprintsPage = require("../pages/blueprints.page");
const Blueprint = require("../components/Blueprint.component");

describe("Blueprints Page", function() {
  before(function() {
    commands.login();
  });

  let name, description, blueprintComponent;
  before(function() {
    // blueprint name cannot contain space due to issue https://github.com/weldr/cockpit-composer/issues/317
    // use lorem.slug() ("a-accusantium-repudiandae") instead of lorem.words() ("nulla placeat qui")
    name = faker.lorem.slug();
    description = faker.lorem.sentence();
    blueprintComponent = new Blueprint(name);

    addContext(this, `create new blueprint with name, ${name}, and description, ${description}`);
    commands.newBlueprint(name, description);
  });
  after(function() {
    commands.deleteBlueprint(name);
    blueprintsPage.loading();
  });

  it("should show the correct blueprint name and description of new added blueprint", function() {
    expect(name).to.equal(blueprintComponent.blueprintNameLink.getText());
    expect(description).to.equal(blueprintComponent.blueprintDescriptionText.getText());
  });

  it("should have correct blueprint order by default sort rule", function() {
    const defaultArray = $$(blueprintComponent.blueprintNameList).map(item => item.getText());
    // make a copy of default Array
    const sortedArray = [...defaultArray].sort();
    expect(defaultArray.every((value, index) => value === sortedArray[index])).to.be.true;
  });

  it("blueprint with reverse order by clicking A->Z sort button", function() {
    const defaultArray = $$(blueprintComponent.blueprintNameList).map(item => item.getText());
    blueprintsPage.sortAscButton.click();
    blueprintsPage.sortDescButton.waitForVisible(timeout);
    const sortedArray = $$(blueprintComponent.blueprintNameList).map(item => item.getText());
    expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
  });

  it("blueprint with reverse order by clicking Z->A sort button", function() {
    const defaultArray = $$(blueprintComponent.blueprintNameList).map(item => item.getText());
    blueprintsPage.sortDescButton.click();
    blueprintsPage.sortAscButton.waitForVisible(timeout);
    const sortedArray = $$(blueprintComponent.blueprintNameList).map(item => item.getText());
    expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
  });

  it("should export all dependencies packages", function() {
    const ExportPage = require("../pages/Export.page");
    const exportPage = new ExportPage(name);
    blueprintComponent.moreDropdownMenu.click();
    blueprintComponent.exportOption.click();
    exportPage.loading();
    exportPage.contentsTextarea.waitForValue(timeout);
    // getText() does not work on Edge, but works on Firefox and Chrome
    // the copied content should replace '\n' with space because
    // the text in blueprint description box does not include '\n', but space
    const blueprintManifest = exportPage.contentsTextarea.getValue().replace(/\n/g, " ");
    // have to close Export page to make aftertest() work
    exportPage.closeButton.click();
    browser.waitForExist(exportPage.containerSelector, timeout, true);

    // get dependencies from API
    const endpoint = `/api/v0/blueprints/depsolve/${name}`;
    const result = commands.apiFetchTest(endpoint).value;
    // result looks like:
    // https://github.com/weldr/lorax/blob/db7b1e4fcd7c71d98ebdbf8335aa17e276d48e8e/src/pylorax/api/v0.py#L349
    const deps_array = JSON.parse(result.data).blueprints[0].dependencies;
    const deps_str = deps_array.map(x => `${x.name}-${x.version}-${x.release}`).join(" ");

    // compare dependencies coming from UI and from API
    expect(blueprintManifest).to.equal(deps_str);
  });

  describe("Filter by name", function() {
    beforeEach(function() {
      addContext(this, `filter blueprint by name ${name}`);
      blueprintsPage.filterBox.setValue(name);
      browser.keys("Enter");
      blueprintsPage.waitForActiveFiltersExist();
      blueprintsPage.filterLoading();
    });

    it("should have correct filter result and clear filter result by clicking Clear All Filters link", function() {
      // only show the blueprint because filtered by blueprint name
      expect($$(blueprintsPage.blueprintListView)).to.have.lengthOf(1);
      blueprintsPage.clearAllFiltersLink.click();
      blueprintsPage.waitForActiveFiltersNotExist();
      blueprintsPage.loading();
      // one new added blueprints + three default blueprints
      expect($$(blueprintsPage.blueprintListView)).to.have.lengthOf.above(1);
    });

    it("should have correct filter content label and clear filter result by clicking X button", function() {
      expect(blueprintsPage.filterContentLabel.getText()).to.include(name);
      blueprintsPage.filterContentLabelCloseButton.click();
      blueprintsPage.waitForActiveFiltersNotExist();
      blueprintsPage.loading();
      // one new added blueprints + three default blueprints
      expect($$(blueprintsPage.blueprintListView)).to.have.lengthOf.above(1);
    });
  });
});
