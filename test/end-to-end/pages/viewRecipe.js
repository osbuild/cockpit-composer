// View Recipe page object
const MainPage = require('./main');

module.exports = class ViewRecipePage extends MainPage {
  constructor(recipeName) {
    super('Recipe');
    this.recipeName = recipeName;

    // Create Composition button
    this.varCreateCompos = 'Create Composition';
    this.btnCreateCompos = '#cmpsr-btn-crt-compos';

    // Recipe Name label
    this.labelRecipeName = '.breadcrumb li strong';

    // Recipe Title label
    this.labelRecipeTitle = '.cmpsr-title-summary__item';
  }

  get url() {
    return `${this.mailUrl}#/recipe/${this.recipeName}`;
  }

  // Edit Recipe button
  get btnEditRecipe() {
    return `a[href="#/recipe/${this.recipeName}]`;
  }
};
