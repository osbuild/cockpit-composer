import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import { addLocaleData, IntlProvider } from "react-intl";
import enLocaleData from "react-intl/locale-data/en";
import FastClick from "fastclick";
import { Provider } from "react-redux";
import "bootstrap";

import store from "./core/store";
import router from "./core/router";
import history from "./core/history";
import utils from "./core/utils";

// Intialize any necessary locale data, and load translated messages
import "./build/localeLoader";

let translations = require("./build/translations.json");

addLocaleData(enLocaleData);

let routes = require("./routes.json");
// Loaded with utils/routes-loader.js
const container = document.getElementById("main");

// Check if we have translations for the user's language
let userLanguage;
if (utils.inCockpit) {
  var cockpit = require("cockpit"); // eslint-disable-line global-require, import/no-unresolved
  userLanguage = cockpit.language;
} else {
  userLanguage = navigator.language.split("-")[0];
}

let messages = undefined;
if (userLanguage in translations) {
  messages = translations[userLanguage];
}

function renderComponent(component) {
  ReactDOM.render(
    <Provider store={store}>
      {messages !== undefined ? (
        <IntlProvider locale={userLanguage} messages={messages}>
          {component}
        </IntlProvider>
      ) : (
        <IntlProvider locale="en">{component}</IntlProvider>
      )}
    </Provider>,
    container
  );
}

// Find and render a web page matching the current URL path,
// if such page is not found then render an error page (see routes.json, core/router.js)
function render(location) {
  router
    .resolve(routes, location)
    .then(renderComponent)
    .catch(error => router.resolve(routes, Object.assign({}, location, { error: error })).then(renderComponent));
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/ReactJSTraining/history/tree/master/docs#readme
history.listen(render);
render(history.getCurrentLocation());

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
FastClick.attach(document.body);

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept("./routes.json", () => {
    routes = require("./routes.json"); // eslint-disable-line global-require
    render(history.getCurrentLocation());
  });
}
