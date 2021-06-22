import { combineReducers } from "redux";
import alerts from "./alerts";
import blueprints from "./blueprints";
import blueprintPage from "./blueprintPage";
import inputs from "./inputs";
import modals from "./modals";
import sort from "./sort";
import filter from "./filter";
import composes from "./composes";
import uploads from "./uploads";

const rootReducer = combineReducers({
  alerts,
  blueprints,
  blueprintPage,
  inputs,
  modals,
  sort,
  filter,
  composes,
  uploads,
});

export default rootReducer;
