import constants from './constants';
import fetch from 'isomorphic-fetch';
import RecipeApi from '../data/RecipeApi';
import MetadataApi from '../data/MetadataApi';
import utils from './utils';

export function fetchUsersApi() {
  const data = fetch(constants.get_users_url, { credentials: 'same-origin' })
    .then(response => response.json());
  return data;
}

export function fetchRecipeContentsApi(recipeName) {
  const recipeContents = Promise.all([RecipeApi.getRecipe(recipeName)])
    .then(data => {
      const recipe = data[0];
      recipe.id = recipeName;
      return recipe;
    })
    .catch(err => console.log(`Error in fetchModalRecipeContents promise: ${err}`));
  return recipeContents;
}

export function fetchRecipeInputsApi(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  const p = new Promise((resolve, reject) => {
      // /modules/list looks like:
      // {"modules":[{"name":"389-ds-base","group_type":"rpm"},{"name":"389-ds-base-libs","group_type":"rpm"}, ...]}
    utils.apiFetch(`${constants.get_modules_list + filter}?limit=${pageSize}&offset=${page}`)
      .then(data => {
        const total = data.total;
        let components = data.modules;
        const componentNames = MetadataApi.getNames(components);
        Promise.all([
          MetadataApi.getData(constants.get_projects_info + componentNames),
        ]).then((result) => {
          components = MetadataApi.updateInputMetadata(components, result[0], true);
          components.map(i => { i.ui_type = 'RPM'; return i; }); // eslint-disable-line no-param-reassign
          resolve([components, total]);
        }).catch(e => console.log(`Error getting recipe metadata: ${e}`));
      })
      .catch(e => {
        console.log(`Failed to get inputs during recipe edit: ${e}`);
        reject();
      });
  });
  return p;
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

export function setRecipeDescriptionApi(recipe, description) {
  RecipeApi.handleEditDescription(description);
}

export function saveRecipeApi(recipe) {
  utils.apiFetch(constants.post_recipes_new, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  }, true)
    // .then(() => resolve())
  .catch(e => {
    console.log(`Error saving recipe: ${e}`);
  });
}

export function deleteRecipeApi(recipe) {
  const deletedRecipe = Promise.all([RecipeApi.deleteRecipe(recipe)])
    .then(() => recipe);
  return deletedRecipe;
}
