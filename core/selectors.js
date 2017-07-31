import { createSelector } from 'reselect';

const getRecipeById = (state, recipeId) => {
  const recipeById = state.recipes.find(recipe => recipe.id === recipeId);
  return recipeById;
};

export const makeGetRecipeById = () => createSelector(
  [getRecipeById],
  (recipe) => recipe
);
