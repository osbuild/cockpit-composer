const commands = require("../utils/commands");
const wdioConfig = require("../wdio.conf.js");

const blueprintsPage = require("../pages/blueprints.page");
const sourcesPage = require("../pages/sources.page");

describe("Sources Page", function() {
  const repo = "https://download.opensuse.org/repositories/shells:/fish:/release:/3/Fedora_29/";
  const repoName = "fish";
  describe("System source checking", function() {
    before(function() {
      commands.login();
      commands.startLoraxIfItDoesNotStart();
      blueprintsPage.moreButton.click();
      blueprintsPage.viewSourcesItem.click();
      sourcesPage.loading();
    });

    after(function() {
      sourcesPage.closeButton.click();
      browser.waitUntil(
        () => !browser.isExisting(sourcesPage.containerSelector),
        timeout,
        "Cannot close Sources dialog"
      );
    });

    it("should show correct title", function() {
      expect(sourcesPage.title.getText()).to.equal("Sources");
    });

    it("should have correct system source name", function() {
      // get system source list from API
      const endpoint = "/api/v0/projects/source/list";
      const result = commands.apiFetchTest(endpoint).value;
      // result looks like:
      // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L513
      const resultSources = JSON.parse(result.data).sources;

      const nameList = sourcesPage.sourceNameList.map(source => source.getText());
      expect(nameList).deep.equal(resultSources);
    });
    describe("* valication test", function() {
      beforeEach(function() {
        sourcesPage.addSourceButton.click();
        sourcesPage.sourceNameInput.waitForExist(timeout);
      });

      afterEach(function() {
        sourcesPage.cancelButton.click();
      });

      it("should focus on Name input box", function() {
        expect(sourcesPage.sourceNameInput.hasFocus()).to.be.true;
      });

      it("source cannot be created without name", function() {
        sourcesPage.sourcePathInput.setValue(repo);
        sourcesPage.sourceTypeSelect.selectByValue("yum-baseurl");
        expect(sourcesPage.addButton.getAttribute("disabled")).to.equal("true");
      });

      it("source cannot be created without path", function() {
        sourcesPage.sourceNameInput.setValue(repoName);
        sourcesPage.sourceTypeSelect.selectByValue("yum-baseurl");
        expect(sourcesPage.addButton.getAttribute("disabled")).to.equal("true");
      });

      it("source cannot be created without type", function() {
        sourcesPage.sourceNameInput.setValue(repoName);
        sourcesPage.sourcePathInput.setValue(repo);
        expect(sourcesPage.addButton.getAttribute("disabled")).to.equal("true");
      });
    });

    describe("edit source test", function() {
      before(function() {
        // Due to issue #651, all tests in this suite will be skipped on Edge
        if (wdioConfig.config.capabilities[0].browserName === "MicrosoftEdge") {
          this.skip();
        } else {
          sourcesPage.addSourceButton.click();
          sourcesPage.sourceNameInput.waitForExist(timeout);
          sourcesPage.sourceNameInput.setValue(repoName);
          sourcesPage.sourcePathInput.setValue(repo);
          sourcesPage.sourceTypeSelect.selectByValue("yum-baseurl");
          sourcesPage.addButton.click();
          browser.waitUntil(() => browser.isExisting(`[data-source=${repoName}]`), timeout, "Cannot add source");
        }
      });

      after(function() {
        if (wdioConfig.config.capabilities[0].browserName === "MicrosoftEdge") {
          this.skip();
        } else {
          if (sourcesPage.cancelButton.isExisting()) {
            sourcesPage.cancelButton.click();
          }
          sourcesPage.moreButton(repoName).click();
          browser.waitUntil(
            () => sourcesPage.moreButton(repoName).getAttribute("aria-expanded") === "true",
            timeout,
            "cannot open dropdown menu"
          );
          browser.keys("ArrowDown");
          browser.keys("Enter");
          browser.waitUntil(
            () => !browser.isExisting(`[data-source=${repoName}]`),
            timeout * 2,
            "Cannot delete source"
          );
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
        const result = commands.apiFetchTest(endpoint).value;
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
        const result = commands.apiFetchTest(endpoint).value;
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
        sourcesPage.sourceNameInput.waitForExist(timeout);
        sourcesPage.sourceNameInput.setValue(repoName);
        sourcesPage.sourcePathInput.setValue(repo);
        sourcesPage.sourceTypeSelect.selectByValue("yum-baseurl");

        expect(sourcesPage.addButton.getAttribute("disabled")).to.equal("true");
        expect(sourcesPage.duplicatedPathWarning.getText()).to.equal("This source path already exists.");
      });
    });
  });
});
