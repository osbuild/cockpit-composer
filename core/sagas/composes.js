import { delay } from 'redux-saga'
import { call, all, put, takeEvery } from 'redux-saga/effects';
import {
  startComposeApi, fetchImageStatusApi, fetchComposeQueueApi, fetchComposeFinishedApi, fetchComposeFailedApi
} from '../apiCalls';

import {
   START_COMPOSE,
   fetchingComposeStatusSucceeded, fetchingComposeSucceeded,
} from '../actions/composes';


function* startCompose(action) {
  try {
    const {blueprintName, composeType} = action.payload;
    const response = yield call(startComposeApi, blueprintName, composeType);
    yield* fetchComposeStatus(blueprintName, response.build_id);
  } catch (error) {
    console.log('startComposeError');
  }
}

function* fetchComposeStatus(blueprintName, composeId) {
  try {
    let statusResponse = yield call(fetchImageStatusApi, composeId);
    yield put(fetchingComposeStatusSucceeded(blueprintName, statusResponse.uuids[0]));
    while (statusResponse.uuids[0].queue_status === "WAITING" || statusResponse.uuids[0].queue_status === "RUNNING") {
      yield call(delay, 60000);
      statusResponse = yield call(fetchImageStatusApi, composeId);
      yield put(fetchingComposeStatusSucceeded(blueprintName, statusResponse.uuids[0]));
    }
  } catch (error) {
    console.log('fetchComposeStatusError' + error);
  }
}

function* fetchComposes() {
  try {
    const [queue, finished, failed] = yield all([
      call(fetchComposeQueueApi),
      call(fetchComposeFinishedApi),
      call(fetchComposeFailedApi),
    ]);
    const composes = queue.concat(finished, failed);
    yield all(composes.map(compose => put(fetchingComposeSucceeded(compose))));
  } catch (error) {
    console.log('fetchinComposesError');
  }
}

export default function* () {
  yield takeEvery(START_COMPOSE, startCompose);
  yield* fetchComposes();
}
