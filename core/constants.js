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
  get_compose_types: composer_api_host + "/api/v0/compose/types",

  setComponentType: function(data, inRecipe) {
    // get the list of modules in recipe, set their type to modules
    // get the list of packages, set their type to rpm
    let modules = [];
    if (data['modules'] != undefined) {
      modules = data['modules'].slice(0);
      modules.map(i => {
        i.ui_type = "Module";
        i.inRecipe = inRecipe;
      });
    }
    let rpms = [];
    if (data['packages'] != undefined) {
      rpms = data['packages'].slice(0);
      rpms.map(i => {
        i.ui_type = "RPM";
        i.inRecipe = inRecipe;
      });
    }
    return modules.concat(rpms);
  }

};

export default constants;
