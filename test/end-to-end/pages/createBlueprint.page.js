import ComposerPage from './composer.page';
import BlueprintsPage from './blueprints.page';

class CreateBlueprintPage extends ComposerPage {
  // Create Blueprint page title
  get title() { return browser.element('[id="cmpsr-modal-crt-blueprint"] [id="myModalLabel"] span'); }
  // X button on the up right corner
  get close() { return browser.element('[id="cmpsr-modal-crt-blueprint"] .modal-header .close'); }
  // Name text input
  get name() { return browser.element('[id="cmpsr-modal-crt-blueprint"] [id="textInput-modal-markup"]'); }
  // Description text input
  get description() { return browser.element('[id="cmpsr-modal-crt-blueprint"] [id="textInput2-modal-markup"]'); }
  // Alert message box
  get alert() { return browser.element('[id="cmpsr-modal-crt-blueprint"] .alert-danger strong span'); }
  // Help Block message box
  get helpBlock() { return browser.element('[id="cmpsr-modal-crt-blueprint"] .help-block span'); }
  // Create button
  get create() { return browser.element('[id="cmpsr-modal-crt-blueprint"] .modal-footer .btn-primary'); }
  // Cancel button
  get cancel() { return browser.element('[id="cmpsr-modal-crt-blueprint"] .modal-footer .btn-default'); }

  open() {
    super.open();
    BlueprintsPage.createBlueprint.click();
    this.title.waitForVisible();
  }
}

export default new CreateBlueprintPage();
