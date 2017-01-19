import {default as tabTemplate} from './pf-tab.template';
import {default as tabsTemplate} from './pf-tabs.template';
import PfTab from './pf-tab.component';

/**
 * <b>&lt;pf-tabs&gt;</b> element for Patternfly Web Components
 *
 * @example {@lang xml}
 * <pf-tabs>
 *  <pf-tab tabTitle="Tab1" active="true">
 *    <p>Tab1 content here</p>
 *  </pf-tab>
 *  <pf-tab tabTitle="Tab2">
 *    <p>Tab2 content here</p>
 *  </pf-tab>
 * </pf-tabs>
 *
 */
export class PfTabs extends HTMLElement {
  /**
   * Called when an instance was inserted into the document
   */
  attachedCallback () {
    this.insertBefore(this._tabsTemplate.content, this.firstChild);

    this._makeTabsFromPfTab();

    this.querySelector('ul').addEventListener('click', this);

    // Add the ul class if specified
    this.querySelector('ul').className = this.attributes.class ?
      this.attributes.class.value : 'nav nav-tabs';

    if (!this.mutationObserver) {
      this.mutationObserver = new MutationObserver(this._handleMutations.bind(this));
      this.mutationObserver.observe(this, { childList: true, attributes: true });
    }
  }

  /**
   * Called when element's attribute value has changed
   *
   * @param {string} attrName The attribute name that has changed
   * @param {string} oldValue The old attribute value
   * @param {string} newValue The new attribute value
   */
  attributeChangedCallback (attrName, oldValue, newValue) {
    if (attrName === 'class') {
      this.querySelector('ul').className = newValue;
    }
  }

  /**
   * Called when an instance of the element is created
   */
  createdCallback () {
    this._tabsTemplate = document.createElement('template');
    this._tabsTemplate.innerHTML = tabsTemplate;

    this.selected = null;
    this.tabMap = new Map();
    this.panelMap = new WeakMap();
    this.displayMap = new WeakMap();
  }

  /**
   * Called when the element is removed from the DOM
   */
  detachedCallback () {
    this.querySelector('ul').removeEventListener('click', this);
  }

  /**
   * Handle the tab change event
   *
   * @param event {Event} Handle the tab change event
   */
  handleEvent (event) {
    if (event.target.tagName === 'A') {
      this._setTabStatus(event.target.parentNode);
    }
  }

  /**
   * Handle mutations
   *
   * @param mutations
   * @private
   */
  _handleMutations (mutations) {
    let self = this;
    let handlers = [];
    mutations.forEach(function (mutationRecord) {
      //child dom nodes have been added
      if ( mutationRecord.type === 'childList' ) {
        forEach.call(mutationRecord.addedNodes, function (node) {
          handlers.push(['add', node]);
        });
        forEach.call(mutationRecord.removedNodes, function (node) {
          handlers.push(['remove', node]);
        });
      }  else if (mutationRecord.type === 'attributes') {
        //mutationRecord.attributeName contains changed attributes
        //note: we can ignore this for attributes as the v1 spec of custom
        //elements already provides attributeChangedCallback
      }
    });
    if (handlers.length) {
      requestAnimationFrame(function () {
        let ul = self.querySelector('ul');
        handlers.forEach(function (notes) {
          let action = notes[0];
          let pfTab = notes[1];
          let tab;

          //ignore Angular directive #text and #comment nodes
          if (pfTab.nodeName !== "PF-TAB") {
            return;
          }

          if (action === 'add') {
            //add tab
            tab = self._makeTab(pfTab);
            self.tabMap.set(tab, pfTab);
            self.panelMap.set(pfTab, tab);

            //if active, deactivate others
            if (pfTab.attributes.active) {
              self.tabMap.forEach(function (value, key) {
                let fn = tab === key ? self._makeActive : self._makeInactive;
                fn.call(self, key);
              });
            } else {
              self._makeInactive(tab);
            }
            ul.appendChild(tab);
          } else {
            //remove tab
            tab = self.panelMap.get(pfTab);
            tab.parentNode.removeChild(tab);
            self.panelMap.delete(pfTab);
            self.tabMap.delete(tab);
            self.displayMap.delete(tab);

            //we removed the active tab, make the last one active
            if (pfTab.attributes.active) {
              let last = ul.querySelector('li:last-child');
              self._setTabStatus(last);
            }
          }
        });
      });
    }
  }

