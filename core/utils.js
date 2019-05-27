import cockpit from "cockpit";

let http = cockpit.http("/run/weldr/api.socket", { superuser: "try" });

function apiFetch(url, options, skipDecode) {
  if (!options) {
    options = {};
  } // eslint-disable-line no-param-reassign
  if (!options.method) {
    options.method = "GET";
  } // eslint-disable-line no-param-reassign
  if (!options.body) {
    options.body = "";
  } // eslint-disable-line no-param-reassign

  options.path = url; // eslint-disable-line no-param-reassign

  /*
   * Wrap this in an additional Promise. The promise returned by
   * cockpit.http.request() doesn't propagate exceptions thrown in a .catch
   * handler. Thus, we need to reject() manually.
   */
  return new Promise((resolve, reject) => {
    http
      .request(options)
      .then(data => (skipDecode ? resolve(data) : resolve(JSON.parse(data))))
      .catch(error =>
        reject({
          problem: error.problem,
          message: error.message,
          url: url,
          options: options
        })
      );
  });
}

export default { apiFetch };
