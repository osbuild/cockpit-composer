/* global welderApiHost */
/* *
  Application Constants
 */

const constants = {
  // These are placeholders
  get_apps_url: '/json/apps.json',
  get_projects_url: '/json/projects.json',
  get_users_url: '/json/users.json',

  // BDCS API paths
  get_recipes_list: `${welderApiHost}/api/v0/recipes/list`,
  get_recipes_info: `${welderApiHost}/api/v0/recipes/info/`,
  get_recipes_deps: `${welderApiHost}/api/v0/recipes/depsolve/`,
  get_modules_list: `${welderApiHost}/api/v0/modules/list`,
  get_module_info: `${welderApiHost}/api/v0/projects/info/`,
  get_dependencies_list: `${welderApiHost}/api/v0/modules/info/`,
  get_compose_types: `${welderApiHost}/api/v0/compose/types`,
  post_recipes_new: `${welderApiHost}/api/v0/recipes/new`,

};


export default constants;
