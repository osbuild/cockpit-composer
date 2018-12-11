const faker = require('faker');
const addContext = require('mochawesome/addContext');
const commands = require('../utils/commands');

const blueprintsPage = require('../pages/blueprints.page');
const Blueprint = require('../components/Blueprint.component');

describe('Blueprints Page', function(){
  before(function(){
    commands.login();
  });

  let name, description, blueprintComponent;
  before(function(){
    // blueprint name cannot contain space due to issue https://github.com/weldr/welder-web/issues/317
    // use lorem.slug() ("a-accusantium-repudiandae") instead of lorem.words() ("nulla placeat qui")
    name = faker.lorem.slug();
    description = faker.lorem.sentence();
    blueprintComponent = new Blueprint(name);

    addContext(this, `create new blueprint with name, ${name}, and description, ${description}`);
    commands.newBlueprint(name, description);
  });
  after(function(){
    commands.deleteBlueprint(name);
    blueprintsPage.loading();
  });

  it('should show the correct blueprint name and description of new added blueprint', function(){
    expect(name).to.equal(blueprintComponent.blueprintNameLink.getText());
    expect(description).to.equal(blueprintComponent.blueprintDescriptionText.getText());
  });

  it('should have correct blueprint order by default sort rule', function(){
    const defaultArray = $$(blueprintComponent.blueprintNameList).map((item) => item.getText());
    // make a copy of default Array
    const sortedArray = [...defaultArray].sort();
    expect(defaultArray.every((value, index) => value === sortedArray[index])).to.be.true;
  });

  it('blueprint with reverse order by clicking A->Z sort button', function(){
    const defaultArray = $$(blueprintComponent.blueprintNameList).map((item) => item.getText());
    blueprintsPage.sortAscButton.click();
    blueprintsPage.sortDescButton.waitForVisible(timeout);
    const sortedArray = $$(blueprintComponent.blueprintNameList).map((item) => item.getText());
    expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
  });

  it('blueprint with reverse order by clicking Z->A sort button', function(){
    const defaultArray = $$(blueprintComponent.blueprintNameList).map((item) => item.getText());
    blueprintsPage.sortDescButton.click();
    blueprintsPage.sortAscButton.waitForVisible(timeout);
    const sortedArray = $$(blueprintComponent.blueprintNameList).map((item) => item.getText());
    expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
  });

  describe('Filter by name', function(){
    beforeEach(function(){
      addContext(this, `filter blueprint by name ${name}`);
      blueprintsPage.filterBox.setValue(name);
      browser.keys('Enter');
      blueprintsPage.waitForActiveFiltersExist();
      blueprintsPage.loading();
    })

    it('should have correct filter result and clear filter result by clicking Clear All Filters link', function(){
      // only show the blueprint because filtered by blueprint name
      expect($$(blueprintsPage.blueprintListView)).to.have.lengthOf(1);
      blueprintsPage.clearAllFiltersLink.click();
      blueprintsPage.waitForActiveFiltersNotExist();
      blueprintsPage.loading();
      // one new added blueprints + three default blueprints
      expect($$(blueprintsPage.blueprintListView)).to.have.lengthOf.above(1);
    });

    it('should have correct filter content label and clear filter result by clicking X button', function(){
      expect(blueprintsPage.filterContentLabel.getText()).to.include(name);
      blueprintsPage.filterContentLabelCloseButton.click();
      blueprintsPage.waitForActiveFiltersNotExist();
      blueprintsPage.loading();
      // one new added blueprints + three default blueprints
      expect($$(blueprintsPage.blueprintListView)).to.have.lengthOf.above(1);
    })
  })
});
