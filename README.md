# Cockpit Composer

[![codecov](https://codecov.io/gh/osbuild/cockpit-composer/branch/main/graph/badge.svg)](https://codecov.io/gh/osbuild/cockpit-composer)

**The web interface for on-premise Image Builder!**

Image Builder generates custom images suitable for deploying systems or uploading to
the cloud. It integrates into [Cockpit](https://cockpit-project.org/) as a
frontend for [osbuild](https://github.com/osbuild).

## Install from official repositories

Cockpit Composer can be installed on RHEL and Fedora systems using:

    $ dnf install cockpit-composer

Make sure to install/enable [Cockpit](https://cockpit-project.org/) with:

    $ systemctl enable --now cockpit.socket
## Install from source code

First download the code from Github:

    $ git clone https://github.com/osbuild/cockpit-composer.git
    $ cd cockpit-composer/

## Development instructions

It's easy to set up your local machine to develop on Cockpit Composer.
### Install the development dependencies

On Fedora or Red Hat Enterprise Linux:

* First install Cockpit on your local machine as described in: https://cockpit-project.org/running.html.
* Next install and start osbuild-composer:
```
    $ dnf install osbuild-composer cockpit
    $ systemctl start osbuild-composer
```

* Cockpit Composer uses Node.js during development. Node.js is not used at runtime. To make changes on Cockpit you'll want to install Node.js, NPM.
```
    $ dnf install nodejs npm
```

* In order to build an rpm, `rpm-build` is required
```
    $ dnf install rpm-build
```

### Build and run

* To build Cockpit Composer, run:
```
    $ make build
```

This will create a `public` directory which can be sym-linked into Cockpit as a plugin:
```
    $ mkdir -p ~/.local/share/cockpit
    $ ln -s $(pwd)/public ~/.local/share/cockpit/composer
```

Now you can log into Cockpit Composer on your local machine at the following address. Use the same user and password that you used to log into your local user account.

https://localhost:9090/composer

Cockpit Composer can also be built in `watch` mode so that it will rebuild on code changes without having to manually rerun `make build`. This can be done using:

```
    npm ci
    npm run watch
```

### Style linters

We use eslint and prettier to enforce code style. To run the linters, run:
```
    $ npm run lint
    $ npm run prettier
```

Any auto fixable errors can be corrected with:
```
    $ npm run format
```

### Build rpm

    $ make rpm

### Run integration test

Run test without visually seeing what the browser is doing:

    $ make check

To learn more about testing see our [testing docs](test).


### Cockpit API

To keep Cockpit Composer working with Cockpit API all code should follow the following rules.

 * All urls in the html and javascript need to use relative paths.
 * All requests to the API should be made using ```utils.apiFetch```. Any non API ```fetch``` requests
   must use ```credentials: 'same-origin'``` so that cookies are included with those ajax requests.
 * Use hashes for navigation within the SPA so that cockpit can keep the top level location display
   up to date.

## Automated maintenance

It is important to keep the [NPM modules](./package.json) up to date, to keep
up with security updates and bug fixes. This is done automatically by Dependabot.
which is run daily.

Similarly, translations are refreshed automatically by Weblate.

## License

This source code is licensed under the MIT license found in the [`LICENSE.txt`](LICENSE.txt) file.

---
Made with ♥ by the [OSBuild team](https://github.com/orgs/osbuild/people), [Welder team](https://github.com/orgs/weldr/people), [Cockpit team](https://github.com/orgs/cockpit-project/people), and contributors
