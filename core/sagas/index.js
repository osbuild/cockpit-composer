import { all, fork } from 'redux-saga/effects';
import users from './users';
import recipes from './recipes';
import modals from './modals';
import inputs from './inputs';

function* rootSaga() {
  yield all([
    fork(users),
    fork(recipes),
    fork(modals),
    fork(inputs),
  ]);
}

export default rootSaga;
