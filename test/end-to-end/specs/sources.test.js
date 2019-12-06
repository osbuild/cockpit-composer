import blueprintsPage from "../pages/blueprints.page";
import sourcesPage from "../pages/sources.page";

describe("Sources Page", function() {
  const repo = "https://download.copr.fedorainfracloud.org/results/xiaofwan/sway-copr/fedora-31-x86_64/";
  const repoName = "sway-copr";
  describe("System source checking", function() {
    before(function() {
      blueprintsPage.moreButton.click();
      browser.waitUntil(
        () =>
          blueprintsPage.dropDownMenu.getAttribute("class").includes("open") &&
          blueprintsPage.manageSourcesItem.isDisplayed(),
        timeout
      );
      blueprintsPage.manageSourcesItem.click();
      sourcesPage.loading();
    });

    after(function() {
      sourcesPage.closeButton.click();
      $(sourcesPage.containerSelector).waitForExist(timeout, true);
    });

    it("should show correct title", function() {
      expect(sourcesPage.title.getText()).to.equal("Sources");
    });

    it("should have correct system source name", function() {
      // get system source list from API
      const endpoint = "/api/v0/projects/source/list";
      const result = browser.apiFetchTest(endpoint);
      // result looks like:
      // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L513
      const resultSources = JSON.parse(result.data).sources.sort();

      const nameList = sourcesPage.sourceNameList.map(source => source.getText()).sort();
      expect(nameList).deep.equal(resultSources);
      // const names = new Set(sourcesPage.sourceNameList.map(source => source.getText()));
      // expect(expected).deep.equal(names);
    });
    describe("* valication test", function() {
      beforeEach(function() {
        sourcesPage.addSourceButton.click();
      });

      afterEach(function() {
        sourcesPage.cancelButton.click();
      });

      it("should focus on Name input box", function() {
        expect(sourcesPage.sourceNameInput.isFocused()).to.be.true;
      });

      it("source cannot be created without name", function() {
        sourcesPage.sourcePathInput.setInputValue(repo);
        sourcesPage.sourceTypeSelect.selectByAttribute("value", "yum-baseurl");
        expect(sourcesPage.addButton.getAttribute("disabled")).to.equal("true");
      });

      it("source cannot be created without path", function() {
        sourcesPage.sourceNameInput.setInputValue(repoName);
        sourcesPage.sourceTypeSelect.selectByAttribute("value", "yum-baseurl");
        expect(sourcesPage.addButton.getAttribute("disabled")).to.equal("true");
      });

      it("source cannot be created without type", function() {
        sourcesPage.sourceNameInput.setInputValue(repoName);
        sourcesPage.sourcePathInput.setInputValue(repo);
        expect(sourcesPage.addButton.getAttribute("disabled")).to.equal("true");
      });
    });

    describe("edit source test", function() {
      before(function() {
        // Due to issue #651, all tests in this suite will be skipped on Edge
        if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
          this.skip();
        } else {
          sourcesPage.addSourceButton.click();
          sourcesPage.sourceNameInput.setInputValue(repoName);
          sourcesPage.sourcePathInput.setInputValue(repo);
          sourcesPage.sourceTypeSelect.selectByAttribute("value", "yum-baseurl");
          sourcesPage.addButton.click();
          sourcesPage.sourceItem(repoName).waitForDisplayed(timeout);
        }
      });

      after(function() {
        if (browser.capabilities.browserName.toLowerCase().includes("edge")) {
          return;
        } else {
          try {
            sourcesPage.cancelButton.waitForDisplayed(1000);
            sourcesPage.cancelButton.click();
          } catch (e) {
            console.error(e);
            sourcesPage.loading();
          }
          sourcesPage.moreButton(repoName).click();
          browser.waitUntil(
            () =>
              sourcesPage
                .dropDownMenu(repoName)
                .getAttribute("class")
                .includes("open") && sourcesPage.removeSourceItem(repoName).isDisplayed(),
            timeout
          );
          sourcesPage.moreButton(repoName).sendKey("\uE015");
          sourcesPage.removeSourceItem(repoName).sendKey("\uE007");
          sourcesPage.sourceItem(repoName).waitForExist(timeout * 2, true);
        }
      });

      it(`source name should be ${repoName}`, function() {
        expect(sourcesPage.sourceName(repoName).getText()).to.equal(repoName);
      });

      it(`source path should be ${repo}`, function() {
        expect(sourcesPage.sourceUrl(repoName).getText()).to.equal(repo);
      });

      it("source type should be yum repository", function() {
        expect(sourcesPage.sourceType(repoName).getText()).to.equal("yum repository");
      });

      it("check source from API", function() {
        // get system source list from API
        const endpoint = `/api/v0/projects/source/info/${repoName}`;
        const result = browser.apiFetchTest(endpoint);
        // result looks like:
        // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L529
        const resultSources = JSON.parse(result.data).sources[repoName];
        expect(resultSources.name).to.equal(repoName);
        expect(resultSources.url).to.equal(repo);
        expect(resultSources.type).to.equal("yum-baseurl");
        expect(resultSources.system).to.be.false;
        expect(resultSources.check_gpg).to.be.false;
        expect(resultSources.check_ssl).to.be.false;
      });

      it("edit source - enable GPG and SSL check", function() {
        sourcesPage.editButton(repoName).click();
        sourcesPage.checkGPGKeyCheckbox.click();
        sourcesPage.checkSSLCertificateCheckbox.click();
        sourcesPage.updateButton.click();
        sourcesPage.sourceName(repoName).waitForExist(timeout);

        // get system source list from API
        const endpoint = `/api/v0/projects/source/info/${repoName}`;
        const result = browser.apiFetchTest(endpoint);
        // result looks like:
        // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L529
        const resultSources = JSON.parse(result.data).sources[repoName];
        expect(resultSources.name).to.equal(repoName);
        expect(resultSources.url).to.equal(repo);
        expect(resultSources.type).to.equal("yum-baseurl");
        expect(resultSources.system).to.be.false;
        expect(resultSources.check_gpg).to.be.true;
        expect(resultSources.check_ssl).to.be.true;
      });

      it("cannot add source with duplicated path", function() {
        sourcesPage.addSourceButton.click();
        sourcesPage.sourceNameInput.setInputValue(repoName);
        sourcesPage.sourcePathInput.setInputValue(repo);
        sourcesPage.sourceTypeSelect.selectByAttribute("value", "yum-baseurl");

        expect(sourcesPage.addButton.getAttribute("disabled")).to.equal("true");
        expect(sourcesPage.duplicatedPathWarning.getText()).to.equal("This source path already exists.");
      });
    });
  });
});
