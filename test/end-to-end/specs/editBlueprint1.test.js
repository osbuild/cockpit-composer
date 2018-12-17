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

    describe('Page element checking', function(){
      it(`blueprint link should be linked to "#/blueprint/${name}"`, function(){
        // href attribute retruns: https://localhost:9090/cockpit/
        // $5d3f0c4e73267bcf41ad3452b142173cba11c63a2ebcd1ee50a02441ebf9d8eb/welder/index.html#/blueprint/example-atlas
        expect(editBlueprintPage.blueprintNameLink.getAttribute('href')).to.include(`#/blueprint/${name}`);
      });
  
      it('pending changes should not exist by default', function(){
        addContext(this, 'if it does not exist, the value property of element object should be null');
        //{ type: 'NoSuchElement',
        //   message:
        //   'An element could not be located on the page using the given search parameters.',
        //  state: 'failure',
        //  sessionId: '0799484d6ac6200127bd8fac088b0773',
        //  value: null,
        //  selector: 'span*=Pending Change' }
        expect(editBlueprintPage.pendingChangeLink.value).to.be.null;
      });

      it(`title should be blueprint name "${name}"`, function(){
        expect(editBlueprintPage.blueprintNameLabel.getText()).to.equal(name);
      });
  
      it('Commit button should be disabled by default', function(){
        expect(editBlueprintPage.commitButton.getAttribute('class')).to.include('disabled');
      });

      it('Discard Changes button should be disabled by default', function(){
        expect(editBlueprintPage.discardChangeButton.getAttribute('class')).to.include('disabled');
      });

      it('> button should work', function(){
        const pageNumber = editBlueprintPage.nthPageBox.getValue();
        editBlueprintPage.nextButton.click();
        editBlueprintPage.loading();
        expect(parseInt(editBlueprintPage.nthPageBox.getValue(), 10)).to.equal(parseInt(pageNumber, 10) + 1);
      });

      it('< button should work', function(){
        const pageNumber = editBlueprintPage.nthPageBox.getValue();
        editBlueprintPage.previousButton.click();
        editBlueprintPage.loading();
        expect(parseInt(editBlueprintPage.nthPageBox.getValue(), 10)).to.equal(parseInt(pageNumber, 10) - 1);
      });
    });

    describe('Filter test', function(){
      const filterContent = 'cockpit-bridge';
      const filterLabel = `Name: ${filterContent}`;
      beforeEach(function(){
        editBlueprintPage.filterBox.setValue(filterContent);
        browser.keys('Enter');
        browser.waitForExist(editBlueprintPage.filterContentLabel, timeout);
      });

      it(`Filtered package name should contain "${filterContent}" and should be cleared by clicking "Clear All Filter" link`,
        function(){
          addContext(this, `Filtered package name should contain "${filterContent}"`);
          const packageNameList = editBlueprintPage.packageList.map(item => item.getText());
          expect(packageNameList).to.be.an('array').that.includes(filterContent);
          // another test on clear filter
          addContext(this, 'All filters should be cleared by clicking Clear All Filter link');
          editBlueprintPage.clearAllFiltersLink.click();
          editBlueprintPage.loading();
          expect($(editBlueprintPage.filterContentLabel).value).to.be.null;
        }
      );

      it(`Filter content label should be "${filterLabel}" and should be cleared by clicking X button`, function(){
        addContext(this, `Filter content label should be "${filterLabel}"`);
        expect($(editBlueprintPage.filterContentLabel).getText()).to.equal(filterLabel);
        // another test on clear filter
        addContext(this, 'Filter content label should be cleared by clicking X button');
        editBlueprintPage.xLabelButton.click();
        editBlueprintPage.loading();
        expect($(editBlueprintPage.filterContentLabel).value).to.be.null;
      });
    });

    describe('Package icon', function(){
      const availableComponent = new AvailableComponents();
      const packageName = 'cockpit-bridge';
      before(function(){
        editBlueprintPage.filterBox.setValue(packageName);
        browser.keys('Enter');
        browser.waitForExist(editBlueprintPage.filterContentLabel, timeout);
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

      it('Unselected package icon should not have blue border', function(){
        expect(availableComponent.iconByName(packageName).getAttribute('class')).to.not.include('list-pf-icon-bordered');
      });

      it('Selected package icon should have blue border', function(){
        // add package to blueprint
        availableComponent.addPackageByName(packageName);
        selectedComponents.loading();
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).includes(packageName),
          timeout,
          `Cannot add package ${packageName} into blueprint ${name}`
        );
        // icon should be blue bordered
        expect(availableComponent.iconByName(packageName).getAttribute('class')).to.include('list-pf-icon-bordered');
      });
    });

    describe('Create Image button test', function(){
      const CreateImagePage = require('../pages/CreateImage.page');
      const createImagePage = new CreateImagePage(name);
      beforeEach(function(){
        editBlueprintPage.createImageButton.click();
        createImagePage.loading();
      });

      afterEach(function(){
        createImagePage.cancelButton.click();
        browser.waitForExist(createImagePage.containerSelector, timeout, true);
      });

      it('Create Image dialog should pop up', function(){
        expect(browser.isExisting(createImagePage.containerSelector)).to.be.true;
      });
    });

    describe('Export dropdown item test', function(){
      const ExportPage = require('../pages/Export.page');
      const exportPage = new ExportPage(name);
      beforeEach(function(){
        editBlueprintPage.moreButton.click();
        browser.keys('ArrowDown');
        browser.keys('Enter');
        exportPage.loading();
      });

      afterEach(function(){
        exportPage.closeButton.click();
        browser.waitForExist(exportPage.containerSelector, timeout, true);
      });

      it('Export dialog should pop up', function(){
        expect(browser.isExisting(exportPage.containerSelector)).to.be.true;
      });
    });

    describe('Pending Commit', function(){
      const pendingCommitPage = require('../pages/pendingCommit.page');
      let removedPackageName, addedPackageName;
      before(function(){
        // get package name which will be removed
        removedPackageName = selectedComponents.packageNameByNth(0);
        // remove added package
        selectedComponents.moreButtonByName(removedPackageName).click();
        browser.keys('ArrowDown'); // View
        browser.keys('ArrowDown'); // Edit
        browser.keys('ArrowDown'); // Remove
        browser.keys('Enter');
        // add a new package
        const availableComponent = new AvailableComponents(1);
        addedPackageName = availableComponent.nameLabel.getText();
        availableComponent.addPackageByNth();
        // make sure the package added into selected components
        browser.waitUntil(
          () => selectedComponents.packageList.map(item => item.getText()).includes(addedPackageName),
          timeout,
          `Cannot add package ${addedPackageName} into blueprint ${name}`
        );
      });

      after(function(){
        editBlueprintPage.discardChangeButton.click();
        browser.waitUntil(
          () => editBlueprintPage.discardChangeButton.getAttribute('class').includes('disabled'),
          timeout
        );
      });

      describe('Page element checking', function(){
        it('should show pending changes', function(){
          expect(editBlueprintPage.pendingChangeLink.isExisting()).to.be.true;
        });

        it('should show "2 Pending Changes"', function(){
          expect(editBlueprintPage.pendingChangeLink.getText()).to.equal('2 Pending Changes');
        });

        it('Commit button should be enabled', function(){
          expect(editBlueprintPage.commitButton.getAttribute('class')).to.not.include('disabled');
        });

        it('Discard Changes button should enabled', function(){
          expect(editBlueprintPage.discardChangeButton.getAttribute('class')).to.not.include('disabled');
        });
      });

      describe('Changes Pending Commit Page', function(){
        before(function(){
          editBlueprintPage.pendingChangeLink.click();
          pendingCommitPage.loading();
        });

        after(function(){
          pendingCommitPage.closeButton.click();
          browser.waitForExist(pendingCommitPage.containerSelector, timeout, true);
        });

        it('info message should be "Only changes to selected components are shown."', function(){
          expect(pendingCommitPage.infoMessage.getText()).to.equal('Only changes to selected components are shown.')
        });

        it('should show correct blueprint name', function(){
          expect(pendingCommitPage.blueprintNameLabel.getText()).to.include(name);
        });

        it('change log list should have 2 items', function(){
          expect(pendingCommitPage.changeLogList).to.have.lengthOf(2);
        });

        it('the 1st change action should be "Added" in change list', function(){
          expect(pendingCommitPage.actionNameOnNth(0)).to.equal('Added');
        });

        it(`the 1st changed package name should be "${addedPackageName}" in change list`, function(){
          expect(pendingCommitPage.changedPackageNameOnNth(0)).to.include(addedPackageName);
        });

        it('the 2nd change action should be "Removed" in change list', function(){
          expect(pendingCommitPage.actionNameOnNth(1)).to.equal('Removed');
        });

        it(`the 2nd changed package name should be "${removedPackageName}" in change list`, function(){
          expect(pendingCommitPage.changedPackageNameOnNth(1)).to.include(removedPackageName);
        });

        it('should not commit changes if not clicking Commit button', function(){
          // not commit changes
          pendingCommitPage.xButton.click();
          browser.waitForExist(pendingCommitPage.containerSelector, timeout, true);
          // go back to blueprints page
          editBlueprintPage.backToBlueprintsPage();
          blueprintsPage.loading();
          // go to edit blueprint page again
          blueprintComponent.editBlueprintButton.click();
          editBlueprintPage.loading();
          editBlueprintPage.commitButton.click();
          // pop up Changes Pending Commit dialog
          pendingCommitPage.loading();
          // still have to pending changes here
          expect(pendingCommitPage.changeLogList).to.have.lengthOf(2);
        });
      });
    });
  });
});