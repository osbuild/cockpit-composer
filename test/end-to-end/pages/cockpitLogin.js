// Cockpit login page object
module.exports = class CockpitLoginPage {
  constructor() {
    // username and password input
    this.usernameInput = 'input[id="login-user-input"]';
    this.passwordInput = 'input[id="login-password-input"]';
     // resue my password for privileged tasks checkbox
    this.resusePasswordCheckbox = 'input[id="authorized-input"]';
     // log in button
    this.loginButton = 'button[id="login-button"]';
  }
};
