import { default as tmpl } from './panel.template';

/**
 * <b>&lt;pf-tab&gt;</b> element for Patternfly Web Components
 *
 * @example {@lang xml}
 * <pf-tabs>
 *  <pf-tab tab-title="Tab1" active="true">
 *    <p>Tab1 content here</p>
 *  </pf-tab>
 *  <pf-tab tab-title="Tab2">
 *    <p>Tab2 content here</p>
 *  </pf-tab>
 * </pf-tabs>
 *
 * @prop {string} tab-title the tab title
 * @prop {string} active if attribute exists, tab will be active
 */
export class PfTab extends HTMLElement {
  /*
   * Called every time the element is inserted into the DOM
   */
  connectedCallback() {
    this._tabTitle = this.getAttribute('tab-title');

    this.appendChild(this._template.content);
  }

  /*
   * Only attributes listed in the observedAttributes property will receive this callback
   */
  static get observedAttributes() {
    return ['tab-title'];
  }

  /**
   * Called when element's attribute value has changed
   *
   * @param {string} attrName The attribute name that has changed
   * @param {string} oldValue The old attribute value
   * @param {string} newValue The new attribute value
   */
  attributeChangedCallback(attrName, oldValue, newValue) {
    const parent = this.parentNode;
    if (attrName === 'tab-title' && parent && parent.handleTitle) {
      parent.handleTitle(this, newValue);
    }
  }

  /*
   * An instance of the element is created or upgraded
   */
  constructor() {
    super();
    this._template = document.createElement('template');
    this._template.innerHTML = tmpl;
  }

  /**
   * Get tab-title
   *
   * @returns {string} The tab-title
   */
  get tabTitle() {
    return this._tabTitle;
  }

  /**
   * Set tab tab-title
   *
   * @param {string} value The tab tab-title
   */
  set tabTitle(value) {
    if (this._tabTitle !== value) {
      this._tabTitle = value;
      this.setAttribute('tab-title', value);
    }
  }

  /**
   * Get flag indicating tab is active
   *
   * @returns {boolean} True if tab is active
   */
  get active() {
    return this._active;
  }

  /**
   * Set flag indicating tab is active
   *
   * @param {boolean} value True to set tab active
   */
  set active(value) {
    if (this._active !== value) {
      this._active = value;
      this.setAttribute('active', value);
    }
  }
}

window.customElements.define('pf-tab', PfTab);
