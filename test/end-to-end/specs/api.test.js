const commands = require("../utils/commands");
const blueprintsPage = require("../pages/blueprints.page");

// acceptable API response time; we want that to be 1s
// (https://www.nngroup.com/articles/response-times-3-important-limits/)
// but on slow/loaded nested-VM OSCI infrastructure this often takes much longer
const acceptable = 10000;

describe("lorax-composer api sanity test", function() {
  before(function() {
    commands.login();
    // Edge does not support the following command so have to keep default timeout(3 seconds)
    // browser.timeouts({ script: timeout });
    blueprintsPage.loading();
  });

  function apiFetchTest(endpoint, options = { body: "" }) {
    options.path = endpoint;
    return browser.executeAsync(
      function(endpoint, options, done) {
        const t0 = performance.now();
        const testHttp = cockpit.http("/run/weldr/api.socket", { superuser: "try" });
        testHttp
          .request(options)
          .then(data => done({ success: true, data: data, latency: performance.now() - t0 }))
          .catch(err => done({ success: false, data: err }));
      },
      endpoint,
      options
    );
  }

  it("/api/v0/blueprints/list", function() {
    const endpoint = "/api/v0/blueprints/list";
    const result = apiFetchTest(endpoint).value;
    if (result.success) {
      console.log(`API - "/api/v0/blueprints/list" response time: ${result.latency} millisecond`);
    } else {
      console.log('Failed to access API - "/api/v0/blueprints/list" with error: ', result.data);
    }
    expect(result.success).to.be.true;
    // there're 3 blueprints included in composer by default
    expect(JSON.parse(result.data).total).to.equal(3);
    expect(result.latency)
      .to.match(/^\d*(\.?\d+|\d*)$/)
      .and.be.below(acceptable);
  });
});
