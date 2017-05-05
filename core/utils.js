let cockpit;
let cockpitHttp;

welderApiHost = welderApiHost || 'localhost';
welderApiScheme = welderApiScheme || 'http';

function setupCockpitHttp() {
  const useHttps = welderApiScheme === 'https';
  const port = welderApiPort || useHttps ? 443 : 80;
  cockpitHttp = cockpit.http(port, {
    address: welderApiHost,
    tls: useHttps ? {} : undefined,
  });
}

function cockpitFetch(url, options, skipDecode) {
  if (!options) { options = {}; }
  if (!options.method) { options.method = 'GET'; }
  if (!options.body) { options.body = ''; }

  options.path = url;

  if (!cockpitHttp) { setupCockpitHttp(); }

  return new Promise((resolve) => {
    cockpitHttp.request(options)
        .then((data) => {
          if (skipDecode) { resolve(data); } else { resolve(JSON.parse(data)); }
        });
  });
}

function createUrl(url) {
  // API is hosted on the same URL as the UI
  if (welderApiRelative === true) {
    return url;
  }

  const parser = document.createElement('a');
  parser.href = url;
  parser.scheme = welderApiScheme;
  parser.host = welderApiHost;
  if (welderApiPort) { parser.port = welderApiPort; }
  return parser.href;
}

function apiFetch(url, options, skipDecode) {
  url = createUrl(url);
  return new Promise((resolve) => {
    fetch(url, options)
      .then((r) => {
        if (skipDecode) { resolve(r); } else { resolve(r.json()); }
      });
  });
}

const module = { apiFetch };
if (window.location.href.indexOf('cockpit') > -1) {
  cockpit = require('cockpit');
  module.apiFetch = cockpitFetch;
  module.inCockpit = true;
}

export default module;
