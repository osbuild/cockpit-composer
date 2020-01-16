// acceptable API response time; we want that to be 1s
// (https://www.nngroup.com/articles/response-times-3-important-limits/)
// but on slow/loaded nested-VM OSCI infrastructure this often takes much longer
const acceptable = 10000;

describe("weldr api sanity test", function() {
  it("weldr api socket should be active", function() {
    const status = browser.executeAsync(function(done) {
      cockpit
        .script("systemctl is-active osbuild-composer.socket", { superuser: "require", err: "message" })
        .then(data => done(data));
    });
    expect(status.trim()).to.equal("active");
  });

  it("/api/v0/blueprints/list", function() {
    const endpoint = "/api/v0/blueprints/list";
    const result = browser.apiFetchTest(endpoint);
    if (result.success) {
      console.log(`API - "/api/v0/blueprints/list" response time: ${result.latency} millisecond`);
    } else {
      console.log('Failed to access API - "/api/v0/blueprints/list" with error: ', result.data);
    }
    expect(result.success).to.be.true;
    expect(result.latency)
      .to.match(/^\d*(\.?\d+|\d*)$/)
      .and.be.below(acceptable);
    // there're 3 blueprints added at before hook
    expect(JSON.parse(result.data).total).to.be.at.least(3);
  });
});