  /**
   * Handle the tabTitle change event
   *
   * @param panel {string} The tab panel
   * @param tabTitle {string} The tab title
   */
  handleTitle (panel, tabTitle) {
    let tab = this.panelMap.get(panel);
    //attribute changes may fire as Angular is rendering
    //before this tab is in the panelMap, so check first
    if (tab) {
      tab.textContent = panel.tabTitle;
    }
  }

  /**
   * Sets the active tab programmatically
   * @param tabTitle
   */
  setActiveTab(tabTitle){
    this.tabMap.forEach((value, key) => {
      let tabtitle = value.attributes.tabtitle ? value.attributes.tabtitle.value : value.tabtitle;
      if(tabtitle === tabTitle){
        this._setTabStatus(key);
      }
    });
  }

  /**
   * Helper function to create tabs
   *
   * @private
   */
  _makeTabsFromPfTab () {
    let ul = this.querySelector('ul');
    let pfTabs = this.querySelectorAll('pf-tab');
    [].forEach.call(pfTabs, function (pfTab, idx) {
      let tab = this._makeTab(pfTab);
      ul.appendChild(tab);
      this.tabMap.set(tab, pfTab);
      this.panelMap.set(pfTab, tab);

      if (idx === 0) {
        this._makeActive(tab);
      } else {
        pfTab.style.display = 'none';
      }
    }.bind(this));
  }

  /**
   * Helper function to create a new tab element from given tab
   *
   * @param pfTab A PfTab element
   * @returns {PfTab} A new PfTab element
   * @private
   */
  _makeTab (pfTab) {
    let frag = document.createElement('template');
    frag.innerHTML = tabTemplate;
    let tab = frag.content.firstElementChild;
    let tabAnchor = tab.firstElementChild;
    //React gives us a node with attributes, Angular adds it as a property
    tabAnchor.innerHTML = pfTab.attributes && pfTab.attributes.tabTitle ?
      pfTab.attributes.tabTitle.value : pfTab.tabTitle;
    this.displayMap.set(pfTab, pfTab.style.display);
    return tab;
  }

  /**
   * Helper function to make given tab active
   *
   * @param tab A PfTab element
   * @private
   */
  _makeActive (tab) {
    tab.classList.add('active');
    let pfTab = this.tabMap.get(tab);
    let naturalDisplay = this.displayMap.get(pfTab);
    pfTab.style.display = naturalDisplay;
    pfTab.setAttribute('active','');
  }

  /**
   * Helper function to make given tab inactive
   *
   * @param tab A PfTab element
   * @private
   */
  _makeInactive (tab) {
    tab.classList.remove('active');
    let pfTab = this.tabMap.get(tab);
    pfTab.style.display = 'none';
    pfTab.removeAttribute('active');
  }

  /**
   * Helper function to set tab status
   *
   * @param {boolean} active True if active
   * @param {string} tabtitle the tab title
   * @private
   */
  _setTabStatus (active) {
    if (active === this.selected) {
      return;
    }
    this.selected = active;

    let activeTabTitle;
    let tabs = this.querySelector('ul').children;
    [].forEach.call(tabs, function (tab) {
      if(active === tab){
        activeTabTitle = tab.querySelector('a').text;
      }
      let fn = active === tab ? this._makeActive : this._makeInactive;
      fn.call(this, tab);
    }.bind(this));

    //dispatch the custom 'tabChanged' event for framework listeners
    var eventObj = new CustomEvent('tabChanged', {
      detail: activeTabTitle
    });
    this.dispatchEvent(eventObj);
  }
}
(function () {
  document.registerElement('pf-tabs', PfTabs);
}());
