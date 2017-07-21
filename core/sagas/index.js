import { all, fork } from 'redux-saga/effects';
import users from './users';
import recipes from './recipes';
import modals from './modals';

function* rootSaga() {
  yield all([
    fork(users),
    // put(fetchingUsers()),
    fork(recipes),
    // put(fetchingRecipes()),
    fork(modals),
  ]);
}

export default rootSaga;
