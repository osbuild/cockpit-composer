import NotificationsApi from "./NotificationsApi";
import * as composer from "../core/composer";

class BlueprintApi {
  constructor() {
    this.blueprint = undefined;
  }

  handleCommitBlueprint(blueprint) {
    return composer
      .newBlueprint(this.postedBlueprintData(blueprint))
      .then(() => {
        NotificationsApi.closeNotification(undefined, "committing");
        NotificationsApi.displayNotification(blueprint.name, "committed");
      })
      .catch(e => {
        console.log(`Error committing blueprint: ${e}`);
        NotificationsApi.closeNotification(undefined, "committing");
        NotificationsApi.displayNotification(blueprint.name, "commitFailed");
      });
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

  reloadBlueprintDetails(blueprint) {
    // retrieve blueprint details that were updated during save (i.e. version)
    // and reload details in UI
    return composer
      .depsolveBlueprint(blueprint.name.replace(/\s/g, "-"))
      .then(data => {
        return Object.assign({}, blueprint, {
          version: data.blueprints[0].blueprint.version
        });
      })
      .catch(e => {
        console.log(`Error fetching blueprint details: ${e}`);
      });
  }
}

export default new BlueprintApi();
