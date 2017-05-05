// Edit Recipe page object
const MainPage = require('./main');

module.exports = class EditRecipePage extends MainPage {
  constructor(recipeName) {
    super('Recipe');
    this.recipeName = recipeName;

    // Edit Recipe label
    this.varEditRecipe = 'Edit Recipe';
    this.labelEditRecipe = '.breadcrumb li strong';

    // Recipe Name link
    this.varLinkToViewRec = `${this.mailUrl}#/recipe/${this.recipeName}`;
    this.linkRecipeName = '.breadcrumb  li + li a';

    // Recipe Title label
    this.labelRecipeTitle = '.cmpsr-title-summary__item';

    // Create Composition button
    this.varCreateCompos = 'Create Composition';
    this.btnCreateCompos = 'button[data-target="#cmpsr-modal-crt-compos"]';

    // Save button
    this.btnSave = '.cmpsr-edit-actions .btn-primary';

    // component count inside the pagination control
    this.totalComponentCount = '.cmpsr-recipe-inputs-pagination span';
  }

  get url() {
    return `${this.mailUrl}#/edit/${this.recipeName}`;
  }
};
