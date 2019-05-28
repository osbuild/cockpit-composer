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

export default { request, get, post, _delete };
