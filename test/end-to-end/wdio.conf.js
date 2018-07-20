const fs = require('fs');
const crypto = require('crypto');

exports.config = {
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: [
    './specs/*.js',
  ],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 1,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [{
    // maxInstances can get overwritten per capability. So if you have an in-house Selenium
    // grid with only 5 firefox instances available you can make sure that not more than
    // 5 instances get started at a time.
    maxInstances: 1,
    //
    browserName: 'firefox',
    acceptInsecureCerts: true,
  }],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: 'silent',
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // Warns when a deprecated command is used
  deprecationWarnings: true,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './failed-image/',
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: 'http://localhost:9090/welder',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 90000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Initialize the browser instance with a WebdriverIO plugin. The object should have the
  // plugin name as key and the desired plugin options as properties. Make sure you have
  // the plugin installed before running any tests. The following plugins are currently
  // available:
  // WebdriverCSS: https://github.com/webdriverio/webdrivercss
  // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
  // Browserevent: https://github.com/webdriverio/browserevent
  // plugins: {
  //     webdrivercss: {
  //         screenshotRoot: 'my-shots',
  //         failedComparisonsRoot: 'diffs',
  //         misMatchTolerance: 0.05,
  //         screenWidth: [320,480,640,1024]
  //     },
  //     webdriverrtc: {},
  //     browserevent: {}
  // },
  //
  // Test runner services
  services: [],
  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'mocha',
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: http://webdriver.io/guide/reporters/dot.html
  reporters: ['dot', 'spec'],
  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: 90000,
  },

  // always start with a clean browser session before
  // every single test
  beforeTest(test) {
    browser.reload();
  },

  afterTest(test) {
    const coverageData = browser.execute('return window.__coverage__;');
    if (coverageData === undefined) {
      return;
    }

    const strCoverage = JSON.stringify(coverageData.value);
    const hash = crypto
      .createHmac('sha256', '')
      .update(strCoverage)
      .digest('hex');

    const covOutDir = '/tmp/.nyc_output/';
    if (!fs.existsSync(covOutDir)) {
      fs.mkdirSync(covOutDir);
    }

    fs.writeFileSync(`${covOutDir}coverage-${hash}.json`, strCoverage);
  },
};

exports.testData = {
  blueprint: {
    simple: {
      name: 'automation',
      description: 'UI automation blueprint',
      modules: [],
      packages: [{ name: 'httpd', version: '' }],
    },
    // used for testing pending changes
    bash: {
      name: 'terminals',
      description: 'my favorite terminal',
      modules: [],
      packages: [{ name: 'bash', version: '' }],
    },
    random: {
      name: '',
      description: '',
      modules: [],
      packages: [{ name: 'httpd', version: '' }],
    },
  },

  // Image type and architechture on Create Image Page
  // NOTE: these are backend dependent and may actually take a lot of time
  // if/when the backend decides to really build a compose. So leave testing
  // only with the tar compose type b/c it should be relatively fast
  image: [
    { type: 'tar', arch: 'x86_64' },
  ],

  // cockpit authentication username and password
  cockpit: {
    root: {
      username: 'root',
      password: 'composer',
    },
    composer: {
      username: 'composer',
      password: 'composer',
    },
  },
};
