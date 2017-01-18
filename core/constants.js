/* *
  Application Constants
 */

const constants = {
  // These are placeholders
  get_apps_url : '/json/apps.json',
  get_projects_url: '/json/projects.json',
  get_users_url: '/json/users.json',

  // BDCS API paths
  get_recipes_url: composer_api_host + "/api/v0/recipe/list",
  // TODO get this using the regular recipe URL, rename "recipe_api_url" to something less dumb
  get_recipe_url: composer_api_host + '/recipe',
  get_recipe_api_url: composer_api_host + "/api/v0/recipe/",
  get_components_url: composer_api_host + "/api/v0/module/list",
  get_comptypes_url: composer_api_host + "/api/v0/compose/types"
};

export default constants;
