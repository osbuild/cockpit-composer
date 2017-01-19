/* *
  Application Constants
 */

const constants = {
  // These are placeholders
  get_apps_url : '/json/apps.json',
  get_projects_url: '/json/projects.json',
  get_users_url: '/json/users.json',

  // BDCS API paths
  get_recipes_list: composer_api_host + "/api/v0/recipes/list",
  get_recipes_info: composer_api_host + "/api/v0/recipes/info/",
  get_modules_list: composer_api_host + "/api/v0/modules/list",
  get_compose_types: composer_api_host + "/api/v0/compose/types"
};

export default constants;
