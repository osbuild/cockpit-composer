# Welder Web

[![Build Status](https://travis-ci.org/weldr/welder-web.svg?branch=master)](https://travis-ci.org/weldr/welder-web)
[![codecov](https://codecov.io/gh/weldr/welder-web/branch/master/graph/badge.svg)](https://codecov.io/gh/weldr/welder-web)

The web interface for Welder!


### Getting Started

**Step 1**. Make sure that you have [Node.js](https://nodejs.org/) v6.9.1 or newer installed on your
machine. For example:
```shell
nvm install 6.9.1
```
Or if it's installed, make sure you're using it:
```shell
nvm use 6.9.1
```

**Step 2**. Clone this repository and install its dependencies:

```shell
$ git clone -o upstream -b master --single-branch https://github.com/weldr/welder-web
$ cd welder-web/
$ npm install                   # Install project dependencies listed in package.json
```

**Step 3**. Compile and launch your app by running:

```shell
$ node run build
$ node run                      # Same as `npm start` or `node run start`
```

You can also test your app in release (production) mode by running `node run start --release` or
with HMR and React Hot Loader disabled by running `node run start --no-hmr`. The app should become
available at [http://localhost:3000/](http://localhost:3000/).

You can also enable code instrumentation with istanbul by specifying
`node run build --with-coverage` or `node run --with-coverage`. This is needed if you want to
collect code coverage from end-to-end tests. Don't use `--with-coverage` when running the unit tests.
`jest` provides its own instrumentation and it will break if we do double instrumentation.
Disabled by default!


### How to Test

#### Unit Test

The unit tests are powered by [Jest](https://facebook.github.io/jest/) and [Enzyme](http://airbnb.io/enzyme/)

```shell
$ npm run lint                  # Check JavaScript and CSS code for potential issues
$ npm run test                  # Run unit tests. Or, `npm run test:watch`
```

#### End-to-End Test

[End-to-End Test Running Guide](test/end-to-end/README.md).

**NOTE:** all tests are executed in Travis CI on every commit and every pull request!

### How to Deploy

Update `publish` script in the [`run.js`](run.js) file with your full Firebase project name as found
in your [Firebase console](https://console.firebase.google.com/). Note that this may have an
additional identifier suffix than the shorter name you've provided. Then run:

```shell
$ node run publish              # Build and publish the website to Firebase, same as `npm run publish`
```

The first time you publish, you will be prompted to authenticate with Google and generate an
authentication token in order for the publish script to continue.

![publish](https://koistya.github.io/files/react-static-boilerplate-publish.gif)

If you need just to build the project without publishing it, run:

```shell
$ node run build                # Or, `node run build --release` for production build
```

### Building a Docker image

To build the Welder web application as a Docker image see
[`README.docker`](README.docker)

### License

This source code is licensed under the MIT license found in the [`LICENSE.txt`](LICENSE.txt) file.

### Application internals

&nbsp; &nbsp; ✓ Includes [Patternfly](http://www.patternfly.org/) CSS & some React implementations of Patternfly components<br>
&nbsp; &nbsp; ✓ Modern JavaScript syntax ([ES2015](http://babeljs.io/docs/learn-es2015/)+) via [Babel](http://babeljs.io/), modern CSS syntax via [PostCSS](https://github.com/postcss/postcss)<br>
&nbsp; &nbsp; ✓ Component-based UI architecture via [React](http://facebook.github.io/react/), [Webpack](https://webpack.github.io/) and [CSS Modules](https://github.com/css-modules/css-modules)<br>
&nbsp; &nbsp; ✓ Application state management /w time-travel debugging via [Redux](http://redux.js.org/) (see [`main.js`](main.js), [`core/store.js`](core/store.js))<br>
&nbsp; &nbsp; ✓ Routing and navigation via [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) and [`history`](https://github.com/mjackson/history) (see [`main.js`](main.js), [`core/router.js`](core/router.js), [`utils/routes-loader.js`](utils/routes-loader.js))<br>
&nbsp; &nbsp; ✓ [Code-splitting](https://github.com/webpack/docs/wiki/code-splitting) and async chunk loading via [Webpack](https://webpack.github.io/) and [ES6 System.import()](http://www.2ality.com/2014/09/es6-modules-final.html)<br>
&nbsp; &nbsp; ✓ Hot Module Replacement ([HMR](https://webpack.github.io/docs/hot-module-replacement.html)) /w [React Hot Loader](http://gaearon.github.io/react-hot-loader/)<br>
&nbsp; &nbsp; ✓ Cross-device testing with [Browsersync](https://browsersync.io/) (see [`run.js#start`](run.js))<br>

### Directory Layout

```shell
.
├── /components/                # Shared or generic UI components
│   ├── /CardView/              # CardView component
│   ├── /Layout/                # Website layout component
│   ├── /Link  /                # Link component to be used insted of <a>
│   └── /...                    # etc.
├── /core/                      # Core framework
│   ├── /history.js             # Handles client-side navigation
│   ├── /router.js              # Handles routing and data fetching
│   └── /store.js               # Application state manager (Redux)
├── /node_modules/              # 3rd-party libraries and utilities
├── /pages/                     # React components for web pages
│   ├── /app/                   # App page
│   ├── /error/                 # Error page
│   ├── /blueprints/            # Blueprints page
│   └── /...                    # etc.
├── /public/                    # Static files such as favicon.ico etc.
│   ├── /dist/                  # The folder for compiled output
│   ├── favicon.ico             # Application icon to be displayed in bookmarks
│   ├── robots.txt              # Instructions for search engine crawlers
│   └── /...                    # etc.
├── /test/                      # Unit and integration tests
├── /utils/                     # Utility and helper classes
│── main.js                     # React application entry point
│── package.json                # The list of project dependencies and NPM scripts
│── routes.json                 # This list of application routes
│── run.js                      # Build automation script, e.g. `node run build`
└── webpack.config.js           # Bundling and optimization settings for Webpack
```

### Cockpit Package

This project can also be used through cockpit as a cockpit package.

```
npm install && node run build
mkdir -p ~/.local/share/cockpit
ln -s /path/to/welder-web/public ~/.local/share/cockpit/welder
```

Then you if you log into cockpit as the user that owns ```~```, you can use the app from cockpit.

To keep this working all code should follow the following rules.

 * All urls in the html and javascript need to use relative paths.
 * All requests to the API should be made using ```utils.apiFetch```. Any non API ```fetch``` requests
   must use ```credentials: 'same-origin'``` so that cookies are included with those ajax requests.
 * Use hashes for navigation within the SPA so that cockpit can keep the top level location display
   up to date.


### Package as an RPM/SRPM

This project can be packaged as either a noarch rpm or an srpm.

```shell
$ make rpm                # Or, `make srpm`
```

---
Made with ♥ by the Welder [team](https://github.com/orgs/weldr/people) and its contributors
