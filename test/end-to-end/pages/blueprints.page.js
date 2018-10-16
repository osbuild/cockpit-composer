import ComposerPage from './composer.page';

class BlueprintsPage extends ComposerPage {
  // Create Blueprint button
  get createBlueprint() { return browser.element('[data-target="#cmpsr-modal-crt-blueprint"]'); }
  // Blueprint name link
  get blueprintName() { return browser.element(`a[href="#/blueprint/${this.blueprint.name}"]`); }
  // Blueprint Description
  get blueprintDescription() { return browser.element('.list-group-item-text'); }
  // A list of blueprints
  get blueprintList() { return browser.element('.container-fluid .list-view-pf-view .list-group-item'); }
  // Edit Blueprint button
  get editBlueprint() { return browser.element(`[data-blueprint="${this.blueprint.name}"] a[href*="edit"]`); }
  // Create Image button
  get createImage() { return browser.element(`a[href="#/edit/${this.blueprint.name}"] + .btn-default`); }
  // More(:) button
  get more() { return browser.element(`a[href="#/edit/${this.blueprint.name}"] ~ div > button`); }
  // Export drop down item after click More(:)
  get export() { return browser.element(`a[href="#/edit/${this.blueprint.name}"] ~ div ul > li:nth-child(1) > a`); }
  // Delete drop down item after click More(:)
  get delete() { return browser.element(`a[href="#/edit/${this.blueprint.name}"] ~ div ul > li:nth-child(2) > a`); }
}

export default new BlueprintsPage();
