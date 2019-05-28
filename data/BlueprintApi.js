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
    return utils.post("/api/v0/blueprints/new", blueprint);
  }

  reloadBlueprintDetails(blueprint) {
    // retrieve blueprint details that were updated during save (i.e. version)
    // and reload details in UI
    const p = new Promise((resolve, reject) => {
      utils
        .get("/api/v0/blueprints/depsolve/" + blueprint.name.replace(/\s/g, "-"))
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
}

export default new BlueprintApi();
