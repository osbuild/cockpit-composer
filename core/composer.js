import cockpit from "cockpit";
import providerSettings from "../data/providers";

let cockpitHttp = cockpit.http("/run/weldr/api.socket", { superuser: "try" });

/*
 * Send a request to the composer API.
 *
 * `options` can contain `path`, `params`, `headers`, `body`, and
 * `replyFormat`. The ones that have the same name as cockpit.http options
 * correspond to them and are passed along.
 *
 * `replyFormat` can be set to "json" (the default) or "raw".
 *
 * All responses are expected to be either empty or valid JSON.
 */
function request(options) {
  var replyFormat = options.replyFormat || "json";

  /*
   * Wrap this in an additional Promise. The promise returned by
   * cockpit.http.request() doesn't propagate exceptions thrown in a .catch
   * handler. Thus, we need to reject() manually.
   */
  return new Promise((resolve, reject) => {
    cockpitHttp
      .request({
        method: options.method,
        path: options.path,
        params: options.params,
        headers: options.headers,
        body: options.body
      })
      .then(data => {
        if (replyFormat === "json") resolve(JSON.parse(data));
        else if (replyFormat === "raw") resolve(data);
        else throw new Error(`invalid replyFormat: '${replyFormat}'`);
      })
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
function get(path, options) {
  return request({
    body: "",
    ...options,
    path: path
  });
}

/*
 * Send a POST request to the composer API. `object` will be turned into a JSON
 * payload.
 */
function post(path, object, options) {
  return request({
    ...options,
    method: "POST",
    path: path,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object)
  });
}

/*
 * Send a DELETE request to the composer API.
 */
function _delete(path, options) {
  return request({
    ...options,
    method: "DELETE",
    path: path,
    body: ""
  });
}

/*
 * Wrappers for composer API calls
 */

export function newBlueprint(blueprint) {
  return post("/api/v0/blueprints/new", blueprint);
}

export function depsolveBlueprint(blueprintName) {
  return get("/api/v0/blueprints/depsolve/" + encodeURIComponent(blueprintName));
}

export function listModules(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  return get("/api/v0/modules/list/" + encodeURIComponent(filter), {
    params: { limit: pageSize, offset: page }
  }).then(response => [response.modules, response.total]);
}

/*
 * Next two functions have a different name from their API route, because the
 * routes are confusing.
 */
export function getComponentInfo(componentNames) {
  return get("/api/v0/projects/info/" + encodeURIComponent(componentNames)).then(response => response.projects);
}

export function getComponentDependencies(componentNames) {
  return get("/api/v0/modules/info/" + encodeURIComponent(componentNames)).then(response => response.modules);
}

export function listBlueprints() {
  return get("/api/v0/blueprints/list").then(response => response.blueprints);
}

export function getBlueprintInfo(blueprintName) {
  return get("/api/v0/blueprints/info/" + encodeURIComponent(blueprintName)).then(blueprintdata => {
    if (blueprintdata.blueprints.length > 0) {
      let blueprint = blueprintdata.blueprints[0];
      blueprint.changed = blueprintdata.changes[0].changed;
      blueprint.id = blueprintName;
      return blueprint;
    }
  });
}

export function getComposeTypes() {
  const imageTypeLabels = {
    ami: "Amazon Machine Image Disk (.ami)",
    "ext4-filesystem": "Ext4 File System Image (.img)",
    "fedora-iot-commit": "Fedora IoT Commit (.tar)",
    "live-iso": "Live Bootable ISO (.iso)",
    "partitioned-disk": "Raw Partitioned Disk Image (.img)",
    qcow2: "QEMU QCOW2 Image (.qcow2)",
    openstack: "OpenStack (.qcow2)",
    "rhel-edge-commit": "RHEL for Edge Commit (.tar)",
    tar: "TAR Archive (.tar)",
    vhd: "Azure Disk Image (.vhd)",
    vmdk: "VMware Virtual Machine Disk (.vmdk)",
    alibaba: "Alibaba Machine Image (.qcow2)",
    google: "Google Compute Engine Image (.tar.gz)",
    "hyper-v": "Hyper-V Virtual Machine Disk (.vhdx)"
  };
  const imageTypes = get("/api/v0/compose/types").then(data =>
    data.types.map(type => {
      return Object.assign({}, type, { label: imageTypeLabels[type.name] || type.name });
    })
  );
  return imageTypes;
}

export function deleteBlueprint(blueprint) {
  return _delete("/api/v0/blueprints/delete/" + encodeURIComponent(blueprint)).then(() => blueprint);
}

export function deleteWorkspace(blueprintId) {
  return _delete("/api/v0/blueprints/workspace/" + encodeURIComponent(blueprintId));
}

export function commitToWorkspace(blueprint) {
  return post("/api/v0/blueprints/workspace", blueprint);
}

export function diffBlueprintToWorkspace(blueprintId) {
  return get("/api/v0/blueprints/diff/" + encodeURIComponent(blueprintId) + "/NEWEST/WORKSPACE");
}

export function getSourceInfo(sourceName) {
  return get("/api/v0/projects/source/info/" + encodeURIComponent(sourceName));
}

export function newSource(source) {
  return post("/api/v0/projects/source/new", source);
}

export function deleteSource(sourceName) {
  return _delete("/api/v0/projects/source/delete/" + encodeURIComponent(sourceName));
}

export function startCompose(blueprintName, composeType, imageSize, uploadSettings) {
  return post("/api/v1/compose", {
    blueprint_name: blueprintName,
    compose_type: composeType,
    size: imageSize,
    upload: uploadSettings,
    branch: "master"
  });
}

export function cancelCompose(compose) {
  return _delete("/api/v1/compose/cancel/" + encodeURIComponent(compose));
}

export function deleteCompose(compose) {
  return _delete("/api/v1/compose/delete/" + encodeURIComponent(compose));
}

export function getComposeStatus(uuid) {
  return get("/api/v1/compose/status/" + encodeURIComponent(uuid));
}

export function getQueuedComposes() {
  return get("/api/v1/compose/queue").then(data => data.new.concat(data.run));
}

export function getFinishedComposes() {
  return get("/api/v1/compose/finished").then(data => data.finished);
}

export function getFailedComposes() {
  return get("/api/v1/compose/failed").then(data => data.failed);
}

export function getComposeLog(uuid) {
  return get("/api/v1/compose/log/" + encodeURIComponent(uuid), { replyFormat: "raw" });
}

export function getUploadProviders() {
  return providerSettings;
}
