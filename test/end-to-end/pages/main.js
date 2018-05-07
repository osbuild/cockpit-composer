// Root Page object
module.exports = class MainPage {
  constructor(title) {
    this.mailUrl = '/';
    this.title = title;
    this.iframeSelector = '.container-frame';
  }

  get url() {
    return `${this.mailUrl}`;
  }
};
