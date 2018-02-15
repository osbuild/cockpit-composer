import constants from '../core/constants';
import MetadataApi from '../data/MetadataApi';
import NotificationsApi from '../data/NotificationsApi';
import history from '../core/history';
import utils from '../core/utils';

class BlueprintApi {
  constructor() {
    this.blueprint = undefined;
  }

  // Get the blueprint details, and its dependencies
  // Object layout is:
  // {blueprints: [{blueprint: RECIPE, modules: NEVRA, dependencies: NEVRA}, ...]}
  // Where RECIPE is a blueprint object
  // NEVRA is a list of name, epoch, version, release, arch objects.
  // "modules" are the specific versions for the blueprint's modules and packages
  // "dependencies" are all the things that are required to satisfy the blueprint
  getBlueprint(blueprintName) {
    const p = new Promise((resolve, reject) => {
      utils.apiFetch(constants.get_blueprints_deps + blueprintName)
            .then(data => {
              // bdcs-api v0.3.0 includes module (component) and dependency NEVRAs
              // tagging all dependencies a "RPM" for now
              const dependencies = data.blueprints[0].dependencies ?
                  this.makeBlueprintDependencies(data.blueprints[0].dependencies, 'RPM') :
                  [];
              // Tag objects as Module if modules and RPM if packages, for now
              const components = this.makeBlueprintComponents(data.blueprints[0]);
              const blueprint = data.blueprints[0].blueprint;
              if (components.length > 0) {
                const componentNames = MetadataApi.getNames(components);
                if (dependencies.length === 0) {
                    // get metadata for the components only
                  Promise.all([
                    MetadataApi.getData(constants.get_projects_info + componentNames),
                  ]).then((compData) => {
                    blueprint.components = MetadataApi.updateComponentMetadata(components, compData[0]);
                    blueprint.dependencies = [];
                    this.blueprint = blueprint;
                    resolve(blueprint);
                  }).catch(e => console.log(`getBlueprint: Error getting component metadata: ${e}`));
                } else {
                    // get metadata for the components
                    // get metadata for the dependencies
                    // get dependencies for dependencies
                  const dependencyNames = MetadataApi.getNames(dependencies);
                  Promise.all([
                    MetadataApi.getData(constants.get_projects_info + componentNames),
                    MetadataApi.getData(constants.get_projects_info + dependencyNames),
                  ]).then((compData) => {
                    blueprint.components = MetadataApi.updateComponentMetadata(components, compData[0]);
                    blueprint.dependencies = MetadataApi.updateComponentMetadata(dependencies, compData[1]);
                    this.blueprint = blueprint;
                    resolve(blueprint);
                  }).catch(e => console.log(`getBlueprint: Error getting component and dependency metadata: ${e}`));
                }
              } else {
                  // there are no components, just a blueprint name and description
                blueprint.components = [];
                blueprint.dependencies = [];
                this.blueprint = blueprint;
                resolve(blueprint);
              }
            })
            .catch(e => {
              console.log(`Error fetching blueprint: ${e}`);
              reject();
            });
    });
    return p;
  }

  getBlueprintWorkspace(blueprintRaw) {
    const p = new Promise((resolve, reject) => {
      const blueprint = blueprintRaw;
      const componentNames = blueprintRaw.packages.map(item => item.name);
      if (componentNames.length > 0) {
        utils.apiFetch(constants.get_projects_info + componentNames)
          .then(compData => {
            // bdcs-api v0.3.0 includes module (component) and dependency NEVRAs
            // tagging all dependencies a "RPM" for now
            let components = compData.projects;
            components = this.setType(components, blueprintRaw.modules, 'Module');
            components = this.setType(components, compData.projects, 'RPM');
            components.map(component => {
              component.inBlueprint = true; // eslint-disable-line no-param-reassign
              component.user_selected = true; // eslint-disable-line no-param-reassign
              component.version = component.builds[0].source.version; // eslint-disable-line no-param-reassign
              component.release = component.builds[0].release; // eslint-disable-line no-param-reassign
            });
            utils.apiFetch(constants.get_projects_deps + componentNames)
              .then(depData => {
                let dependencies = depData.projects;
                dependencies = this.setType(dependencies, depData.projects, 'RPM');
                blueprint.components = components
                blueprint.dependencies = dependencies;
                this.blueprint = blueprint;
                resolve(blueprint);
              }).catch(e => console.log(`getBlueprint: Error getting component and dependency metadata: ${e}`));
          })
          .catch(e => {
            console.log('catch');
            console.log(`Error fetching blueprint: ${e}`);
            reject();
          });
      } else {
        // there are no components, just a blueprint name and description
        blueprint.components = [];
        blueprint.dependencies = [];
        this.blueprint = blueprint;
        resolve(blueprint);
      }
    });
    return p;
  }

