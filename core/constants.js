/* *
  Application Constants
 */

const composer_api_host = "";

const constants = {
  get_apps_url : 'json/apps.json',
  get_projects_url: 'json/projects.json',
  get_users_url: 'json/users.json',
  get_recipes_url: composer_api_host + "/api/v0/recipe/list",
  get_recipe_url: 'json/recipe.json',
  get_components_url: composer_api_host + "/api/v0/module/list",
  get_comptypes_url: composer_api_host + "/api/v0/compose/types"
};

export default constants;
