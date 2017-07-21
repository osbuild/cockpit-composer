export const FETCHING_RECIPES = 'FETCHING_RECIPES';
export const fetchingRecipes = () => ({
  type: FETCHING_RECIPES,
});

export const FETCHING_RECIPES_SUCCEEDED = 'FETCHING_RECIPES_SUCCEEDED';
export const fetchingRecipesSucceeded = (recipes) => ({
  type: FETCHING_RECIPES_SUCCEEDED,
  payload: {
    recipes,
  },
});

export const DELETING_RECIPE = 'DELETING_RECIPE';
export const deletingRecipe = (recipe) => ({
  type: DELETING_RECIPE,
  payload: {
    recipe,
  },
});

export const DELETING_RECIPE_SUCCEEDED = 'DELETING_RECIPE_SUCCEEDED';
export const deletingRecipeSucceeded = (recipe) => ({
  type: DELETING_RECIPE_SUCCEEDED,
  payload: {
    recipe,
  },
});

export const RECIPES_FAILURE = 'RECIPES_FAILURE';
export const recipesFailure = (error) => ({
  type: RECIPES_FAILURE,
  payload: {
    error,
  },
});
