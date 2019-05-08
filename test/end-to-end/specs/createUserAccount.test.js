const faker = require("faker");
const addContext = require("mochawesome/addContext");
const commands = require("../utils/commands");

const Blueprint = require("../components/Blueprint.component");
const blueprintsPage = require("../pages/blueprints.page");
const ViewBlueprintPage = require("../pages/ViewBlueprint.page");
const createUserAccount = require("../pages/createUserAccount.page");

describe("Create User Account Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const viewBlueprintPage = new ViewBlueprintPage(name, description);

  before(function() {
    commands.login();
    commands.newBlueprint(name, description);
    blueprintComponent.blueprintNameLink.click();
    viewBlueprintPage.loading();
  });

  after(function() {
    viewBlueprintPage.backToBlueprintsLink.click();
    blueprintsPage.loading();
    commands.deleteBlueprint(name);
    blueprintsPage.loading();
  });

  describe("Check created user", function() {
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const username = `${firstname}${lastname}`;
    const fullname = `${firstname} ${lastname}`;
    const password = "123qwe!@#QWE";
    const sshKey =
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDhbIOLUndK2150PwjZqxEmYC/b0z1isMFUXyJ0n2Pl0gJoFk28WDJ4tNMBraqAGyxqHv2YyqaJEY54ne0Pb085b9+0bOiBWp7rRhzRUwOdYrMRYE6zAow4lPPKVu0cY/a2uIzXmGz6meK7nSZ3g+0cfsfs2z6vJ/ip/tgbNM6XCSmI63N0QezEUy8dxDLrA0C4PrTq3QPMF+lvi8njt6B/k6f3AzqcsIldN0MULBI3Hp98cjBkmhFS4ZFZ/EAe6ePPOezVorAxC/C/X/76mcbsJpEke9Cn0EPPbCODIa+tVXyZRYCK0l4pU4h5ShinQI0yvYA9Y3NcFyChRk25RAuR cockpit-composer@localhost.localhost";

    before(function() {
      addContext(this, `create new user account with name, ${username}, and fullname, ${fullname}`);
      viewBlueprintPage.createUserAccountButton.click();
      createUserAccount.loading();
      createUserAccount.userNameBox.setValue(username);
      createUserAccount.fullNameBox.setValue(fullname);
      createUserAccount.roleCheckbox.click();
      createUserAccount.passwordBox.setValue(password);
      createUserAccount.confirmPasswordBox.setValue(password);
      createUserAccount.sshKeyBox.setValue(sshKey);
      createUserAccount.createButton.click();
      browser.waitForExist(createUserAccount.containerSelector, timeout, true);
      browser.waitForExist(`[data-tr=${username}] [data-td=username]`);
    });

    after(function() {
      viewBlueprintPage.moreUserButton(username).click();
      browser.waitUntil(
        () => viewBlueprintPage.moreUserButton(username).getAttribute("aria-expanded") === "true",
        timeout
      );
      browser.keys("ArrowDown");
      browser.keys("Enter");
      browser.waitForExist(`[data-tr=${username}] [data-td=username]`, timeout, true);
    });

    it(`Username should be ${username}`, function() {
      expect(viewBlueprintPage.userNameCell(username).getText()).to.equal(username);
    });

    it(`Fullname should be ${fullname}`, function() {
      expect(viewBlueprintPage.fullNameCell(username).getText()).to.equal(fullname);
    });

    it("Server administrator cell should be checked", function() {
      expect(browser.isExisting(viewBlueprintPage.administratorCell(username))).to.be.true;
    });

    it("Password cell should be checked", function() {
      expect(browser.isExisting(viewBlueprintPage.passwordCell(username))).to.be.true;
    });

    it("SSH Key cell should be checked", function() {
      expect(browser.isExisting(viewBlueprintPage.sshKeyCell(username))).to.be.true;
    });

    it("SSH Key cell should show hostname if it exists in ssh public key", function() {
      // Edge returns " cockpit-composer@localhost.localhost" from getText()
      expect(
        $(viewBlueprintPage.sshKeyCell(username))
          .getText()
          .trim()
      ).to.equal("cockpit-composer@localhost.localhost");
    });

    it("should have the same password hash value", function() {
      // get blueprint info from API
      const endpoint = `/api/v0/blueprints/info/${name}`;
      const result = commands.apiFetchTest(endpoint).value;
      // result looks like:
      // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L66
      const resultPassword = JSON.parse(result.data).blueprints[0].customizations.user[0].password;
      const lastIndex = resultPassword.lastIndexOf("$");
      const salt = resultPassword.substring(0, lastIndex);
      const pyinvoke = `$(which /usr/libexec/platform-python 2>/dev/null || which python3 2>/dev/null || which python) -c 'import sys, crypt; print(crypt.crypt(sys.stdin.readline().strip(), "${salt}"))'`;

      const expectedPassword = browser.executeAsync(
        function(password, pyinvoke, done) {
          cockpit
            .script(pyinvoke, { err: "message" })
            .input(password)
            .then(data => done(data));
        },
        password,
        pyinvoke
      );
      expect(expectedPassword.value.trim()).to.equal(resultPassword);
    });

    it("Full name should not get updated when clicking X button", function() {
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      createUserAccount.fullNameBox.setValue("zzz");
      createUserAccount.clickXButton();
      browser.waitForExist(createUserAccount.containerSelector, timeout, true);
      expect(viewBlueprintPage.fullNameCell(username).getText()).to.equal(fullname);
    });

    it("Full name should get updated", function() {
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      createUserAccount.fullNameBox.setValue("zzz");
      createUserAccount.createButton.click();
      browser.waitForExist(createUserAccount.containerSelector, timeout, true);
      expect(viewBlueprintPage.fullNameCell(username).getText()).to.equal("zzz");
    });

    it("password should get updated", function() {
      const newPassword = "456rty$%^RTY";
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      createUserAccount.setNewPasswordButton.click();
      createUserAccount.passwordBox.setValue(newPassword);
      createUserAccount.confirmPasswordBox.setValue(newPassword);
      createUserAccount.updateButton.click();
      browser.waitForExist(createUserAccount.containerSelector, timeout, true);

      // get blueprint info from API
      const endpoint = `/api/v0/blueprints/info/${name}`;
      const result = commands.apiFetchTest(endpoint).value;
      // result looks like:
      // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L66
      const resultPassword = JSON.parse(result.data).blueprints[0].customizations.user[0].password;
      const lastIndex = resultPassword.lastIndexOf("$");
      const salt = resultPassword.substring(0, lastIndex);
      const pyinvoke = `$(which /usr/libexec/platform-python 2>/dev/null || which python3 2>/dev/null || which python) -c 'import sys, crypt; print(crypt.crypt(sys.stdin.readline().strip(), "${salt}"))'`;

      const expectedPassword = browser.executeAsync(
        function(password, pyinvoke, done) {
          cockpit
            .script(pyinvoke, { err: "message" })
            .input(password)
            .then(data => done(data));
        },
        newPassword,
        pyinvoke
      );
      expect(expectedPassword.value.trim()).to.equal(resultPassword);
    });

    it("password should be removed", function() {
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      createUserAccount.removePasswordButton.click();
      createUserAccount.updateButton.click();
      browser.waitForExist(createUserAccount.containerSelector, timeout, true);

      // get blueprint info from API
      const endpoint = `/api/v0/blueprints/info/${name}`;
      const result = commands.apiFetchTest(endpoint).value;
      // result looks like:
      // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L66
      const resultPassword = JSON.parse(result.data).blueprints[0].customizations.user[0].password;

      expect(resultPassword).to.be.undefined;
      expect(browser.isExisting(viewBlueprintPage.passwordCell(username))).to.be.false;
    });

    it("password should be create again", function() {
      const newPassword = "456rty$%^RTY";
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      createUserAccount.setPasswordButton.click();
      createUserAccount.passwordBox.setValue(newPassword);
      createUserAccount.confirmPasswordBox.setValue(newPassword);
      createUserAccount.updateButton.click();
      browser.waitForExist(createUserAccount.containerSelector, timeout, true);

      // get blueprint info from API
      const endpoint = `/api/v0/blueprints/info/${name}`;
      const result = commands.apiFetchTest(endpoint).value;
      // result looks like:
      // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L66
      const resultPassword = JSON.parse(result.data).blueprints[0].customizations.user[0].password;
      const lastIndex = resultPassword.lastIndexOf("$");
      const salt = resultPassword.substring(0, lastIndex);
      const pyinvoke = `$(which /usr/libexec/platform-python 2>/dev/null || which python3 2>/dev/null || which python) -c 'import sys, crypt; print(crypt.crypt(sys.stdin.readline().strip(), "${salt}"))'`;

      const expectedPassword = browser.executeAsync(
        function(password, pyinvoke, done) {
          cockpit
            .script(pyinvoke, { err: "message" })
            .input(password)
            .then(data => done(data));
        },
        newPassword,
        pyinvoke
      );
      expect(expectedPassword.value.trim()).to.equal(resultPassword);
    });

    describe("warning message test", function() {
      beforeEach(function() {
        viewBlueprintPage.createUserAccountButton.click();
        createUserAccount.loading();
      });

      afterEach(function() {
        createUserAccount.cancelButton.click();
        browser.waitForExist(createUserAccount.containerSelector, timeout, true);
      });

      it("should show duplicated name warning message", function() {
        createUserAccount.userNameBox.setValue(username);
        expect(createUserAccount.userErrorLabel.getText()).to.equal("This user name already exists.");
        expect(createUserAccount.createButton.getAttribute("disabled")).to.equal("true");
      });

      it("User name should be auto-filled according to Full name", function() {
        createUserAccount.fullNameBox.setValue("x y");
        expect(createUserAccount.userNameBox.getValue()).to.equal("xy");
      });

      it("should show password error message", function() {
        createUserAccount.fullNameBox.setValue("x y");
        createUserAccount.passwordBox.setValue("aaa");
        createUserAccount.confirmPasswordBox.setValue("bbb");
        expect(createUserAccount.passwordErrorLabel1.getText()).to.equal(
          "Password quality check failed: The password is a palindrome"
        );
        expect(createUserAccount.passwordErrorLabel2.getText()).to.equal(
          "The values entered for password do not match."
        );
        expect(createUserAccount.createButton.getAttribute("disabled")).to.equal("true");
      });
    });
  });
});
