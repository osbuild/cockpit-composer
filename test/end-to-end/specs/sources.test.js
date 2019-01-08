const commands = require("../utils/commands");

const blueprintsPage = require("../pages/blueprints.page");
const sourcesPage = require("../pages/sources.page");

describe("Sources Page", function() {
  before(function() {
    commands.login();
    blueprintsPage.moreButton.click();
    blueprintsPage.viewSourcesItem.click();
    sourcesPage.loading();
  });

  it("should show correct title", function() {
    expect(sourcesPage.title.getText()).to.equal("Sources");
  });

  it("close Sources dialog by clicking Close button", function() {
    sourcesPage.closeButton.click();
    browser.waitUntil(() => !$(sourcesPage.containerSelector).isExisting(), timeout, "Cannot close Sources dialog");
    expect($(sourcesPage.containerSelector).isExisting()).to.be.false;
  });
});
