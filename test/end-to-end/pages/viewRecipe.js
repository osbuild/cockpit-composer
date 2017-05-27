// View Recipe page object
const MainPage = require('./main');

module.exports = class ViewRecipePage extends MainPage {
  constructor(recipeName) {
    super('Recipe');
    this.recipeName = recipeName;

// ---- Root element selector ---- //
    // Navigation bar root element
    this.navRootElement = 'ol[class="breadcrumb"]';

    // Title bar root element
    this.titleRootElement = 'div[class="cmpsr-title-summary"]';

    // Tab root element
    this.tabRootElement = 'pf-tabs';

    // Tab list root element
    this.tabListRootElement = `${this.tabRootElement} ul[role="tablist"]`;

    // Detail tab page root element
    this.detailTabRootElement = `${this.tabRootElement} pf-tab[tabtitle="Details"]`;

    // Components tab page root element
    this.componentsTabRootElement = `${this.tabRootElement} pf-tab[tabtitle="Components"]`;

    // Revisions tab page root element
    this.revisionsTabRootElement = `${this.tabRootElement} pf-tab[tabtitle="Revisions"]`;

    // Compositions tab page root element
    this.compositionsTabRootElement = `${this.tabRootElement} pf-tab[tabtitle="Compositions"]`;

    // Errata tab page root element
    this.errataTabRootElement = `${this.tabRootElement} pf-tab[tabtitle="Errata"]`;

// ---- Page element selector ---- //
    // Nav-bar: Recipe Name label
    this.labelRecipeName = `${this.navRootElement} li strong`;

    // Title-bar: Recipe Title label
    this.labelRecipeTitle = `${this.titleRootElement} h1[class="cmpsr-title-summary__item"]`;

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
      case 'Revisions':
        return `${this.tabListRootElement} li:nth-child(3) a`;
      case 'Compositions':
        return `${this.tabListRootElement} li:nth-child(4) a`;
      case 'Errata':
        return `${this.tabListRootElement} li:nth-child(5) a`;
      default:
        return `${this.tabListRootElement} li:nth-child(2) a`;
    }
  }
};
