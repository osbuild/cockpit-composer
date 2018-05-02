# Welder End-To-End Test

The end-to-end automation test for Welder! It is performed on the application
level and tests whether the business requirements are met regardless of app
internal architecture, dependencies, data integrity and such. Actually we need
to follow the end-user flows and assert they get the intended experience and
focus on the behavior of the thing as the user would see it.

## Two Test Scenarios

### Stand Alone Welder Web Scenario

In this scenario, the Welder Web will be run as a stand alone web service.
End-to-end test will run against this scenario to make sure Welder Web work
as we expected. The code coverage will be generated after end-to-end test.

### Cockpit Integrated Scenario

Welder Web will be integrated into Cockpit in this scenario. Welder Web RPM
will install into Cockpit. End-to-end test in this case is to make sure that
the RPM package isn't missing important module and to make sure that the
Welder Web is able to work with Cockpit. RPM sanity measure and Cockpit
functional test will be covered in this scenario.

## How To Test

### Running end-to-end test directly on the host

The end-to-end tests are powered by [WebdriverIO](http://webdriver.io) and
[Mocha](https://mochajs.org/). WebdriverIO makes it very easy to use synchronous
code to test for various async events that go on behind the scenes.

#### Requirement

1. Have both bdcs-api and welder-web running on localhost.

#### Test Case Location

All test cases are placed in *test/end-to-end/specs/* directory.

#### Test Running Command

```shell
$ cd test/end-to-end
$ npm install                                   # Install end-to-end dependencies
$ npm run test                                  # Run end-to-end test
```

### Running end-to-end test inside Docker container

The end-to-end test docker image is an executable image, which starts container, runs test, and exits.
There's a easy way to run end to end test in Docker container.

1. Go to project root folder.
2. `make end-to-end-test` to run end to end test against standard web UI.
3. Or `make cockpit-test` to run end to end test against Cockpit integrated UI.

## Directory Layout

```shell
.
├── /pages/                     # Welder-Web page classes
│   ├── main.js                 # Top level page class and inherited by other page classes
│   ├── createImage.js          # Create Image page class with tested elements included
│   ├── createBlueprint.js      # Create Blueprint page class with tested elements included
│   └── /...                    # etc.
├── /specs/                     # End-to-End test cases
│   ├── test_createBlueprint.js # Test cases for Create Blueprint page
│   ├── test_editBlueprint.js   # Test cases for Edit Blueprint page
│   └── /...                    # etc.
├── /utils/                     # Utility and helper functions
│── .eslintrc                   # ESLint configuration file
│── wdio.conf.js                # Configuration for WebdriverIO and test internals
└── package.json                # The list of project dependencies and NPM scripts
```

## Code coverage from end-to-end tests

Before running the tests the application code must be instrumented with
istanbul! Then inside the browser scope all coverage information is available
from `window.__coverage__` which needs to be passed back to the node scope
and made available for the reporting tools to use.

The helper code inside
`afterTest` already does this and stores the report files under
`/tmp/coverage-<HASH>.json`. The hash value is the sha256 sum of the coverage
report itself. Some cases may have identical coverage so the number of json
files will be equal or less to the number of test cases.

## Test Result

The result should be read like a sentence.

*e.g. In View Blueprint page, with single word blueprint name scenario, do menu bar check, and it should show a blueprint name.*

```shell
  View Blueprint Page
    Single Word Blueprint Name Scenario
      Menu Nav Bar Check
        ✓ should show a blueprint name (2239ms)
      Title Bar Check
        ✓ should show a blueprint name title (1718ms)
        ✓ should have Create Image button (1698ms)
  3 passing (6s)
```

Screenshot and error log will be generated if case failed.
The screenshot will be uploaded to AWS S3 and can be found from
`https://s3.amazonaws.com/weldr/web-fail-test-screenshot/<Travis Build Number>/<Test Case Full Name>.<YYYY-mm-dd-HH-MM-SS>.fail.png`


## Code Style

JavaScript code in this project should follow
[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

---
Made with ♥ by the [Welder team](https://github.com/orgs/weldr/people) and its
contributors.
