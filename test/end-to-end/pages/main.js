const config = require('../wdio.conf.js');

// Root Page object
module.exports = class MainPage {
  constructor(title) {
    this.mailUrl = config.config.baseUrl;
    this.title = title;
    this.iframeSelector = 'iframe[name="cockpit1:localhost/welder"]';
  }

  get url() {
    return `${this.mailUrl}`;
  }
};
