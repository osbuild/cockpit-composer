import "core-js/stable";
// redux-saga uses generators, use regenerator-runtime/runtime to transform generators
import "regenerator-runtime/runtime";

import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import { addLocaleData, IntlProvider } from "react-intl";
import enLocaleData from "react-intl/locale-data/en";
import FastClick from "fastclick";
import { Provider } from "react-redux";
import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/patternfly/layouts/Flex/flex.css";
import "./public/custom.css";
import "bootstrap";
import cockpit from "cockpit";

import store from "./core/store";
import router from "./core/router";
import history from "./core/history";

// Intialize any necessary locale data, and load translated messages
const translations = require("./build/translations.json");

const languages = [...new Set(Object.keys(translations).map(lang => lang.split("_")[0]))];
for (let lang of languages) {
  const localData = require(`react-intl/locale-data/${lang}`); // eslint-disable-line import/no-dynamic-require
  addLocaleData(localData);
}
// still need english
addLocaleData(enLocaleData);

let routes = require("./routes.json");
// Loaded with utils/routes-loader.js
const container = document.getElementById("main");

const userLanguage = cockpit.language;

let messages = undefined;
if (userLanguage in translations) {
  messages = translations[userLanguage];
}

let locale_lang = "en";
if (userLanguage) {
  locale_lang = userLanguage.includes("_") ? userLanguage.replace("_", "-") : userLanguage;
}

function renderComponent(component) {
  ReactDOM.render(
    <Provider store={store}>
      {messages !== undefined ? (
        <IntlProvider locale={locale_lang} messages={messages}>
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
