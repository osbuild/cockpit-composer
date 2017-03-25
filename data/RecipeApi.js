import constants from '../core/constants';
import MetadataApi from '../data/MetadataApi';
import history from '../core/history';
import utils from '../core/utils';

class RecipeApi {
  constructor() {
    this.recipe = undefined;
  }

  // Get the recipe details, and its dependencies
  // Object layout is:
  // {recipes: [{recipe: RECIPE, modules: NEVRA, dependencies: NEVRA}, ...]}
  // Where RECIPE is a recipe object
  // NEVRA is a list of name, epoch, version, release, arch objects.
  // "modules" are the specific versions for the recipe's modules and packages
  // "dependencies" are all the things that are required to satisfy the recipe
  getRecipe(recipeName) {
      if (this.recipe !== undefined && this.recipe.name == recipeName) {
        return Promise.resolve(this.recipe);
      } else {
        let p = new Promise((resolve, reject) => {
            utils.apiFetch(constants.get_recipes_deps + recipeName)
            .then(data => {
                // bdcs-api v0.3.0 includes module (component) and dependency NEVRAs
                let dependencies = data.recipes[0].dependencies;
                // XXX Tag the objects all as Modules for now
                let components = this.makeRecipeComponents(data.recipes[0].modules, "Module");
                let recipe = data.recipes[0].recipe;
                if (components.length > 0) {
                  let componentNames = MetadataApi.getNames(components);
                  if (dependencies.length === 0) {
                    // get metadata for the components only
                    Promise.all([
                        MetadataApi.getData(constants.get_projects_info + componentNames)
                    ]).then((data) => {
                      recipe.components = MetadataApi.updateComponentMetadata(components, data[0]);
                      recipe.dependencies = [];
                      this.recipe = recipe;
                      resolve(recipe);
                    }).catch(e => console.log('getRecipe: Error getting component metadata: ' + e));
                  } else {
                    // get metadata for the components
                    // get metadata for the dependencies
                    // get dependencies for dependencies
                    let dependencyNames = MetadataApi.getNames(dependencies);
                    Promise.all([
                        MetadataApi.getData(constants.get_projects_info + componentNames),
                        MetadataApi.getData(constants.get_projects_info + dependencyNames)
                    ]).then((data) => {
                      recipe.components = MetadataApi.updateComponentMetadata(components, data[0]);
                      recipe.dependencies = MetadataApi.updateComponentMetadata(dependencies, data[1]);
                      this.recipe = recipe;
                      resolve(recipe);
                    }).catch(e => console.log('getRecipe: Error getting component and dependency metadata: ' + e));
                  }
                } else {
                  // there are no components, just a recipe name and description
                  this.recipe = recipe;
                  resolve(recipe);
                }
            })
            .catch(e => {
                console.log("Error fetching recipe: " + e);
                reject();
            });
          }
      );
      return p;
    }
  }

  // Add .inRecipe = true and .ui_type to each of the components
  makeRecipeComponents(components, ui_type) {
    return components.map(i => {
        i.inRecipe = true;
        i.ui_type = ui_type;
        return i;
    });
  }

// update Recipe on Add or Remove component
  updateRecipe(component, action) {
    let recipeComponent = {
      "name" : component.name,
      "version" : component.version
    };
    // action is add or remove, and maybe update
    if (action === "add") {
      if (component.ui_type === "Module") {
        this.recipe.modules.push(recipeComponent);
      } else if (component.ui_type === "RPM") {
        this.recipe.packages.push(recipeComponent);
      }
    }
    if (action === "edit") {
      if (component.ui_type === "Module") {
        let updatedComponent = this.recipe.modules.filter((obj) => (obj.name === recipeComponent.name))[0];
        updatedComponent = Object.assign(updatedComponent, recipeComponent);
      } else if (component.ui_type === "RPM") {
        let updatedComponent = this.recipe.packages.filter((obj) => (obj.name === recipeComponent.name))[0];
        updatedComponent = Object.assign(updatedComponent, recipeComponent);
      }
    }
    if (action === "remove") {
      if (component.ui_type === "Module") {
        this.recipe.modules = this.recipe.modules.filter((obj) => (obj.name !== recipeComponent.name && obj.version !== recipeComponent.version));
      } else if (component.ui_type === "RPM") {
        this.recipe.packages = this.recipe.packages.filter((obj) => (obj.name !== recipeComponent.name && obj.version !== recipeComponent.version));
      }
    }
  }

  handleCreateRecipe(e, recipe) {
    return this.postRecipe(recipe).then(() => {
      window.location.hash = history.createHref("/edit/" + recipe.name);
    }).catch((e) => { console.log("Error creating recipe: " + e)});
  }
  handleSaveRecipe(e) {
    // create recipe and post it
    let recipe = {
      "name": this.recipe.name,
      "description": this.recipe.description,
      "modules": this.recipe.modules,
      "packages": this.recipe.packages
    };
    this.postRecipe(recipe).then(() => {
      console.log("Recipe was saved.")
    }).catch((e) => { console.log("Error saving recipe: " + e)});
  }

  postRecipe(recipe) {
    return utils.apiFetch(constants.post_recipes_new, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    }, true);
  }

}

export default new RecipeApi();
