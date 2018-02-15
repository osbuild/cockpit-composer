import { all, fork } from 'redux-saga/effects';
import blueprints from './blueprints';
import modals from './modals';
import inputs from './inputs';

function* rootSaga() {
  yield all([
    fork(blueprints),
    fork(modals),
    fork(inputs),
  ]);
}

export default rootSaga;
