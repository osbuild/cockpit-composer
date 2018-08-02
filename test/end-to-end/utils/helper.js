const config = require('../wdio.conf.js');
const CockpitLoginPage = require('../pages/cockpitLogin');

module.exports = {
  // Switch to welder-web iframe if welder-web is integrated with Cockpit.
  // Cockpit web service is listening on TCP port 9090.
  goto: (page) => {
    if (config.config.baseUrl.includes('9090')) {
      browser
        .url(page.url)
        // wait for final page loaded not intermedia page
        .pause(5000);

      // if there's a cockpit login page
      if (!browser.getHTML('base').includes('cockpit')) {
        const cockpitLoginPage = new CockpitLoginPage();
        browser
          .waitUntil(() => browser.
                             hasFocus(cockpitLoginPage.usernameInput),
                             5000,
                             'expected page element to be different after 5s');
        browser
          .setValue(cockpitLoginPage.usernameInput, config.testData.cockpit.root.username)
          .setValue(cockpitLoginPage.passwordInput, config.testData.cockpit.root.password)
          .click(cockpitLoginPage.loginButton);
      }

      browser
        .waitForExist(page.iframeSelector);
      browser
        .frame($(page.iframeSelector).value);

      // wait for the body to load inside the iframe
      browser
        .waitForVisible('body');

      return browser;
    }

    return browser.url(page.url);
  },
};
