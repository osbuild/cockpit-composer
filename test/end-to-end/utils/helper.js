const config = require('../wdio.conf.js');

module.exports = {
  // Switch to welder-web iframe if welder-web is integrated with Cockpit.
  // Cockpit web service is listening on TCP port 9090.
  goto: (page) => {
    if (config.config.baseUrl.includes('9090')) {
      browser
        .url(page.url)
        .waitForExist(page.iframeSelector);

      browser
        .frame($(page.iframeSelector).value)

      // wait for the body to load inside the iframe
      browser
        .waitForVisible('body');

      return browser;
    }

    return browser.url(page.url);
  },
};
