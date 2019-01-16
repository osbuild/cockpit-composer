import constants from "../core/constants";
import MetadataApi from "./MetadataApi";
import NotificationsApi from "./NotificationsApi";
import history from "../core/history";
import utils from "../core/utils";

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
      utils
        .apiFetch(constants.get_blueprints_deps + blueprintName)
        .then(data => {
          // bdcs-api v0.3.0 includes module (component) and component NEVRAs
          // tagging all components a "RPM" for now
          const components = data.blueprints[0].dependencies
            ? this.makeBlueprintComponents(data.blueprints[0].dependencies, "RPM")
            : [];
          // Tag objects as Module if modules and RPM if packages, for now
          const selectedComponents = this.makeBlueprintSelectedComponents(data.blueprints[0]);
          const blueprint = data.blueprints[0].blueprint;
          if (selectedComponents.length > 0) {
            const selectedComponentNames = MetadataApi.getNames(selectedComponents);
            if (components.length === 0) {
              // get metadata for the components only
              Promise.all([MetadataApi.getData(constants.get_projects_info + selectedComponentNames)])
                .then(compData => {
                  blueprint.components = MetadataApi.updateComponentMetadata(selectedComponents, compData[0]);
                  this.blueprint = blueprint;
                  resolve(blueprint);
                })
                .catch(e => console.log(`getBlueprint: Error getting component metadata: ${e}`));
            } else {
              // get metadata for the components
              const componentNames = MetadataApi.getNames(components);
              Promise.all([MetadataApi.getData(constants.get_projects_info + componentNames)])
                .then(compData => {
                  blueprint.components = MetadataApi.updateComponentMetadata(components, compData[0]);
                  this.blueprint = blueprint;
                  resolve(blueprint);
                })
                .catch(e => console.log(`getBlueprint: Error getting component and component metadata: ${e}`));
            }
          } else {
            // there are no components, just a blueprint name and description
            blueprint.components = [];
            this.blueprint = blueprint;
            resolve(blueprint);
          }
        })
        .catch(e => {
          console.log("Error fetching blueprint", e);
          reject();
        });
    });
    return p;
  }

  // set additional metadata for each of the components
  makeBlueprintSelectedComponents(data) {
    const modules = this.setType(data.blueprint.modules, "Module");
    let components = modules.concat(this.setType(data.blueprint.packages, "RPM"));
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

  handleCommitBlueprint(blueprint) {
    const p = new Promise((resolve, reject) => {
      this.postBlueprint(this.postedBlueprintData(blueprint))
        .then(() => {
          NotificationsApi.closeNotification(undefined, "committing");
          NotificationsApi.displayNotification(blueprint.name, "committed");
          resolve();
        })
        .catch(e => {
          console.log(`Error committing blueprint: ${e}`);
          NotificationsApi.closeNotification(undefined, "committing");
          NotificationsApi.displayNotification(blueprint.name, "commitFailed");
          reject();
        });
    });
    return p;
  }

  handleEditDescription(blueprint, description) {
    const updatedBlueprint = Object.assign({}, blueprint, { description: description });
    const p = new Promise((resolve, reject) => {
      this.postBlueprint(this.postedBlueprintData(updatedBlueprint))
        .then(() => {
          resolve();
        })
        .catch(e => {
          console.log(`Error updating blueprint description: ${e}`);
          reject();
        });
    });
    return p;
  }

  postedBlueprintData(blueprint) {
    const blueprintData = {
      name: blueprint.name,
      description: blueprint.description,
      version: blueprint.version,
      modules: blueprint.modules,
      packages: blueprint.packages,
      groups: blueprint.groups !== undefined ? blueprint.groups : []
    };
    if (blueprint.customizations !== undefined) {
      blueprintData.customizations = blueprint.customizations;
    }
    return blueprintData;
  }

  postBlueprint(blueprint) {
    return utils.apiFetch(
      constants.post_blueprints_new,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(blueprint)
      },
      true
    );
  }

  reloadBlueprintDetails(blueprint) {
    // retrieve blueprint details that were updated during save (i.e. version)
    // and reload details in UI
    const p = new Promise((resolve, reject) => {
      utils
        .apiFetch(constants.get_blueprints_deps + blueprint.name.replace(/\s/g, "-"))
        .then(data => {
          const updatedBlueprint = Object.assign({}, blueprint, {
            version: data.blueprints[0].blueprint.version
          });
          resolve(updatedBlueprint);
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
    return utils.apiFetch(
      constants.delete_blueprint + blueprints,
      {
        method: "DELETE"
      },
      true
    );
  }
}

export default new BlueprintApi();
