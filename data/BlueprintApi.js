import constants from '../core/constants';
import MetadataApi from '../data/MetadataApi';
import NotificationsApi from '../data/NotificationsApi';
import history from '../core/history';
import utils from '../core/utils';

class BlueprintApi {
  constructor() {
    this.blueprint = undefined;
  }

  // Get the blueprint details, and its components
  // Object layout is:
  // {blueprints: [{blueprint: BLUEPRINT, modules: NEVRA, components: NEVRA}, ...]}
  // Where BLUEPRINT is a blueprint object
  // NEVRA is a list of name, epoch, version, release, arch objects.
  // "modules" are the specific versions for the blueprint's modules and packages
  // "components" are all the things that are required to satisfy the blueprint
  getBlueprint(blueprintName) {
    const p = new Promise((resolve, reject) => {
      utils.apiFetch(constants.get_blueprints_deps + blueprintName)
      .then(data => {
        // bdcs-api v0.3.0 includes module (component) and component NEVRAs
        // tagging all components a "RPM" for now
        const components = data.blueprints[0].dependencies ?
            this.makeBlueprintComponents(data.blueprints[0].dependencies, 'RPM') :
            [];
        // Tag objects as Module if modules and RPM if packages, for now
        const selectedComponents = this.makeBlueprintSelectedComponents(data.blueprints[0]);
        const blueprint = data.blueprints[0].blueprint;
        if (selectedComponents.length > 0) {
          const selectedComponentNames = MetadataApi.getNames(selectedComponents);
          if (components.length === 0) {
              // get metadata for the components only
            Promise.all([
              MetadataApi.getData(constants.get_projects_info + selectedComponentNames),
            ]).then((compData) => {
              blueprint.components = MetadataApi.updateComponentMetadata(selectedComponents, compData[0]);
              this.blueprint = blueprint;
              resolve(blueprint);
            }).catch(e => console.log(`getBlueprint: Error getting component metadata: ${e}`));
          } else {
              // get metadata for the components
            const componentNames = MetadataApi.getNames(components);
            Promise.all([
              MetadataApi.getData(constants.get_projects_info + componentNames),
            ]).then((compData) => {
              blueprint.components = MetadataApi.updateComponentMetadata(components, compData[0]);
              this.blueprint = blueprint;
              resolve(blueprint);
            }).catch(e => console.log(`getBlueprint: Error getting component and component metadata: ${e}`));
          }
        } else {
            // there are no components, just a blueprint name and description
          blueprint.components = [];
          this.blueprint = blueprint;
          resolve(blueprint);
        }
      })
      .catch(e => {
        console.log('Error fetching blueprint', e);
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
        utils.apiFetch(constants.get_projects_deps + componentNames)
          .then(depData => {
            // bdcs-api v0.3.0 includes module (component) and component NEVRAs
            // tagging all components a "RPM" for now
            let components = this.setType(depData.projects, 'RPM');
            blueprint.components = components;
            this.blueprint = blueprint;
            resolve(blueprint);
          })
          .catch(e => {
            console.log('getBlueprint: Error getting component and component metadata', e);
            reject();
          });
      } else {
        // there are no components, just a blueprint name and description
        blueprint.components = [];
        this.blueprint = blueprint;
        resolve(blueprint);
      }
    });
    return p;
  }

  // set additional metadata for each of the components
  makeBlueprintSelectedComponents(data) {
    const modules = this.setType(data.blueprint.modules, 'Module');
    let components = modules.concat(this.setType(data.blueprint.packages, 'RPM'));
    components.map(i => {
      i.inBlueprint = true; // eslint-disable-line no-param-reassign
      i.userSelected = true; // eslint-disable-line no-param-reassign
      return i;
    });
    return components;
  }

  // sets the ui type of a list of components 
  setType(components, type) {
    components.map(component => {
      component.ui_type = type;
    });
    return components;
  }

  // set additional metadata for each of the components
  makeBlueprintComponents(components, uiType) {
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

  handleCommitBlueprint() {
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
        NotificationsApi.closeNotification(undefined, 'committing');
        NotificationsApi.displayNotification(this.blueprint.name, 'committed');
        resolve();
      }).catch(e => {
        console.log(`Error committing blueprint: ${e}`);
        NotificationsApi.displayNotification(this.blueprint.name, 'commitFailed');
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
