import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";

// Contains PF3 stylesheets and base for PF4
import "./lib/patternfly/patternfly-cockpit.scss";
import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/patternfly/layouts/Flex/flex.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "./public/custom.css";
import "bootstrap";

import store from "./core/store";

import App from "./App";

// Intialize any necessary locale data, and load translated messages
const translations = require("./build/translations.json");
const userLanguage = navigator.language;
const localeLang = userLanguage.includes("_")
  ? userLanguage.replace("_", "-")
  : userLanguage;

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider
      defaultLocale="en-US"
      locale={localeLang}
      messages={translations[userLanguage]}
    >
      <BrowserRouter basename="/cockpit/@localhost/composer">
        <App />
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById("main")
);
