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
import "./dist/custom.css";
import "bootstrap";

import store from "./core/store";

import App from "./App";

// use language without region code
const userLocale = window.navigator.language.split("-")[0];
let translations;
try {
  translations = require("./translations/compiled/" + userLocale + ".json");
} catch (error) {
  console.error(error);
  translations = require("./translations/compiled/en.json");
}

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider
      key={userLocale}
      defaultLocale="en"
      locale={userLocale}
      messages={translations}
    >
      <BrowserRouter basename="/cockpit/@localhost/composer">
        <App />
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById("main")
);
