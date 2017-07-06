import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUsersApi } from '../apiCalls';

import {
   FETCHING_USERS, fetchingUsersSucceeded, fetchingUsersFailed,
} from '../actions/users';

function* fetchUsers() {
  try {
    const response = yield call(fetchUsersApi);
    yield put(fetchingUsersSucceeded(response));
  } catch (error) {
    yield put(fetchingUsersFailed(error));
  }
}

export default function* () {
  yield takeLatest(FETCHING_USERS, fetchUsers);
}
