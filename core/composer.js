import cockpit from "cockpit";
import providerSettings from "../data/providers";

const cockpitHttp = cockpit.http("/run/weldr/api.socket", { superuser: "try" });

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
  const replyFormat = options.replyFormat || "json";

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
        body: options.body,
      })
      .then((data) => {
        if (replyFormat === "json") resolve(JSON.parse(data));
        else if (replyFormat === "raw") resolve(data);
        else throw new Error(`invalid replyFormat: '${replyFormat}'`);
      })
      .catch((error, data) => {
        /*
         * osbuild-composer describes the error in more detail, so add the body
         * so it at least can be logged for more information.
         */
        let body = data;
        try {
          body = JSON.parse(body);
        } catch {
          /* just keep the data as string */
        }
        reject({
          problem: error.problem,
          message: error.message,
          options,
          body,
        });
      });
  });
}

/*
 * Send a GET request to the composer API.
 */
function get(path, options) {
  return request({
    body: "",
    ...options,
    path,
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
    path,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(object),
  });
}

/*
 * Send a DELETE request to the composer API.
 */
function _delete(path, options) {
  return request({
    ...options,
    method: "DELETE",
    path,
    body: "",
  });
}

/*
 * Wrappers for composer API calls
 */

export function newBlueprint(blueprint) {
  return post("/api/v0/blueprints/new", blueprint);
}

export function depsolveBlueprint(blueprintName) {
  return get(`/api/v0/blueprints/depsolve/${encodeURIComponent(blueprintName)}`);
}

export function listModules(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  return get(`/api/v0/modules/list/${encodeURIComponent(filter)}`, {
    params: { limit: pageSize, offset: page },
  });
}

/*
 * Next two functions have a different name from their API route, because the
 * routes are confusing.
 */
export function getComponentInfo(componentNames) {
  return get(`/api/v0/projects/info/${encodeURIComponent(componentNames)}`).then((response) => response.projects);
}

export function getComponentDependencies(componentNames) {
  return get(`/api/v0/modules/info/${encodeURIComponent(componentNames)}`).then((response) => response.modules);
}

export function listBlueprints() {
  return get("/api/v0/blueprints/list").then((response) => response.blueprints);
}

export function getBlueprintInfo(blueprintName) {
  return get(`/api/v0/blueprints/info/${encodeURIComponent(blueprintName)}`).then((blueprintdata) => {
    if (blueprintdata.blueprints.length > 0) {
      const blueprint = blueprintdata.blueprints[0];
      blueprint.changed = blueprintdata.changes[0].changed;
      blueprint.name = blueprintName;
      return blueprint;
    }
  });
}

export function getComposeTypes() {
  return get("/api/v0/compose/types").then((response) => response.types);
}

export function deleteBlueprint(blueprint) {
  return _delete(`/api/v0/blueprints/delete/${encodeURIComponent(blueprint)}`).then(() => blueprint);
}

export function getSourceInfo(sourceName) {
  return get(`/api/v0/projects/source/info/${encodeURIComponent(sourceName)}`);
}

export function newSource(source) {
  return post("/api/v0/projects/source/new", source);
}

export function deleteSource(sourceName) {
  return _delete(`/api/v0/projects/source/delete/${encodeURIComponent(sourceName)}`);
}

export function startCompose(blueprintName, composeType, imageSize, ostree, uploadSettings) {
  return post("/api/v1/compose", {
    blueprint_name: blueprintName,
    compose_type: composeType,
    size: imageSize,
    ostree,
    upload: uploadSettings,
    branch: "master",
  });
}

export function cancelCompose(compose) {
  return _delete(`/api/v1/compose/cancel/${encodeURIComponent(compose)}`);
}

export function deleteCompose(compose) {
  return _delete(`/api/v1/compose/delete/${encodeURIComponent(compose)}`);
}

export function getComposeStatus(uuid) {
  return get(`/api/v1/compose/status/${encodeURIComponent(uuid)}`);
}

export function getQueuedComposes() {
  return get("/api/v1/compose/queue").then((data) => data.new.concat(data.run));
}

export function getFinishedComposes() {
  return get("/api/v1/compose/finished").then((data) => data.finished);
}

export function getFailedComposes() {
  return get("/api/v1/compose/failed").then((data) => data.failed);
}

export function getComposeLog(uuid) {
  return get(`/api/v1/compose/log/${encodeURIComponent(uuid)}`, { replyFormat: "raw" });
}

export function getUploadProviders() {
  return providerSettings;
}
