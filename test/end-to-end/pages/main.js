// Root Page object
const pageConfig = require('../config');

module.exports = class MainPage {
  constructor(title) {
    this.mailUrl = pageConfig.root;
    this.title = title;
    this.iframeSelector = '.container-frame';
    this.iframeLoadingTime = 3000;
  }
};
