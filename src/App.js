import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";

import store from "./store";
import { fetchImageTypes, fetchAllImages } from "./slices/imagesSlice";
import { fetchBlueprints } from "./slices/blueprintsSlice";

// import patternfly's base style and addons
import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly-addons.css";
// App wide custom styles
import "./App.css";

import BlueprintDetails from "./pages/blueprintDetails";
import BlueprintList from "./pages/blueprintList";

// use language without region code
const userLocale = window.navigator.language.split("-")[0];
let translations;
try {
  translations = require("../translations/compiled/" + userLocale + ".json");
} catch (error) {
  console.error(error);
  translations = require("../translations/compiled/en.json");
}

store.dispatch(fetchImageTypes());
store.dispatch(fetchBlueprints());
store.dispatch(fetchAllImages());

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<BlueprintList />} />
      <Route path="/:blueprint" element={<BlueprintDetails />} />
      <Route path="*" element={"Error"} />
    </Routes>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider
      key={userLocale}
      defaultLocale="en"
      locale={userLocale}
      messages={translations}
    >
      <HashRouter>
        <Routing />
      </HashRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById("main")
);
