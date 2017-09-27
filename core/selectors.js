import { createSelector } from 'reselect';

const getPastLength = (state) => {
  const pastLength = state.recipes.past.length;
  return pastLength;
};

export const makeGetPastLength = () => createSelector(
  [getPastLength],
  (pastLength) => pastLength
);

const getFutureLength = (state) => {
  const futureLength = state.recipes.future.length;
  return futureLength;
};

export const makeGetFutureLength = () => createSelector(
  [getFutureLength],
  (futureLength) => futureLength
);

const getRecipeById = (state, recipeId) => {
  const recipeById = state.recipes.present.find(recipe => recipe.id === recipeId);
  return recipeById;
};

export const makeGetRecipeById = () => createSelector(
  [getRecipeById],
  (recipe) => recipe
);

const getSortedComponents = (state, recipe) => {
  // TODO; sort
  const sortedComponents = recipe.components;
  if (sortedComponents === undefined) {
    return [];
  }
  const key = state.sort.components.key;
  const value = state.sort.components.value;
  sortedComponents.sort((a, b) => {
    if (a[key] > b[key]) return value === 'DESC' ? 1 : -1;
    if (b[key] > a[key]) return value === 'DESC' ? -1 : 1;
    return 0;
  });
  return sortedComponents;
};

export const makeGetSortedComponents = () => createSelector(
  [getSortedComponents],
  (components) => components
);

const getSortedDependencies = (state, recipe) => {
  const sortedDependencies = recipe.dependencies;
  if (sortedDependencies === undefined) {
    return [];
  }
  const key = state.sort.dependencies.key;
  const value = state.sort.dependencies.value;
  sortedDependencies.sort((a, b) => {
    if (a[key] > b[key]) return value === 'DESC' ? 1 : -1;
    if (b[key] > a[key]) return value === 'DESC' ? -1 : 1;
    return 0;
  });
  return sortedDependencies;
};

export const makeGetSortedDependencies = () => createSelector(
  [getSortedDependencies],
  (dependencies) => dependencies
);

const getSortedRecipes = (state) => {
  const sortedRecipes = state.recipes.present;
  const key = state.sort.recipes.key;
  const value = state.sort.recipes.value;
  sortedRecipes.sort((a, b) => {
    if (a[key] > b[key]) return value === 'DESC' ? 1 : -1;
    if (b[key] > a[key]) return value === 'DESC' ? -1 : 1;
    return 0;
  });
  return sortedRecipes;
};

export const makeGetSortedRecipes = () => createSelector(
  [getSortedRecipes],
  (recipes) => recipes
);
