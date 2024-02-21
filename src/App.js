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
  // cockpit's language is stored in localStorage as `cockpit.lang`
  // https://github.com/cockpit-project/cockpit/blob/bafd1067f7f8b9d16479c90bd77dcdda08f044ce/pkg/shell/shell-modals.jsx#L104C38-L104C50
  const cockpitLocale = localStorage.getItem("cockpit.lang");
  // browser default language
  const userLocale = window.navigator.language;
  // use cockpit's language if it's available
  // otherwise use the browser's default language
  const locale = cockpitLocale || userLocale;
  // strip region code
  const language = locale.split("-")[0];
  let translations;
  try {
    translations = (await import(`../translations/compiled/${language}.json`))
      .default;
  } catch (error) {
    console.error(error);
    translations = (await import("../translations/compiled/en.json")).default;
  }

  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider
        key={language}
        defaultLocale="en"
        locale={language}
        messages={translations}
      >
        <Content />
      </IntlProvider>
    </Provider>,
    document.getElementById("main")
  );
};

main();
