import React from "react";
import { Routes, Route } from "react-router-dom";
import BlueprintsPage from "./pages/blueprints";
import ErrorPage from "./pages/error";

const App = () => {
  return (
    <Routes>
      <Route path="/index.html" element={<BlueprintsPage />} />
      <Route path="/" element={<BlueprintsPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
