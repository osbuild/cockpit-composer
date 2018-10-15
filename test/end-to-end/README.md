# Welder End-To-End Test

The end-to-end automation test for Welder! It is performed on the application
level and tests whether the business requirements are met regardless of app
internal architecture, dependencies, data integrity and such. Actually we need
to follow the end-user flows and assert they get the intended experience and
focus on the behavior of the thing as the user would see it.

## Test Scenario

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

For testing, the following dependencies are required:

    $ sudo yum install libvirt libvirt-client libvirt-daemon libvirt-python \
        python python-libguestfs python-lxml libguestfs-xfs \
        python3 libvirt-python3 \
        libguestfs-tools qemu qemu-kvm rpm-build

#### Test Running Command

Run test without visually seeing what the browser is doing:

    $ make check

In the event you wish to visually see what the browser is doing you will want to run:

    $ make debug-check

By default the test will be run on Firefox. To run it on Chrome, a prefix ```BROWSER=chrome``` needs to be added, like:

    $ BROWSER=chrome make check


**NOTE:** You have to have **vncviewer** installed by ```sudo dnf install tigervnc``` to get browser out.

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
`.nyc_output/coverage-<HASH>.json`. The hash value is the sha256 sum of the coverage
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

## Test Report

1. Test report will be generated in ```test/end-to-end``` folder if you run test locally.
2. The CI will upload test log and report to ```https://fedorapeople.org```, and you can find a link to it in the commit message of each push request.

## Code Style

JavaScript code in this project should follow
[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

---
Made with ♥ by the [Welder team](https://github.com/orgs/weldr/people) and its
contributors.
