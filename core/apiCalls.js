import constants from "./constants";
import BlueprintApi from "../data/BlueprintApi";
import utils from "./utils";
import history from "./history";

export function createBlueprintApi(blueprint) {
  return utils
    .apiFetch(
      constants.post_blueprints_new,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(blueprint)
      },
      true
    )
    .then(() => (window.location.hash = history.createHref(`/edit/${blueprint.name}`)))
    .catch(e => console.log(`Error creating blueprint: ${e}`));
}

export function fetchBlueprintContentsApi(blueprintName) {
  return utils
    .apiFetch(constants.get_blueprints_deps + blueprintName)
    .catch(e => console.log("Error getting blueprint contents", e));
}

export function fetchBlueprintInputsApi(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  return utils
    .apiFetch(`${constants.get_modules_list + filter}?limit=${pageSize}&offset=${page}`)
    .then(response => [response.modules, response.total])
    .catch(e => console.log("Error getting blueprint inputs", e));
}

export function fetchComponentDetailsApi(componentNames) {
  return utils
    .apiFetch(constants.get_projects_info + componentNames)
    .then(response => response.projects)
    .catch(e => console.log("Error getting component details", e));
}

export function fetchDepsApi(componentNames) {
  const details = utils
    .apiFetch(constants.get_modules_info + componentNames)
    .then(response => {
      return response.modules;
    })
    .catch(e => console.log("Error getting dependencies", e));
  return details;
}

export function fetchBlueprintNamesApi() {
  const blueprintNames = utils.apiFetch(constants.get_blueprints_list).then(response => response.blueprints);
  return blueprintNames;
}

export function fetchBlueprintInfoApi(blueprintName) {
  const blueprintFetch = utils.apiFetch(constants.get_blueprints_info + blueprintName).then(blueprintdata => {
    if (blueprintdata.blueprints.length > 0) {
      let blueprint = blueprintdata.blueprints[0];
      blueprint.changed = blueprintdata.changes[0].changed;
      blueprint.id = blueprintName;
      return blueprint;
    }
    return null;
  });
  return blueprintFetch;
}

export function fetchModalCreateImageTypesApi() {
  const imageTypeLabels = {
    ami: "Amazon Machine Image Disk (.ami)",
    "ext4-filesystem": "Ext4 File System Image (.img)",
    "live-iso": "Live Bootable ISO (.iso)",
    "partitioned-disk": "Raw Partitioned Disk Image (.img)",
    qcow2: "QEMU QCOW2 Image (.qcow2)",
    openstack: "OpenStack Image (.qcow2)",
    tar: "TAR Archive (.tar)",
    vhd: "Azure Disk Image (.vhd)",
    vmdk: "VMware Virtual Machine Disk (.vmdk)"
  };
  const imageTypes = utils
    .apiFetch(constants.get_image_types)
    .then(data =>
      data.types.map(type => {
        return Object.assign({}, type, { label: imageTypeLabels[type.name] || type.name });
      })
    )
    .catch(e => console.log("Error getting component types", e));
  return imageTypes;
}

export function setBlueprintDescriptionApi(blueprint, description) {
  BlueprintApi.handleEditDescription(blueprint, description);
}

export function deleteBlueprintApi(blueprint) {
  const deletedBlueprint = Promise.all([BlueprintApi.deleteBlueprint(blueprint)]).then(() => blueprint);
  return deletedBlueprint;
}

export function deleteWorkspaceApi(blueprintId) {
  return utils
    .apiFetch(
      constants.delete_workspace + blueprintId,
      {
        method: "DELETE"
      },
      true
    )
    .catch(e => console.log("Error deleting workspace", e));
}

export function commitToWorkspaceApi(blueprint) {
  return utils
    .apiFetch(
      constants.post_blueprints_workspace,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(blueprint)
      },
      true
    )
    .catch(e => console.log("Error committing to workspace", e));
}

export function fetchDiffWorkspaceApi(blueprintId) {
  const p = new Promise((resolve, reject) => {
    utils
      .apiFetch("/api/v0/blueprints/diff/" + blueprintId + "/NEWEST/WORKSPACE")
      .then(data => {
        resolve(data);
      })
      .catch(e => {
        console.log("Error fetching diff", e);
        reject();
      });
  });
  return p;
}

export function fetchSourceInfoApi(sourceName) {
  const sourceFetch = utils
    .apiFetch(constants.get_sources_info + sourceName)
    .then(sourceData => {
      if (sourceData) {
        return sourceData;
      }
      return null;
    })
    .catch(e => {
      console.log("Error fetching sources", e);
    });
  return sourceFetch;
}

export function startComposeApi(blueprintName, composeType) {
  const requestBody = {
    blueprint_name: blueprintName,
    compose_type: composeType,
    branch: "master"
  };
  return utils
    .apiFetch(
      constants.post_compose_start,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      },
      true
    )
    .then(data => JSON.parse(data))
    .catch(e => console.log("Error starting compose", e));
}

export function cancelComposeApi(compose) {
  return utils
    .apiFetch(
      constants.cancel_compose + compose,
      {
        method: "DELETE"
      },
      true
    )
    .catch(e => console.log("Error canceling compose", e));
}

export function deleteComposeApi(compose) {
  return utils
    .apiFetch(
      constants.delete_compose + compose,
      {
        method: "DELETE"
      },
      true
    )
    .catch(e => console.log("Error deleting compose", e));
}

export function fetchImageStatusApi(uuid) {
  return utils
    .apiFetch(constants.get_image_status + uuid)
    .then(data => data)
    .catch(e => console.log("Error fetching image status", e));
}

export function fetchComposeQueueApi() {
  return utils
    .apiFetch(constants.get_compose_queue)
    .then(data => data.new.concat(data.run))
    .catch(e => console.log("Error fetching queued composes", e));
}

export function fetchComposeFinishedApi() {
  return utils
    .apiFetch(constants.get_compose_finished)
    .then(data => data.finished)
    .catch(e => console.log("Error fetching finished composes", e));
}

export function fetchComposeFailedApi() {
  return utils
    .apiFetch(constants.get_compose_failed)
    .then(data => data.failed)
    .catch(e => console.log("Error fetching failed composes", e));
}
