import { delay } from 'redux-saga'
import { call, all, put, takeEvery } from 'redux-saga/effects';
import {
  startComposeApi, fetchImageStatusApi, fetchComposeQueueApi, fetchComposeFinishedApi, fetchComposeFailedApi
} from '../apiCalls';

import {
   START_COMPOSE,
   fetchingComposeStatusSucceeded,
   FETCHING_COMPOSES, fetchingComposeSucceeded,
   composesFailure,
} from '../actions/composes';


function* startCompose(action) {
  try {
    const {blueprintName, composeType} = action.payload;
    const response = yield call(startComposeApi, blueprintName, composeType);
    const statusResponse = yield call(fetchImageStatusApi, response.build_id);
    yield put(fetchingComposeSucceeded(statusResponse.uuids[0]));
    if (statusResponse.uuids[0].queue_status === "WAITING" || statusResponse.uuids[0].queue_status === "RUNNING") {
      yield* pollComposeStatus(statusResponse.uuids[0]);
    }
  }
  catch (error) {
    console.log('startComposeError');
    yield put(composesFailure(error));
  }
}

function* pollComposeStatus(compose) {
  try {
    let polledCompose = compose;
    while (polledCompose.queue_status === "WAITING" || polledCompose.queue_status === "RUNNING") {
      const response = yield call(fetchImageStatusApi, polledCompose.id);
      polledCompose = response.uuids[0];
      yield put(fetchingComposeStatusSucceeded(polledCompose));
      yield call(delay, 60000);
    }
  } catch (error) {
    console.log('pollComposeStatusError');
    yield put(composesFailure(error));
  }
}

function* fetchComposes() {
  try {
    const queue = yield call(fetchComposeQueueApi);
    const finished = yield call(fetchComposeFinishedApi);
    const failed = yield call(fetchComposeFailedApi);
    const composes = queue.concat(finished, failed);
    yield all(composes.map(compose => put(fetchingComposeSucceeded(compose))));
    yield all(queue.map(compose => pollComposeStatus(compose)));
  } catch (error) {
    console.log('fetchComposesError');
    yield put(composesFailure(error));
  }
}

export default function* () {
  yield takeEvery(START_COMPOSE, startCompose);
  yield takeEvery(FETCHING_COMPOSES, fetchComposes);
}
