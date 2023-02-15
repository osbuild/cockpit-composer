/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
import cockpit from "cockpit";

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

function postTOML(path, object, options) {
  return request({
    ...options,
    method: "POST",
    path,
    headers: { "Content-Type": "text/x-toml" },
    body: object,
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

// Above was written for use with cockpit
// Below is our api calls

export const getAPIStatus = () => {
  return get("/api/status");
};

export function createBlueprint(blueprint) {
  return post("/api/v0/blueprints/new", blueprint);
}

export const createBlueprintTOML = (blueprint) => {
  return postTOML("/api/v0/blueprints/new", blueprint);
};

export const getBlueprintsNames = () => {
  return get("/api/v0/blueprints/list").then((response) => response.blueprints);
};

export const getBlueprintsInfo = (blueprintNames) => {
  return get(
    `/api/v0/blueprints/info/${encodeURIComponent(blueprintNames)}`
  ).then((response) => response.blueprints);
};

export const getBlueprintJSON = async (blueprintName) => {
  const response = await get(
    `/api/v0/blueprints/info/${encodeURIComponent(blueprintName)}`
  );
  return response.blueprints[0];
};

export const getBlueprintTOML = async (blueprintName) => {
  const path = `/api/v0/blueprints/info/${encodeURIComponent(
    blueprintName
  )}?format=toml`;

  const toml = await get(path, { replyFormat: "raw" });
  return toml;
};

export function depsolveBlueprint(blueprintName) {
  return get(
    `/api/v0/blueprints/depsolve/${encodeURIComponent(blueprintName)}`
  );
}

export function deleteBlueprint(blueprint) {
  return _delete(`/api/v0/blueprints/delete/${encodeURIComponent(blueprint)}`);
}

// The api refers to images as composes
export function getImageTypes() {
  return get("/api/v0/compose/types").then((response) => response.types);
}

export function createImage(blueprintName, type, sizeBytes, ostree, upload) {
  return post("/api/v1/compose", {
    blueprint_name: blueprintName,
    compose_type: type,
    size: sizeBytes,
    ostree,
    upload,
    branch: "master",
  });
}

export function getImageStatus(uuid) {
  return get(`/api/v0/compose/status/${uuid}`).then((response) => {
    return response.uuids[0];
  });
}

export function getAllImageStatus() {
  return get("/api/v0/compose/status/*").then((response) => response.uuids);
}

export function getImageLog(uuid) {
  return get(`/api/v1/compose/log/${encodeURIComponent(uuid)}`, {
    replyFormat: "raw",
  });
}

export function cancelImage(image) {
  return _delete(`/api/v1/compose/cancel/${encodeURIComponent(image)}`);
}

export function deleteImage(image) {
  return _delete(`/api/v1/compose/delete/${encodeURIComponent(image)}`);
}

export function createSource(source) {
  return post("/api/v0/projects/source/new", source);
}

export function getAllSources() {
  return get("/api/v0/projects/source/info/*").then(
    (response) => response.sources
  );
}

export function deleteSource(sourceName) {
  return _delete(
    `/api/v0/projects/source/delete/${encodeURIComponent(sourceName)}`
  );
}

// Below relates to the wizard package selection

export function listModules(filter, selectedInputPage, pageSize) {
  const page = selectedInputPage * pageSize;
  return get(`/api/v0/modules/list/${encodeURIComponent(filter)}`, {
    params: { limit: pageSize, offset: page },
  });
}

export function getComponentInfo(componentNames) {
  return get(
    `/api/v0/projects/info/${encodeURIComponent(componentNames)}`
  ).then((response) => response.projects);
}

export function getComponentDependencies(componentNames) {
  return get(`/api/v0/modules/info/${encodeURIComponent(componentNames)}`).then(
    (response) => response.modules
  );
}

function flattenInputs(response) {
  // duplicate inputs exist when more than one build is available
  // flatten duplicate inputs to a single item
  const previousInputs = {};
  const flattened = response.filter((item) => {
    const build = {
      version: item.builds[0].source.version,
      release: item.builds[0].release,
    };
    if (previousInputs.hasOwnProperty(item.name)) {
      // update the previousInput object with this item"s version/release
      // to make the default version/release the latest
      previousInputs[item.name] = Object.assign(
        previousInputs[item.name],
        build
      );
      // and remove this item from the list
      return false;
    }
    delete item.builds;
    item = Object.assign(item, build);

    previousInputs[item.name] = item;
    return true;
  });
  return flattened;
}

export async function getPackages(filter, selectedInputPage, pageSize) {
  try {
    const wildcardsUsed = filter.includes("*");
    const regex = / +|, +/g;
    let filterValue = filter.replace(regex, ",");
    const regexStrip = /(^,+)|(,+$)/g;
    filterValue = filterValue.replace(regexStrip, "");
    filterValue = wildcardsUsed
      ? filterValue
      : `*${filterValue}*`.replace(/,/g, "*,*");
    // page is displayed in UI starting from 1 but api starts from 0
    const pageIndex = selectedInputPage - 1;
    const response = await listModules(filterValue, pageIndex, pageSize);
    const inputNames = response.modules.map((input) => input.name).join(",");
    const inputs = await getComponentInfo(inputNames);
    const packages = flattenInputs(inputs).map((input) => {
      const inputData = {
        name: input.name,
        summary: input.summary,
      };
      return inputData;
    });
    return { packages, total: response.total };
  } catch (error) {
    console.log("Error in fetchInputsSaga", error);
  }
}
