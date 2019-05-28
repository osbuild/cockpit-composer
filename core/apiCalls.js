import cockpit from "cockpit";

let cockpitHttp = cockpit.http("/run/weldr/api.socket", { superuser: "try" });

/*
 * Send a request to the composer API. `options` contain the same options that
 * cockpit.http() expects.
 *
 * All responses are expected to be either empty or valid JSON.
 */
function request(options) {
  /*
   * Wrap this in an additional Promise. The promise returned by
   * cockpit.http.request() doesn't propagate exceptions thrown in a .catch
   * handler. Thus, we need to reject() manually.
   */
  return new Promise((resolve, reject) => {
    cockpitHttp
      .request(options)
      .then(data => resolve(data ? JSON.parse(data) : data))
      .catch(error =>
        reject({
          problem: error.problem,
          message: error.message,
          options: options
        })
      );
  });
}

/*
 * Send a GET request to the composer API.
 */
function get(path, params) {
  return request({
    path: path,
    params: params,
    body: ""
  });
}

/*
 * Send a POST request to the composer API. `object` will be turned into a JSON
 * payload.
 */
function post(path, object) {
  return request({
    method: "POST",
    path: path,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object)
  });
}

/*
 * Send a DELETE request to the composer API.
 */
function _delete(path) {
  return request({
    method: "DELETE",
    path: path,
    body: ""
  });
}

/*
 * Wrappers for composer API calls
 */

export function createBlueprintApi(blueprint) {
  return post("/api/v0/blueprints/new", blueprint);
}

export function fetchBlueprintContentsApi(blueprintName) {
  return get("/api/v0/blueprints/depsolve/" + encodeURIComponent(blueprintName));
}

export function fetchBlueprintInputsApi(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  return get("/api/v0/modules/list/" + encodeURIComponent(filter), { limit: pageSize, offset: page }).then(response => {
    return [response.modules, response.total];
  });
}

export function fetchComponentDetailsApi(componentNames) {
  return get("/api/v0/projects/info/" + encodeURIComponent(componentNames)).then(response => response.projects);
}

export function fetchDepsApi(componentNames) {
  return get("/api/v0/modules/info/" + encodeURIComponent(componentNames)).then(response => response.modules);
}

export function fetchBlueprintNamesApi() {
  return get("/api/v0/blueprints/list").then(response => response.blueprints);
}

export function fetchBlueprintInfoApi(blueprintName) {
  return get("/api/v0/blueprints/info/" + encodeURIComponent(blueprintName)).then(blueprintdata => {
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
  const imageTypes = get("/api/v0/compose/types").then(data =>
    data.types.map(type => {
      return Object.assign({}, type, { label: imageTypeLabels[type.name] || type.name });
    })
  );
  return imageTypes;
}

export function deleteBlueprintApi(blueprint) {
  return _delete("/api/v0/blueprints/delete/" + encodeURIComponent(blueprint)).then(() => blueprint);
}

export function deleteWorkspaceApi(blueprintId) {
  return _delete("/api/v0/blueprints/workspace/" + encodeURIComponent(blueprintId));
}

export function commitToWorkspaceApi(blueprint) {
  return post("/api/v0/blueprints/workspace", blueprint);
}

export function fetchDiffWorkspaceApi(blueprintId) {
  return get("/api/v0/blueprints/diff/" + encodeURIComponent(blueprintId) + "/NEWEST/WORKSPACE");
}

export function fetchSourceInfoApi(sourceName) {
  return get("/api/v0/projects/source/info/" + encodeURIComponent(sourceName));
}

export function addSourceApi(source) {
  return post("/api/v0/projects/source/new", source);
}

export function deleteSourceApi(sourceName) {
  return _delete("/api/v0/projects/source/delete/" + encodeURIComponent(sourceName));
}

export function startComposeApi(blueprintName, composeType) {
  return post("/api/v0/compose", {
    blueprint_name: blueprintName,
    compose_type: composeType,
    branch: "master"
  });
}

export function cancelComposeApi(compose) {
  return _delete("/api/v0/compose/cancel/" + encodeURIComponent(compose));
}

export function deleteComposeApi(compose) {
  return _delete("/api/v0/compose/delete/" + encodeURIComponent(compose));
}

export function fetchImageStatusApi(uuid) {
  return get("/api/v0/compose/status/" + encodeURIComponent(uuid));
}

export function fetchComposeQueueApi() {
  return get("/api/v0/compose/queue").then(data => data.new.concat(data.run));
}

export function fetchComposeFinishedApi() {
  return get("/api/v0/compose/finished").then(data => data.finished);
}

export function fetchComposeFailedApi() {
  return get("/api/v0/compose/failed").then(data => data.failed);
}
