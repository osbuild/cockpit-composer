import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";

import store from "./store";
import { fetchImageTypes, fetchAllImages } from "./slices/imagesSlice";
import { fetchBlueprints } from "./slices/blueprintsSlice";
import { getAPIStatus } from "./api";

// import patternfly's base style and addons
import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly-addons.css";
// App wide custom styles
import "./App.css";

import BlueprintDetails from "./pages/blueprintDetails";
import BlueprintList from "./pages/blueprintList";
import APIEmpty from "./components/EmptyStates/APIEmpty";

store.dispatch(fetchImageTypes());
store.dispatch(fetchBlueprints());
store.dispatch(fetchAllImages());

const Content = () => {
  const [isAPIOn, setIsAPIOn] = useState();

  useEffect(() => {
    const response = getAPIStatus();
    response.then(() => setIsAPIOn(true)).catch(() => setIsAPIOn(false));
  }, []);

  const Router = () => (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BlueprintList />} />
        <Route path="/:blueprint" element={<BlueprintDetails />} />
        <Route path="*" element={"Error"} />
      </Routes>
    </HashRouter>
  );

  return isAPIOn ? <Router /> : <APIEmpty />;
};

const main = async () => {
  // use language without region code
  const userLocale = window.navigator.language.split("-")[0];
  let translations;
  try {
    translations = (await import(`../translations/compiled/${userLocale}.json`))
      .default;
  } catch (error) {
    console.error(error);
    translations = (await import("../translations/compiled/en.json")).default;
  }

  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider
        key={userLocale}
        defaultLocale="en"
        locale={userLocale}
        messages={translations}
      >
        <Content />
      </IntlProvider>
    </Provider>,
    document.getElementById("main")
  );
};

main();
