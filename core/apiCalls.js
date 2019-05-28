import utils from "./utils";

export function createBlueprintApi(blueprint) {
  return utils.post("/api/v0/blueprints/new", blueprint);
}

export function fetchBlueprintContentsApi(blueprintName) {
  return utils.get("/api/v0/blueprints/depsolve/" + encodeURIComponent(blueprintName));
}

export function fetchBlueprintInputsApi(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  return utils
    .get("/api/v0/modules/list/" + encodeURIComponent(filter), { limit: pageSize, offset: page })
    .then(response => [response.modules, response.total]);
}

export function fetchComponentDetailsApi(componentNames) {
  return utils.get("/api/v0/projects/info/" + encodeURIComponent(componentNames)).then(response => response.projects);
}

export function fetchDepsApi(componentNames) {
  return utils.get("/api/v0/modules/info/" + encodeURIComponent(componentNames)).then(response => response.modules);
}

export function fetchBlueprintNamesApi() {
  return utils.get("/api/v0/blueprints/list").then(response => response.blueprints);
}

export function fetchBlueprintInfoApi(blueprintName) {
  return utils.get("/api/v0/blueprints/info/" + encodeURIComponent(blueprintName)).then(blueprintdata => {
    if (blueprintdata.blueprints.length > 0) {
      let blueprint = blueprintdata.blueprints[0];
      blueprint.changed = blueprintdata.changes[0].changed;
      blueprint.id = blueprintName;
      return blueprint;
    }
  });
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
  const imageTypes = utils.get("/api/v0/compose/types").then(data =>
    data.types.map(type => {
      return Object.assign({}, type, { label: imageTypeLabels[type.name] || type.name });
    })
  );
  return imageTypes;
}

export function deleteBlueprintApi(blueprint) {
  return utils._delete("/api/v0/blueprints/delete/" + encodeURIComponent(blueprint)).then(() => blueprint);
}

export function deleteWorkspaceApi(blueprintId) {
  return utils._delete("/api/v0/blueprints/workspace/" + encodeURIComponent(blueprintId));
}

export function commitToWorkspaceApi(blueprint) {
  return utils.post("/api/v0/blueprints/workspace", blueprint);
}

export function fetchDiffWorkspaceApi(blueprintId) {
  return utils.get("/api/v0/blueprints/diff/" + encodeURIComponent(blueprintId) + "/NEWEST/WORKSPACE");
}

export function fetchSourceInfoApi(sourceName) {
  return utils.get("/api/v0/projects/source/info/" + encodeURIComponent(sourceName));
}

export function addSourceApi(source) {
  return utils.post("/api/v0/projects/source/new", source);
}

export function deleteSourceApi(sourceName) {
  return utils._delete("/api/v0/projects/source/delete/" + encodeURIComponent(sourceName));
}

export function startComposeApi(blueprintName, composeType) {
  return utils.post("/api/v0/compose", {
    blueprint_name: blueprintName,
    compose_type: composeType,
    branch: "master"
  });
}

export function cancelComposeApi(compose) {
  return utils._delete("/api/v0/compose/cancel/" + encodeURIComponent(compose));
}

export function deleteComposeApi(compose) {
  return utils._delete("/api/v0/compose/delete/" + encodeURIComponent(compose));
}

export function fetchImageStatusApi(uuid) {
  return utils.get("/api/v0/compose/status/" + encodeURIComponent(uuid));
}

export function fetchComposeQueueApi() {
  return utils.get("/api/v0/compose/queue").then(data => data.new.concat(data.run));
}

export function fetchComposeFinishedApi() {
  return utils.get("/api/v0/compose/finished").then(data => data.finished);
}

export function fetchComposeFailedApi() {
  return utils.get("/api/v0/compose/failed").then(data => data.failed);
}
