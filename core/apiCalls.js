import BlueprintApi from "../data/BlueprintApi";
import utils from "./utils";
import history from "./history";

export function createBlueprintApi(blueprint) {
  return utils
    .apiFetch(
      "/api/v0/blueprints/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(blueprint)
      },
      true
    )
    .then(() => (window.location.hash = history.createHref(`/edit/${blueprint.name}`)));
}

export function fetchBlueprintContentsApi(blueprintName) {
  return utils.apiFetch("/api/v0/blueprints/depsolve/" + blueprintName);
}

export function fetchBlueprintInputsApi(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  return utils
    .apiFetch(`/api/v0/modules/list/${filter}?limit=${pageSize}&offset=${page}`)
    .then(response => [response.modules, response.total]);
}

export function fetchComponentDetailsApi(componentNames) {
  return utils.apiFetch("/api/v0/projects/info/" + componentNames).then(response => response.projects);
}

export function fetchDepsApi(componentNames) {
  const details = utils.apiFetch("/api/v0/modules/info/" + componentNames).then(response => {
    return response.modules;
  });
  return details;
}

export function fetchBlueprintNamesApi() {
  const blueprintNames = utils.apiFetch("/api/v0/blueprints/list").then(response => response.blueprints);
  return blueprintNames;
}

export function fetchBlueprintInfoApi(blueprintName) {
  const blueprintFetch = utils.apiFetch("/api/v0/blueprints/info/" + blueprintName).then(blueprintdata => {
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

export function fetchComposeTypesApi() {
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
  const imageTypes = utils.apiFetch("/api/v0/compose/types").then(data =>
    data.types.map(type => {
      return Object.assign({}, type, { label: imageTypeLabels[type.name] || type.name });
    })
  );
  return imageTypes;
}

export function deleteBlueprintApi(blueprint) {
  const deletedBlueprint = Promise.all([BlueprintApi.deleteBlueprint(blueprint)]).then(() => blueprint);
  return deletedBlueprint;
}

export function deleteWorkspaceApi(blueprintId) {
  return utils.apiFetch(
    "/api/v0/blueprints/workspace/" + blueprintId,
    {
      method: "DELETE"
    },
    true
  );
}

export function commitToWorkspaceApi(blueprint) {
  return utils.apiFetch(
    "/api/v0/blueprints/workspace",
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

export function fetchDiffWorkspaceApi(blueprintId) {
  return utils.apiFetch("/api/v0/blueprints/diff/" + blueprintId + "/NEWEST/WORKSPACE");
}

export function fetchSourceInfoApi(sourceName) {
  const sourceFetch = utils.apiFetch("/api/v0/projects/source/info/" + sourceName).then(sourceData => {
    if (sourceData) return sourceData;
    return null;
  });
  return sourceFetch;
}

export function addSourceApi(source) {
  return utils.apiFetch(
    "/api/v0/projects/source/new",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(source)
    },
    true
  );
}

export function deleteSourceApi(sourceName) {
  return utils.apiFetch(
    "/api/v0/projects/source/delete/" + sourceName,
    {
      method: "DELETE"
    },
    true
  );
}

export function startComposeApi(blueprintName, composeType) {
  const requestBody = {
    blueprint_name: blueprintName,
    compose_type: composeType,
    branch: "master"
  };
  return utils
    .apiFetch(
      "/api/v0/compose",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      },
      true
    )
    .then(data => JSON.parse(data));
}

export function cancelComposeApi(compose) {
  return utils.apiFetch(
    "/api/v0/compose/cancel/" + compose,
    {
      method: "DELETE"
    },
    true
  );
}

export function deleteComposeApi(compose) {
  return utils.apiFetch(
    "/api/v0/compose/delete/" + compose,
    {
      method: "DELETE"
    },
    true
  );
}

export function fetchImageStatusApi(uuid) {
  return utils.apiFetch("/api/v0/compose/status/" + uuid).then(data => data);
}

export function fetchComposeQueueApi() {
  return utils.apiFetch("/api/v0/compose/queue").then(data => data.new.concat(data.run));
}

export function fetchComposeFinishedApi() {
  return utils.apiFetch("/api/v0/compose/finished").then(data => data.finished);
}

export function fetchComposeFailedApi() {
  return utils.apiFetch("/api/v0/compose/failed").then(data => data.failed);
}
