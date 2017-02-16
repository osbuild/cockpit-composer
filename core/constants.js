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


  // common functions
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
  },
  getMetadata: function(componentName) {
    let p = new Promise((resolve, reject) => {
        fetch(constants.get_module_info + componentName)
        .then(r => r.json())
        .then(function(data){
          resolve(data);
        })
        .catch(e => {
            console.log("Failed to get module info: " + e);
        });
    });
    return p;
  },
  getDependencies: function(componentName) {
    let p = new Promise((resolve, reject) => {
        fetch(constants.get_dependencies_list + componentName)
        .then(r => r.json())
        .then(function(data){
          resolve(data);
        })
        .catch(e => {
            console.log("Failed to get module info: " + e);
        });
    });
    return p;
  }

};



export default constants;
