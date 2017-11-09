// Edit Recipe page object
const MainPage = require('./main');
const pageConfig = require('../config');

module.exports = class EditRecipePage extends MainPage {
  constructor(recipeName) {
    super('Recipe');
    this.recipeName = recipeName;

// ---- Root element selector ---- //
    // Navigation bar root element
    this.navBarRootElement = 'ol[class="breadcrumb"]';
    // Edit action bar root element
    this.editActionBarRootElement = 'div[class="cmpsr-header__actions"]';

    // Title bar root element
    this.titleBarRootElement = 'div[class="cmpsr-title"]';

    // Recipe inputs root element
    this.recipeInputRootElement = '.cmpsr-panel__body--sidebar';

    // Recipe list edit root element
    this.recipeListEditRootElement = '.cmpsr-panel__body--main';

    // Component list item root element
    this.componentListItemRootElement = `${this.recipeInputRootElement} .cmpsr-list-pf__compacted .list-pf-item`;
// ---- Page element selector ---- //
    // Edit Recipe label
    this.varEditRecipe = 'Edit Recipe';
    this.labelEditRecipe = `${this.navBarRootElement} li strong`;

    // Recipe Name link
    this.varLinkToViewRec = `${this.mailUrl}#/recipe/${this.recipeName}`;
    if (pageConfig.root.includes('9090')) {
      this.varLinkToViewRec = `${this.mailUrl.slice(0, -10)}cockpit/@localhost/welder-web/index.html#/recipe/${this.recipeName}`;
    }
    this.linkRecipeName = `${this.navBarRootElement}  li + li a`;

    // Recipe Title label
    this.labelRecipeTitle = `${this.titleBarRootElement} h1[class="cmpsr-title__item"]`;

    // Create Composition button
    this.varCreateCompos = 'Create Composition';
    this.btnCreateCompos = `${this.recipeListEditRootElement} button[data-target="#cmpsr-modal-crt-compos"]`;

    // More action button
    this.btnMore = `${this.recipeListEditRootElement} button[id="dropdownKebab"]`;

    // Export action
    this.menuActionExport = `${this.recipeListEditRootElement} ul[aria-labelledby="dropdownKebab"] li:nth-child(1) a`;

    // Save button
    this.btnSave = `${this.editActionBarRootElement} ul li button[class="btn btn-primary"]`;

    // component count inside the pagination control
    this.totalComponentCount = `${this.recipeInputRootElement} .cmpsr-recipe__inputs__pagination span`;

    // More Action dropdown menu list
    this.moreActionList = {
      Export: 'Export',
    };
  }

  get url() {
    return `${this.mailUrl}#/edit/${this.recipeName}`;
  }
};
