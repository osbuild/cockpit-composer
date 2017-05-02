# Welder End-To-End Test

The end-to-end automation test for Welder! It is performed on the application level and tests whether the business requirements are met regardless of app internal architecture, dependencies, data integrity and such. Actually we need to follow the end-user flows and assert they get the intended experience and focus on the behavior of the thing as the user would see it.


## How To Test

### Running end-to-end test directly on the host

The end-to-end tests are powered by [nightmare](http://nightmarejs.org/), 
[chai](http://chaijs.com/), [mocha](http://mochajs.org/) and [request-promise-native](https://github.com/request/request-promise-native)

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
$ npm run xunittest                             # Run end-to-end test with xunit xml result output
```

```shell
$ mocha --grep=#acceptance                                 # Run acceptance case only
$ mocha --grep=@create-recipe-page                         # Run create recipe page related case only
$ mocha --grep=#acceptance.+@create-recipe-page            # Run acceptance case in create recipe page cases
$ mocha --grep="@create-recipe-page|@edit-recipe-page"     # Run create recipe and edit recipe pages cases
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

`sudo docker run --rm --name welder_end_to_end --network welder_default -v test-result-volume:/result weld/end-to-end:latest xvfb-run -a -s '-screen 0 1024x768x24' npm run citest`

XUnit XML format result will be generated at */var/lib/docker/volumes/test-result-volume/_data/result.xml*

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
// Create Composition page class
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
describe('View Recipe Page', function () {                // Which page does this suite test
  this.timeout(15000);                                    // Timeout setting for this suite (ms)

  before((done) => {                                      // Check BDCS API and Web service avaliable first,
    apiCall.serviceCheck(done);                           // end-to-end test depends on BDCS API and Web.
  });                                                                   

  describe('Single Word Recipe Name Scenario', () => {    // Group suite or case into a scenario
    
    before((done) => {                                    // Scenario provision
    });

    after((done) => {                                     // Scenario de-provision, like apply a snapshot
    });

    context('Menu Nav Bar Check #acceptance', () => {     // Test content and test type
      it('should show a recipe name @view-recipe-page', (done) => {    // Case description and case ID
        
        const expected = "Expected Result";               // Highlight the expected result at the top level 
                                                          // of each case block. Explicit is always better!
      });
    });
    context('Title Bar Check #acceptance', () => {
      it('should show a recipe name title @view-recipe-page', (done) => {

      });
      it('should have Create Composition button @view-recipe-page', (done) => {

      });
    });
  });
});
```

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
