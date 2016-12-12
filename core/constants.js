/* *
  Application Constants
 */

const constants = {
  get_apps_url : composer_api_host + '/apps',
  get_projects_url: composer_api_host + '/projects',
  get_users_url: composer_api_host + '/users',
  get_recipes_url: composer_api_host + "/api/v0/recipe/list",
  // TODO get this using the regular recipe URL, rename "recipe_api_url" to something less dumb
  get_recipe_url: composer_api_host + '/recipe',
  get_recipe_api_url: composer_api_host + "/api/v0/recipe/",
  get_components_url: composer_api_host + "/api/v0/module/list",
  get_comptypes_url: composer_api_host + "/api/v0/compose/types"
};

export default constants;
