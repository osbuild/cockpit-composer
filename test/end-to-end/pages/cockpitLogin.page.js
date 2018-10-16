// Cockpit login page object
import Page from './page';
import Config from '../wdio.conf';

class CockpitLoginPage extends Page {
  get credential() { return { username: 'root', password: 'foobar' }; }

  get username() { return browser.element('[id="login-user-input"]'); }
  get password() { return browser.element('[id="login-password-input"]'); }
  get form() { return browser.element('[id="login-button"]'); }

  open() {
    super.open(Config.baseUrl);
  }

  submit() {
    this.form.click();
  }
}

export default new CockpitLoginPage();
