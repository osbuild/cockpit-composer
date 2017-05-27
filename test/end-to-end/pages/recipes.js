// View Recipe page object
const MainPage = require('./main');

module.exports = class RecipesPage extends MainPage {
  constructor() {
    super('Recipes');

    // Button - Create Recipe
    this.varCreateRecipe = 'Create Recipe';
    this.btnCreateRecipe = 'button[data-target="#cmpsr-modal-crt-recipe"]';

    // Link - Recipe Name in the recipes list
    this.linkRecipeName = 'a[href="#/recipe/"]';

    // Label - Recipe Description in the recipes list
    this.labelRecipeDescr = '.list-group-item-text';

    // More Action dropdown menu list
    this.moreActionList = {
      Export: 'Export',
      Archive: 'Archive',
    };
  }

  get url() {
    return `${this.mailUrl}#/recipes`;
  }

  // Recipe Name link
  static recipeNameSelector(name) {
    return `a[href="#/recipe/${name}"]`;
  }

  // Create Composition button
  static btnCreateCompos(name) {
    return `a[href="#/edit/${name}"] + .btn-default`;
  }

  // More button
  static btnMore(name) {
    return `a[href="#/edit/${name}"] ~ div > button`;
  }

  // Export action in dropdown menu
  static menuActionExport(name) {
    return `a[href="#/edit/${name}"] ~ div ul > li:nth-child(1) > a`;
  }
};
