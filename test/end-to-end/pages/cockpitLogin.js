// Cockpit login page object
module.exports = class CockpitLoginPage {
  constructor() {
    // username and password input
    this.usernameInput = '#login-user-input';
    this.passwordInput = '#login-password-input';

    // resue my password for privileged tasks checkbox
    this.resusePasswordCheckbox = '#authorized-input';

    // log in button
    this.loginButton = '#login-button';
  }
};
