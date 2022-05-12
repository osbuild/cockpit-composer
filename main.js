import "core-js/stable";
// redux-saga uses generators, use regenerator-runtime/runtime to transform generators
import "regenerator-runtime/runtime";

import "whatwg-fetch";

// Contains PF3 stylesheets and base for PF4
import "./lib/patternfly/patternfly-cockpit.scss";

import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import FastClick from "fastclick";
import { Provider } from "react-redux";
import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/patternfly/layouts/Flex/flex.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "./public/custom.css";
import "bootstrap";
import cockpit from "cockpit";

import store from "./core/store";
import router from "./core/router";
import history from "./core/history";

// Intialize any necessary locale data, and load translated messages
const translations = require("./build/translations.json");

const routes = require("./routes.json");
// Loaded with utils/routes-loader.js
const container = document.getElementById("main");

const userLanguage = cockpit.language;

let messages;
if (userLanguage in translations) {
  messages = translations[userLanguage];
}

let localeLang = "en";
if (userLanguage) {
  localeLang = userLanguage.includes("_") ? userLanguage.replace("_", "-") : userLanguage;
}

function renderComponent(component) {
  ReactDOM.render(
    <Provider store={store}>
      {messages !== undefined ? (
        <IntlProvider locale={localeLang} messages={messages}>
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
    .catch((error) => router.resolve(routes, { ...location, error }).then(renderComponent));
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/ReactJSTraining/history/tree/master/docs#readme
history.listen(render);
render(history.getCurrentLocation());

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
FastClick.attach(document.body);
