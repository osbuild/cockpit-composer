import faker from "faker";

import Blueprint from "../components/Blueprint.component";
import blueprintsPage from "../pages/blueprints.page";
import ViewBlueprintPage from "../pages/ViewBlueprint.page";
import createUserAccount from "../pages/createUserAccount.page";

describe("Create User Account Page", function() {
  const name = faker.lorem.slug();
  const description = faker.lorem.sentence();
  const blueprintComponent = new Blueprint(name);
  const viewBlueprintPage = new ViewBlueprintPage(name, description);

  before(function() {
    browser.newBlueprint(name, description);
    blueprintComponent.blueprintNameLink.click();
    viewBlueprintPage.loading();
  });

  after(function() {
    viewBlueprintPage.backToBlueprintsLink.click();
    blueprintsPage.loading();
    browser.deleteBlueprint(name);
  });

  describe("Check created user", function() {
    const firstname = faker.lorem.word();
    const lastname = faker.lorem.word();
    const username = `${firstname}${lastname}`;
    const fullname = `${firstname} ${lastname}`;
    const password = "123qwe!@#QWE";
    const sshKey =
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDhbIOLUndK2150PwjZqxEmYC/b0z1isMFUXyJ0n2Pl0gJoFk28WDJ4tNMBraqAGyxqHv2YyqaJEY54ne0Pb085b9+0bOiBWp7rRhzRUwOdYrMRYE6zAow4lPPKVu0cY/a2uIzXmGz6meK7nSZ3g+0cfsfs2z6vJ/ip/tgbNM6XCSmI63N0QezEUy8dxDLrA0C4PrTq3QPMF+lvi8njt6B/k6f3AzqcsIldN0MULBI3Hp98cjBkmhFS4ZFZ/EAe6ePPOezVorAxC/C/X/76mcbsJpEke9Cn0EPPbCODIa+tVXyZRYCK0l4pU4h5ShinQI0yvYA9Y3NcFyChRk25RAuR cockpit-composer@localhost.localhost";

    before(function() {
      viewBlueprintPage.createUserAccountButton.click();
      createUserAccount.loading();
      do {
        createUserAccount.userNameBox.setInputValue(username);
      } while (createUserAccount.userNameBox.getAttribute("value") !== username);
      createUserAccount.fullNameBox.setInputValue(fullname);
      createUserAccount.roleCheckbox.click();
      createUserAccount.passwordBox.setInputValue(password);
      createUserAccount.confirmPasswordBox.setInputValue(password);
      createUserAccount.sshKeyBox.setInputValue(sshKey);
      createUserAccount.createButton.click();
      $(createUserAccount.containerSelector).waitForExist(timeout, true);
      viewBlueprintPage.userAccountSelector(username).waitForExist(timeout);
    });

    after(function() {
      viewBlueprintPage.moreUserButton(username).click();
      browser.waitUntil(
        () =>
          viewBlueprintPage
            .dropDownMenu(username)
            .getAttribute("class")
            .includes("open") && viewBlueprintPage.deleteUserAccountItem(username).isDisplayed(),
        timeout
      );
      viewBlueprintPage.moreUserButton(username).sendKey("\uE015");
      viewBlueprintPage.deleteUserAccountItem(username).sendKey("\uE007");
      viewBlueprintPage.userAccountSelector(username).waitForExist(timeout, true);
      // browser.waitForExist(`[data-tr=${username}] [data-td=username]`, timeout, true);
    });

    it(`Username should be ${username}`, function() {
      expect(viewBlueprintPage.userNameCell(username).getText()).to.equal(username);
    });

    it(`Fullname should be ${fullname}`, function() {
      expect(viewBlueprintPage.fullNameCell(username).getText()).to.equal(fullname);
    });

    it("Server administrator cell should be checked", function() {
      expect(viewBlueprintPage.administratorCell(username).isExisting()).to.be.true;
    });

    it("Password cell should be checked", function() {
      expect(viewBlueprintPage.passwordCell(username).isExisting()).to.be.true;
    });

    it("SSH Key cell should be checked", function() {
      expect(viewBlueprintPage.sshKeyCell(username).isExisting()).to.be.true;
    });

    it("SSH Key cell should show hostname if it exists in ssh public key", function() {
      // Edge returns " cockpit-composer@localhost.localhost" from getText()
      expect(
        viewBlueprintPage
          .sshKeyCell(username)
          .getText()
          .trim()
      ).to.equal("cockpit-composer@localhost.localhost");
    });

    it("should have the same password hash value", function() {
      // get blueprint info from API
      const endpoint = `/api/v0/blueprints/info/${name}`;
      const result = browser.apiFetchTest(endpoint);
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
      expect(expectedPassword.trim()).to.equal(resultPassword);
    });

    it("Full name should not get updated when clicking X button", function() {
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      const valueLength = createUserAccount.fullNameBox.getAttribute("value").length;
      for (let x = 0; x < valueLength; x++) {
        createUserAccount.fullNameBox.sendKey("\uE003");
      }
      createUserAccount.fullNameBox.setInputValue("zzz");
      createUserAccount.xButton.click();
      $(createUserAccount.containerSelector).waitForExist(timeout, true);
      expect(viewBlueprintPage.fullNameCell(username).getText()).to.equal(fullname);
    });

    it("Full name should get updated", function() {
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      const valueLength = createUserAccount.fullNameBox.getAttribute("value").length;
      for (let x = 0; x < valueLength; x++) {
        createUserAccount.fullNameBox.sendKey("\uE003");
      }
      createUserAccount.fullNameBox.setInputValue("zzz");
      createUserAccount.updateButton.click();
      $(createUserAccount.containerSelector).waitForExist(timeout, true);
      expect(viewBlueprintPage.fullNameCell(username).getText()).to.include("zzz");
    });

    it("password should get updated", function() {
      const newPassword = "456rty$%^RTY";
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      createUserAccount.setNewPasswordButton.click();
      createUserAccount.passwordBox.setInputValue(newPassword);
      createUserAccount.confirmPasswordBox.setInputValue(newPassword);
      // have to pause here for Firefox only (chrome and edge work great here)
      // the Update will be disabled(password verification has not done yet) if no pause here
      browser.pause(2000);
      createUserAccount.updateButton.click();
      $(createUserAccount.containerSelector).waitForExist(5000, true);

      // get blueprint info from API
      const endpoint = `/api/v0/blueprints/info/${name}`;
      const result = browser.apiFetchTest(endpoint);
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
      expect(expectedPassword.trim()).to.equal(resultPassword);
    });

    it("password should be removed", function() {
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      createUserAccount.removePasswordButton.click();
      createUserAccount.updateButton.click();
      $(createUserAccount.containerSelector).waitForExist(5000, true);

      // get blueprint info from API
      const endpoint = `/api/v0/blueprints/info/${name}`;
      const result = browser.apiFetchTest(endpoint);
      // result looks like:
      // https://github.com/weldr/lorax/blob/b57de934681056aa4f9bd480a34136cf340f510a/src/pylorax/api/v0.py#L66
      const resultPassword = JSON.parse(result.data).blueprints[0].customizations.user[0].password;

      expect(resultPassword).to.be.undefined;
      expect(viewBlueprintPage.passwordCell(username).isExisting()).to.be.false;
    });

    it("password should be create again", function() {
      const newPassword = "456rty$%^RTY";
      viewBlueprintPage.editUserButton(username).click();
      createUserAccount.loading();
      createUserAccount.setPasswordButton.click();
      createUserAccount.passwordBox.setInputValue(newPassword);
      createUserAccount.confirmPasswordBox.setInputValue(newPassword);
      // have to pause here for Firefox only (chrome and edge work great here)
      // the Update will be disabled(password verification has not done yet) if no pause here
      browser.pause(2000);
      createUserAccount.updateButton.click();
      $(createUserAccount.containerSelector).waitForExist(5000, true);

      // get blueprint info from API
      const endpoint = `/api/v0/blueprints/info/${name}`;
      const result = browser.apiFetchTest(endpoint);
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
      expect(expectedPassword.trim()).to.equal(resultPassword);
    });

    describe("warning message test", function() {
      beforeEach(function() {
        viewBlueprintPage.createUserAccountButton.click();
        createUserAccount.loading();
      });

      afterEach(function() {
        createUserAccount.cancelButton.click();
        $(createUserAccount.containerSelector).waitForExist(5000, true);
      });

      it("should show duplicated name warning message", function() {
        createUserAccount.userNameBox.setInputValue(username);
        expect(createUserAccount.userErrorLabel.getText()).to.equal("This user name already exists.");
        expect(createUserAccount.createButton.getAttribute("disabled")).to.equal("true");
      });

      it("User name should be auto-filled according to Full name", function() {
        do {
          createUserAccount.fullNameBox.setInputValue("x y");
        } while (createUserAccount.fullNameBox.getAttribute("value") !== "x y");
        expect(createUserAccount.userNameBox.getAttribute("value")).to.equal("xy");
      });

      it("should show password error message", function() {
        createUserAccount.fullNameBox.setInputValue("x y");
        createUserAccount.passwordBox.setInputValue("aaa");
        createUserAccount.confirmPasswordBox.setInputValue("bbb");
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
