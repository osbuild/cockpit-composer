/* *
  Application Constants
 */

const constants = {
  // These are placeholders
  get_apps_url : '/json/apps.json',
  get_projects_url: '/json/projects.json',
  get_users_url: '/json/users.json',

  // BDCS API paths
  get_recipes_list: welder_api_host + "/api/v0/recipes/list",
  get_recipes_info: welder_api_host + "/api/v0/recipes/info/",
  get_recipes_deps: welder_api_host + "/api/v0/recipes/depsolve/",
  get_modules_list: welder_api_host + "/api/v0/modules/list",
  get_module_info: welder_api_host + "/api/v0/projects/info/",
  get_dependencies_list: welder_api_host + "/api/v0/modules/info/",
  get_compose_types: welder_api_host + "/api/v0/compose/types",
  post_recipes_new: welder_api_host + "/api/v0/recipes/new",

};



export default constants;
