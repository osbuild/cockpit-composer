const config = require('../wdio.conf.js');

// Root Page object
module.exports = class MainPage {
  constructor(title) {
    this.mailUrl = browser.options.baseUrl;
    this.title = title;
    this.iframeSelector = 'iframe[name="cockpit1:localhost/welder"]';
    switch (browser.desiredCapabilities.browserName) {
      case 'firefox':
        this.enter = '\u000d';
        break;
      case 'chrome':
        this.enter = '\n';
        break;
      default:
        this.enter = '\u000d';
    }
  }

  get url() {
    return `${this.mailUrl}`;
  }
};
