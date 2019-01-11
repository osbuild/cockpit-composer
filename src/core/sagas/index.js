import { all, fork } from "redux-saga/effects";
import blueprints from "./blueprints";
import modals from "./modals";
import inputs from "./inputs";
import composes from "./composes";

function* rootSaga() {
  yield all([fork(blueprints), fork(modals), fork(inputs), fork(composes)]);
}

export default rootSaga;