  // set additional metadata for each of the components
  makeBlueprintComponents(data) {
    let components = data.modules;
    components = this.setType(components, data.blueprint.modules, 'Module');
    components = this.setType(components, data.blueprint.packages, 'RPM');
    components.map(i => {
      i.inBlueprint = true; // eslint-disable-line no-param-reassign
      i.user_selected = true; // eslint-disable-line no-param-reassign
      return i;
    });
    return components;
  }

  setType(components, array, type) {
    for (const i of array) {
      // find the array object within components; set ui_type and version for component
      const component = components.find(x => x.name === i.name);
      component.ui_type = type;
      component.version = i.version;
    }
    return components;
  }

  // set additional metadata for each of the dependencies
  makeBlueprintDependencies(components, uiType) {
    return components.map(i => {
      i.inBlueprint = true; // eslint-disable-line no-param-reassign
      i.ui_type = uiType; // eslint-disable-line no-param-reassign
      return i;
    });
  }

// update Blueprint on Add or Remove component
  updateBlueprint(component, action) {
    const blueprintComponent = {
      name: component.name,
      version: component.version,
    };
    // action is add or remove, and maybe update
    if (action === 'add') {
      if (component.ui_type === 'Module') {
        this.blueprint.modules.push(blueprintComponent);
      } else if (component.ui_type === 'RPM') {
        this.blueprint.packages.push(blueprintComponent);
      }
    }
    if (action === 'edit') {
      if (component.ui_type === 'Module') {
        // comment the following two lines to fix eslint no-unused-vars error
        // let updatedComponent = this.blueprint.modules.filter((obj) => (obj.name === blueprintComponent.name))[0];
        // updatedComponent = Object.assign(updatedComponent, blueprintComponent);
      } else if (component.ui_type === 'RPM') {
        // comment the following two lines to fix eslint no-unused-vars error
        // let updatedComponent = this.blueprint.packages.filter((obj) => (obj.name === blueprintComponent.name))[0];
        // updatedComponent = Object.assign(updatedComponent, blueprintComponent);
      }
    }
    if (action === 'remove') {
      if (component.ui_type === 'Module') {
        this.blueprint.modules = this.blueprint.modules.filter(
          (obj) => (!(obj.name === blueprintComponent.name && obj.version === blueprintComponent.version))
        );
      } else if (component.ui_type === 'RPM') {
        this.blueprint.packages = this.blueprint.packages.filter(
          (obj) => (!(obj.name === blueprintComponent.name && obj.version === blueprintComponent.version))
        );
      }
    }
  }

  handleCreateBlueprint(event, blueprint) {
    return this.postBlueprint(blueprint).then(() => {
      window.location.hash = history.createHref(`/edit/${blueprint.name}`);
    }).catch((e) => { console.log(`Error creating blueprint: ${e}`); });
  }
  handleSaveBlueprint() {
    // create blueprint and post it
    const blueprint = {
      name: this.blueprint.name,
      description: this.blueprint.description,
      version: this.blueprint.version,
      modules: this.blueprint.modules,
      packages: this.blueprint.packages,
    };
    const p = new Promise((resolve, reject) => {
      this.postBlueprint(blueprint)
      .then(() => {
        NotificationsApi.closeNotification(undefined, 'saving');
        NotificationsApi.displayNotification(this.blueprint.name, 'saved');
        resolve();
      }).catch(e => {
        console.log(`Error saving blueprint: ${e}`);
        NotificationsApi.displayNotification(this.blueprint.name, 'saveFailed');
        reject();
      });
    });
    return p;
  }

  handleEditDescription(description) {
    // update cached blueprint data
    this.blueprint.description = description;
    // create blueprint variable to post updates
    const blueprint = {
      name: this.blueprint.name,
      description,
      version: this.blueprint.version,
      modules: this.blueprint.modules,
      packages: this.blueprint.packages,
    };
    const p = new Promise((resolve, reject) => {
      this.postBlueprint(blueprint)
      .then(() => {
        resolve();
      }).catch(e => {
        console.log(`Error updating blueprint description: ${e}`);
        reject();
      });
    });
    return p;
  }

  postBlueprint(blueprint) {
    return utils.apiFetch(constants.post_blueprints_new, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blueprint),
    }, true);
  }

  reloadBlueprintDetails() {
    // retrieve blueprint details that were updated during save (i.e. version)
    // and reload details in UI
    const p = new Promise((resolve, reject) => {
      utils.apiFetch(constants.get_blueprints_deps + this.blueprint.name.replace(/\s/g, '-'))
      .then(data => {
        const blueprint = data.blueprints[0].blueprint;
        this.blueprint.version = blueprint.version;
        resolve(blueprint);
      })
      .catch(e => {
        console.log(`Error fetching blueprint details: ${e}`);
        reject();
      });
    });
    return p;
  }

  deleteBlueprint(blueprints) {
    // /api/v0/blueprints/delete/<blueprint>
    return utils.apiFetch(constants.delete_blueprint + blueprints, {
      method: 'DELETE',
    }, true);
  }

}

export default new BlueprintApi();
