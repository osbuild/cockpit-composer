# Welder End-To-End Test

The end-to-end automation test for Welder! It is performed on the application level and tests whether the business requirements are met regardless of app internal architecture, dependencies, data integrity and such. Actually we need to follow the end-user flows and assert they get the intended experience and focus on the behavior of the thing as the user would see it.

## Two Test Scenarios

### Stand Alone Welder Web Scenario

In this scenario, the Welder Web will be run as a stand alone web service. End-to-end test will run against this scenario to make sure Welder Web work as we expected. The code coverage will be generated after end-to-end test.

### Cockpit Integrated Scenario

Welder Web will be integrated into Cockpit in this scenario. Welder Web RPM will install into Cockpit. End-to-end test in this case is to make sure that the RPM package isn't missing important module and to make sure that the Welder Web is able to work with Cockpit. RPM sanity measure and Cockpit functional test will be covered in this scenario.

## How To Test

### Running end-to-end test directly on the host

The end-to-end tests are powered by [nightmare](http://nightmarejs.org/),
[Jest](https://facebook.github.io/jest/) and [request-promise-native](https://github.com/request/request-promise-native)

#### Requirement

1. Have both bdcs-api-rs and welder-web running on localhost.

2. Use "real" API, not mock API.

#### Test Case Location

All test cases are placed in *test/end-to-end/test* directory.

#### Test Running Command

```shell
$ cd test/end-to-end
$ npm install                                   # Install end-to-end dependencies
$ npm run test                                  # Run end-to-end test
```

```shell
$ jest -i -t "#acceptance"                               # Run acceptance case only
$ jest -i -t "@create-recipe-page"                       # Run create recipe page related case only
$ jest -i -t "#acceptance.+@create-recipe-page"          # Run acceptance case in create recipe page cases
$ jest -i -t "@create-recipe-page|@edit-recipe-page"     # Run create recipe and edit recipe pages cases
```

### Running end-to-end test in Docker

The end-to-end test docker image is an executable image, which starts container, runs test, and exits.

The docker image depends on a base image, named weld/fedora:25, which needs have been previously built.
If it is not available it can be built from the welder-deployment repository by running `make weld-f25`.

Build end-to-end test docker image by running:

`sudo docker build -t weld/end-to-end:latest .`

The end-to-end test needs both bdcs-api-rs and welder-web docker running. Build them from welder-deployment
repository by running `make build` and `make import-metadata`. Run them by running `sudo docker-compose -p welder up -d`.

Run end-to-end test like this:

`sudo docker run --rm --name welder_end_to_end --network welder_default weld/end-to-end:latest xvfb-run -a -s '-screen 0 1024x768x24' npm run test`

## Directory Layout

```shell
.
├── /pages/                     # Welder-Web page classes
│   ├── main.js                 # Top level page class and inherited by other page classes
│   ├── createCompos.js         # Create Composition page class with tested elements included
│   ├── createRecipe.js         # Create Recipe page class with tested elements included
│   └── /...                    # etc.
├── /test/                      # End-to-End test cases
│   ├── test_createRecipe.js    # Test cases for Create Recipe page
│   ├── test_editRecipe.js      # Test cases for Edit Recipe page
│   └── /...                    # etc.
├── /utils/                     # Utility and helper functions
│── .eslintrc                   # ESLint configuration file
│── config.json                 # This list of configuration for test case
└── package.json                # The list of project dependencies and NPM scripts
```

## Page Class

```javascript
const MainPage = require('./main');                           // Import top level class

module.exports = class CreateComposPage extends MainPage {    // Inherint from top level class
  constructor(type, arch) {                                   // Call constructor
    super('Create Composition');                              // Call super with title as argument
    this.composType = type;
    this.composArch = arch;

    // Create Copmosition label                               // Comment about what this element is
    this.varCreateCompos = 'Create Composition';              // Page element value
    this.labelCreateCompos = '#myModalLabel';                 // Page element selector
  }
};
```

## Test Suite and Case Layout

```javascript
describe('View Recipe Page', function () {             // Which page does this suite test
  // Set case running timeout
  const timeout = 15000;                               // Timeout setting for this suite (ms)

  beforeAll((done) => {                                // Check BDCS API and Web service avaliable first,
    apiCall.serviceCheck(done);
  });                                                                   

  describe('Single Word Recipe Name Scenario', () => {    // Group suite or case into a scenario

    beforeAll((done) => {                                 // Scenario provision
    });

    afterAll((done) => {                                  // Scenario de-provision, like apply a snapshot
    });

    describe('Menu Nav Bar Check #acceptance', () => {     // Test content and test type
      test('should show a recipe name @view-recipe-page', (done) => {    // Case description and case ID

        const expected = "Expected Result";         // Highlight the expected result at the top level
                                                    // of each case block. Explicit is always better!
      }, timeout);
    });
    describe('Title Bar Check #acceptance', () => {
      test('should show a recipe name title @view-recipe-page', (done) => {

      }, timeout);
      test('should have Create Composition button @view-recipe-page', (done) => {

      }, timeout);
    });
  });
});
```

## Code coverage from end-to-end tests

Before running the tests the application code must be instrumented with
istanbul! Then inside the browser scope all coverage information is available
from `window__coverage__` which needs to be passed back to the node scope
and made available for the reporting tools to use. The helper code inside
`utils/coverage.js` already to this and store the report files inder
`/tmp/coverage-<HASH>.json`. The hash value is the sha256 sum of the coverage
report itself.

There are several things to be noted when writing and executing the tests:

1. Some cases may have identical coverage so the number of json files will be
   equal or less to the number of test cases;
2. When constructing the Nightmare sequence make sure you **DO NOT** call the
   `.end()` method and the `done()` callback! This is done inside `utils/coverage.js`;
3. `utils/coverage.js` must be executed inside the last `.then()` method in the
   Nightmare sequence. This is usually after the last expectation (assertion);
4. `utils/coverage.js` takes care to call `.end()` and close the electron process;

## Test Result

The result should be read like a sentence.

*e.g. In View Recipe page, with single word recipe name scenario, do menu bar check, and it should show a recipe name.*

```shell
  View Recipe Page
    Single Word Recipe Name Scenario
      Menu Nav Bar Check
        ✓ should show a recipe name (2239ms)
      Title Bar Check
        ✓ should show a recipe name title (1718ms)
        ✓ should have Create Composition button (1698ms)


  3 passing (6s)
```

## Code Style

Javascript code in this project should follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

---
Made with ♥ by the Welder [team](https://github.com/orgs/weldr/people) and its contributors
