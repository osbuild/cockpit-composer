import constants from '../core/constants';
import MetadataApi from '../data/MetadataApi';


class RecipeApi {
  constructor() {
    this.recipe = {};
  }

  // Get the recipe details, and its dependencies
  // Object layout is:
  // {recipes: [{recipe: RECIPE, modules: MODULES}, ...]}
  // Where MODULES is a modules/info/ object {name: "", projects: [{...
  getRecipe(recipeName) {
      if (this.recipe.recipe !== undefined) {
        return Promise.resolve(this.recipe);
      } else {
        let p = new Promise((resolve, reject) => {
            fetch(constants.get_recipes_deps + recipeName)
            .then(r => r.json())
            .then(data => {
              // update data so that it includes a list of components and a list of dependencies
                let components = [];
                if (data.recipes[0].recipe.modules.length > 0) {
                  data.recipes[0].recipe.modules.map(i => {
                    let component = this.makeRecipeComponent(i, data.recipes[0].modules, "Module");
                    components.push(component);
                  })
                }
                if (data.recipes[0].recipe.packages.length > 0) {
                  data.recipes[0].recipe.packages.map(i => {
                    let component = this.makeRecipeComponent(i, data.recipes[0].modules, "RPM");
                    components.push(component);
                  })
                }

                let dependencies = [];
                // list of dependencies is pulled from list from components
                components.map(i => {
                  if (i.projects.length > 0) {
                    dependencies = dependencies.concat(i.projects);
                  }
                });
                data.recipes[0].recipe.components = components;
                data.recipes[0].recipe.dependencies = dependencies;
                let recipe = data.recipes[0];
                let componentNames = MetadataApi.getNames(components);
                if (dependencies.length === 0) {
                  // get metadata for the components only
                  Promise.all([
                      MetadataApi.getData(constants.get_module_info + componentNames)
                  ]).then((data) => {
                    recipe.recipe.components = MetadataApi.updateComponentMetadata(recipe.recipe.components, data[0], false);
                    this.recipe = recipe.recipe;
                    resolve(recipe.recipe);
                  }).catch(e => console.log('Error getting recipe metadata: ' + e));
                } else {
                  // get metadata for the components
                  // get metadata for the dependencies
                  // gets dependencies for dependencies
                  let dependencyNames = MetadataApi.getNames(dependencies);
                  Promise.all([
                      MetadataApi.getData(constants.get_module_info + componentNames),
                      MetadataApi.getData(constants.get_module_info + dependencyNames),
                      MetadataApi.getData(constants.get_dependencies_list + dependencyNames)
                  ]).then((data) => {
                    recipe.recipe.components = MetadataApi.updateComponentMetadata(recipe.recipe.components, data[0], false);
                    recipe.recipe.dependencies = MetadataApi.updateComponentMetadata(recipe.recipe.dependencies, data[1], true);
                    recipe.recipe.dependencies = MetadataApi.updateComponentDependencies(recipe.recipe.dependencies, data[2]);
                    this.recipe = recipe.recipe;
                    resolve(recipe.recipe);
                  }).catch(e => console.log('Error getting recipe metadata: ' + e));
                }
            })
            .catch(e => {
                console.log("Error fetching recipes: " + e);
                reject();
            });
          }
      );
      return p;
    }
  }

  makeRecipeComponent(component, data, ui_type) {
    // takes a component object of known type, merges it with the matching
    // object in the modules array, and adds a few more properties to the
    // component object and component's array of dependency objects
    let modules = JSON.parse(JSON.stringify(data));
    let index = modules.map(i => {return i.name}).indexOf(component.name);
    let newComponent = Object.assign({}, component, modules[index]);
    newComponent.ui_type = ui_type;
    newComponent.inRecipe = true;
    newComponent.projects = MetadataApi.updateRecipeDependencies(newComponent);
    return newComponent;
  }

// update Recipe on Add or Remove component
// TODO include functionality for Remove action
  updateRecipe(component, action) {
    // action is add or remove, and maybe update
    if (action = "add") {
      let newComponent = {
        "name" : component.name,
        "version" : component.version
      };
      if (component.ui_type === "Module") {
        this.recipe.modules.push(newComponent);
      } else if (component.ui_type === "RPM") {
        this.recipe.packages.push(newComponent);
      }
    }

  }

  handleSaveRecipe() {
    // create recipe and post it
    let recipe = {
      "name": this.recipe.name,
      "description": this.recipe.description,
      "modules": this.recipe.modules,
      "packages": this.recipe.packages
    };
    fetch(constants.post_recipes_new, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    });

  }

}

export default new RecipeApi();
