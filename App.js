import React from "react";
import { Routes, Route } from "react-router-dom";
import BlueprintsPage from "./pages/blueprints";
import BlueprintDetails from "./pages/blueprintDetails";
import ErrorPage from "./pages/error";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<BlueprintsPage />} />
      <Route path="/:blueprint" element={<BlueprintDetails />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
