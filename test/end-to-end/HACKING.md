# Hacking on end to end test

Here's where to get the code:

    $ git clone https://github.com/weldr/cockpit-composer.git
    $ cd test/end-to-end

The remainder of the commands assume you're in the test/end-to-end folder.

## Getting the development dependencies

Cockpit-composer end to end test uses Node.js during case development.
To make changes on Cockpit you'll want to install Node.js, NPM and
various development dependencies.

On Fedora:

    $ sudo dnf install nodejs npm

And get development dependencies:

    $ npm install

Lastly get `cockpit`, `lorax-composer`, and `cockpit-composer` running
locally.

## Setup selenium and browser running environment

End to end test depends on [webdriver.io](http://v4.webdriver.io/), which
is a WebDriver test framework for Node.js. A selenium running environment
should be ready before test running. The easiest and fastest way to setup
selenium is by running selenium from [Selenium Docker Image](https://github.com/SeleniumHQ/docker-selenium)

Please make sure you have docker or podman installed.

Running selenium hub:

    $ podman run -d --network host --name selenium-hub selenium/hub:latest

Running firefox container:

    $ podman run -d --shm-size=512M --name firefox --network host -e VNC_NO_PASSWORD=1 -e HUB_HOST=127.0.0.1 -e HUB_PORT=4444 selenium/node-firefox-debug:latest

### Debugging

In the event you wish to visually see what the browser is doing, you need
to run the `debug` variant of node image like "selenium/node-firefox-debug".
The `debug` node image has a VNC server installed inside container and
running on port 5900.

In case you have `vncviewer` binary in your path, you can always take a look,
view only to avoid messing around your tests with an unintended mouse click
or keyboard interrupt:

    $ vncviewer 127.0.0.1:5900

## Run end to end test

### To run full suites of tests on firefox

    $ COCKPIT_USERNAME=<username> COCKPIT_PASSWORD=<password> BROWSER=firefox DEBUG_TEST=true npm run test

### To run a specific suite on firefox

Run User Account related tests, for example:

    $ COCKPIT_USERNAME=<username> COCKPIT_PASSWORD=<password> BROWSER=firefox DEBUG_TEST=true npm run test -- --spec createUserAccount.test.js
