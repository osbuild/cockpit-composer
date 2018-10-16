import Page from './page';
import CockpitLoginPage from './cockpitLogin.page';

class ComposerPage extends Page {
  get navImageBuilder() { return browser.element('[data-original-title="Image Builder"]'); }
  get myIframe() { return browser.element('iframe[name="cockpit1:localhost/welder"]'); }
  get iframeContent() { return browser.element('body'); }

  open() {
    // open cockpit login page, login with username and password
    CockpitLoginPage.open();
    CockpitLoginPage.username.setValue(CockpitLoginPage.credential.username);
    CockpitLoginPage.password.setValue(CockpitLoginPage.credential.password);
    CockpitLoginPage.submit();
    // navigate to Image Builder module in cockpit UI
    this.navImageBuilder.click();
    // switch to composer iframe
    this.myIframe.frame();
    this.iframeContent.waitForVisible();
  }

  // create a new blueprint and go back to the same page as open() reached
  openWithNewBlueprint() {
    this.open();
  }
}

export default new ComposerPage();
