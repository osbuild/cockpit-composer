/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
import faker from 'faker';

export default class Page {
  constructor() {
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

    this._blueprint = { name: '', description: '', packages: [] };
  }

  get blueprint() { return this._blueprint; }
  set blueprint(packages) {
    this._blueprint.name = faker.lorem.words();
    this._blueprint.description = faker.lorem.sentence();
    this._blueprint.packages = packages;
  }

  open(path) {
    browser.url(path);
  }
}
