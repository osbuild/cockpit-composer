// "Blueprint Components" component in Edit Blueprint page
class SelectedComponents {
  constructor() {
    this.containerSelector = '.cmpsr-blueprint__components';
    this.components = '.cmpsr-blueprint__components > .list-pf-item';
  }

  loading() {
    // wait for blank slate disappear
    browser.waitForExist('[id="blueprint-tabs"]', timeout);
    browser.waitForText(this.containerSelector, timeout);
  }

  get packageList() {
    const selector = `${this.containerSelector} .list-pf-container .list-pf-title`;
    browser.waitUntil(
      () => browser.isExisting(selector),
      timeout,
      'No package added in Selected Component'
    );
    return $$(selector);
  }

  packageNameByNth(nth) {
    return $$(this.components)[nth].$('.list-pf-title a').getText();
  }

  moreButtonByNth(nth) {
    return $$(this.components)[nth].$('.fa-ellipsis-v');
  }

  moreButtonByName(name) {
    let moreButton;
    $$(this.components).some((component) => {
      if (component.$('.list-pf-title a').getText() === name) {
        moreButton = component.$('.fa-ellipsis-v');
        return true;
      }
    })
    return moreButton;
  }
}

module.exports = new SelectedComponents();