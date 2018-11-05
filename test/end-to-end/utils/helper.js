const config = require('../wdio.conf.js');
const CockpitLoginPage = require('../pages/cockpitLogin');

module.exports = {
  // Switch to welder-web iframe if welder-web is integrated with Cockpit.
  // Cockpit web service is listening on TCP port 9090.
  goto: (page) => {
    // clearing cockie is to force auth when nevigate page by URL not by page element
    // sometimes the edge will show Certificate error page even it's passed at the
    // same session. Passing error page has to follow cockpit auth page.
    browser.deleteCookie();
    browser.url(page.url);
    // call windowHandle to work around browser hang here sometimes
    browser.windowHandle();
    browser.waitForVisible('body');

    // pass Certificate error page reported by edge only.
    if (browser.getTitle().includes('Certificate error')) {
      browser
        .waitForVisible('[id="moreInformationDropdownLink"]');
      browser
        .click('[id="moreInformationDropdownLink"]');
      browser
        .waitForVisible('[id="invalidcert_continue"]');
      browser
        .click('[id="invalidcert_continue"]');
      browser
        .waitForVisible('[id="badge"]');
    }

    // if there's a cockpit login page
    if (!browser.getAttribute('head base', 'href').includes('cockpit')) {
      const cockpitLoginPage = new CockpitLoginPage();

      browser
        .waitForEnabled(cockpitLoginPage.loginButton);

      browser
        .waitUntil(() => browser.hasFocus(cockpitLoginPage.usernameInput),
                         90000,
                         'expected page element to be different after 5s'
                  );

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
  },
};
