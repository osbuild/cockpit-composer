// View Recipe page object
const MainPage = require('./main');

module.exports = class ViewRecipePage extends MainPage {
  constructor(recipeName) {
    super('Recipe');
    this.recipeName = recipeName;

// ---- Root element selector ---- //
    // Navigation bar root element
    this.navRootElement = '.cmpsr-header .breadcrumb';

    // Title bar root element
    this.titleRootElement = 'div[class="cmpsr-title"]';

    // Tab root element
    this.tabRootElement = 'pf-tabs';

    // Tab list root element
    this.tabListRootElement = `${this.tabRootElement} ul[role="tablist"]`;

    // Details tab content root element
    this.detailsContentRootElement = `${this.tabRootElement} pf-tab[tabtitle="Details"]`;

    // Components tab content root element
    this.componentsContentRootElement = `${this.tabRootElement} pf-tab[tabtitle="Components"]`;

    // Compositions tab content root element
    this.compositionsContentRootElement = `${this.tabRootElement} pf-tab[tabtitle="Compositions"]`;

// ---- Page element selector ---- //
    // Nav-bar: Recipe Name label
    this.labelRecipeName = `${this.navRootElement} li strong`;

    // Title-bar: Recipe Title label
    this.labelRecipeTitle = `${this.titleRootElement} h1[class="cmpsr-title__item"]`;

    // Page-level actions
    this.pagelevelActions = '[class="cmpsr-header__actions"]';

    // Create Composition button
    this.varCreateCompos = 'Create Composition';
    this.btnCreateCompos = '#cmpsr-btn-crt-compos';

    // More action button
    this.btnMore = 'button[id="dropdownKebab"]';

    // Export action
    this.menuActionExport = 'ul[aria-labelledby="dropdownKebab"] li:nth-child(1) a';

    // Tool bar more Action dropdown menu list item
    this.toolBarMoreActionList = {
      Export: 'Export',
    };

    // Detail tab element
    this.detailTabElement = `${this.tabListRootElement} li:nth-child(1) a`;

    // Components tab page element
    this.componentsTabElement = `${this.tabListRootElement} li:nth-child(2) a`;

    // Compositions tab page element
    this.compositionsTabElement = `${this.tabListRootElement} li:nth-child(3) a`;

    // Selected Components tab under Components tab
    this.tabSelectedComponents = `${this.componentsContentRootElement} pf-tabs ul[role="tablist"] li:nth-child(1) a`;

    // Dependencies tab under Components tab
    this.tabDependencies = `${this.componentsContentRootElement} pf-tabs ul[role="tablist"] li:nth-child(2) a`;

    // Selected Components content
    this.contentSelectedComponents = `${this.componentsContentRootElement} pf-tabs pf-tab
                                      div[class="list-pf cmpsr-list-pf list-pf-stacked cmpsr-recipe__components"]`;
  }

  get url() {
    return `${this.mailUrl}#/recipe/${this.recipeName}`;
  }

  // Edit Recipe button
  get btnEditRecipe() {
    return `a[href="#/recipe/${this.recipeName}]`;
  }

  tabLink(tabName) {
    switch (tabName) {
      case 'Details':
        return `${this.tabListRootElement} li:nth-child(1) a`;
      case 'Components':
        return `${this.tabListRootElement} li:nth-child(2) a`;
      case 'Compositions':
        return `${this.tabListRootElement} li:nth-child(3) a`;
      default:
        return `${this.tabListRootElement} li:nth-child(2) a`;
    }
  }
};
