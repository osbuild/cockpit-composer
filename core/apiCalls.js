import constants from './constants';
import fetch from 'isomorphic-fetch';
import RecipeApi from '../data/RecipeApi';
import utils from './utils';

export function fetchUsersApi() {
  const data = fetch(constants.get_users_url, { credentials: 'same-origin' })
    .then(response => response.json());
  return data;
}

export function fetchModalRecipeContentsApi(modalRecipeName) {
  const modalRecipeContents = Promise.all([RecipeApi.getRecipe(modalRecipeName)])
    .then(data => data[0].dependencies)
    .catch(err => console.log(`Error in fetchModalRecipeContents promise: ${err}`));
  return modalRecipeContents;
}

export function fetchRecipeNamesApi() {
  const recipeNames = utils.apiFetch(constants.get_recipes_list)
    .then(response => response.recipes);
  return recipeNames;
}

export function fetchRecipeInfoApi(recipeName) {
  const recipeFetch = utils.apiFetch(constants.get_recipes_info + recipeName)
    .then(recipedata => {
      if (recipedata.recipes.length > 0) {
        const recipe = recipedata.recipes[0];
        recipe.id = recipeName;
        return recipe;
      }
      return null;
    });
  return recipeFetch;
}

export function deleteRecipeApi(recipe) {
  const deletedRecipe = Promise.all([RecipeApi.deleteRecipe(recipe)])
    .then(() => recipe);
  return deletedRecipe;
}
