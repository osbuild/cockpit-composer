const faker = require('faker');
const addContext = require('mochawesome/addContext');
const commands = require('../utils/commands');

const Blueprint = require('../components/Blueprint.component');
const blueprintsPage = require('../pages/blueprints.page');
const EditBlueprintPage = require('../pages/EditBlueprint.page');
const AvailableComponents = require('../components/AvailableComponents.component');
const selectedComponents = require('../components/selectedComponents.component');

describe('Edit Blueprint Page', function(){
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const editBlueprintPage = new EditBlueprintPage(name);

  before(function(){
    commands.login();
  });

  after(function(){
    commands.deleteBlueprint(name);
    blueprintsPage.loading();
  });

  describe('Run test on a new blueprint', function(){
    before(function(){
      addContext(this, `create new blueprint with name, ${name}, and description, ${description}`);
      commands.newBlueprint(name, description);
      blueprintComponent.editBlueprintButton.click();
      editBlueprintPage.loading();
    });

    after(function(){
      editBlueprintPage.backToBlueprintsPage();
      blueprintsPage.loading();
    });

    describe('Sort, Redo and Undo', function(){
      const availableComponent = new AvailableComponents();
      const packageName = 'cockpit-bridge';
      before(function(){
        editBlueprintPage.filterBox.setValue(packageName);
        browser.keys('Enter');
        browser.waitForExist(editBlueprintPage.filterContentLabel, timeout);
        // add package to blueprint
        availableComponent.addPackageByName(packageName);
        selectedComponents.loading();
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
          timeout,
          `Cannot add package ${packageName} into blueprint ${name}`
        );
      });

      after(function(){
        availableComponent.removePackageByName(packageName);
        selectedComponents.loading();
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).indexOf(packageName) === -1,
          timeout,
          `Cannot add package ${packageName} into blueprint ${name}`
        );
      });

      it('should have correct order by default sort rule', function(){
        const defaultArray = selectedComponents.packageList.map(item => item.getText());
        // make a copy of default Array
        const sortedArray = [...defaultArray].sort();
        expect(defaultArray.every((value, index) => value === sortedArray[index])).to.be.true;
      });
    
      it('blueprint with reverse order by clicking A->Z sort button', function(){
        const defaultArray = selectedComponents.packageList.map((item) => item.getText());
        editBlueprintPage.sortAscButton.click();
        editBlueprintPage.sortDescButton.waitForVisible(timeout);
        const sortedArray = selectedComponents.packageList.map((item) => item.getText());
        expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
      });

      it('blueprint with reverse order by clicking Z->A sort button', function(){
        const defaultArray = selectedComponents.packageList.map((item) => item.getText());
        editBlueprintPage.sortDescButton.click();
        editBlueprintPage.sortAscButton.waitForVisible(timeout);
        const sortedArray = selectedComponents.packageList.map((item) => item.getText());
        expect(defaultArray.reverse().every((value, index) => value === sortedArray[index])).to.be.true;
      });

      it('Undo button should work', function(){
        editBlueprintPage.undoButton.click();
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).indexOf(packageName) === -1,
          timeout,
          `Cannot add package ${packageName} into blueprint ${name}`
        );
        expect(selectedComponents.packageList.map(item => item.getText())).to.not.include(packageName);
      });

      it('Redo button should work', function(){
        editBlueprintPage.redoButton.click();
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
          timeout,
          `Cannot add package ${packageName} into blueprint ${name}`
        );
        expect(selectedComponents.packageList.map(item => item.getText())).to.include(packageName);
      });
    });
  });
});