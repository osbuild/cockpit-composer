import constants from "../core/constants";
import NotificationsApi from "./NotificationsApi";
import utils from "../core/utils";

class BlueprintApi {
  constructor() {
    this.blueprint = undefined;
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
