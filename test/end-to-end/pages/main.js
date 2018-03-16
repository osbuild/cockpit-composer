const config = require('../wdio.conf.js');

// Root Page object
module.exports = class MainPage {
  constructor(title) {
    this.mailUrl = config.config.baseUrl;
    this.title = title;
    this.iframeSelector = '.container-frame';
  }

  get url() {
    return `${this.mailUrl}`;
  }
};
