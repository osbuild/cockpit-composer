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
};
