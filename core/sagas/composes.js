import { delay } from "redux-saga";
import { call, all, put, takeEvery } from "redux-saga/effects";
import {
  startComposeApi,
  fetchImageStatusApi,
  fetchComposeTypesApi,
  fetchComposeQueueApi,
  fetchComposeFinishedApi,
  fetchComposeFailedApi,
  deleteComposeApi,
  cancelComposeApi
} from "../apiCalls";

import {
  START_COMPOSE,
  fetchingComposeStatusSucceeded,
  FETCHING_COMPOSES,
  fetchingComposeTypesSucceeded,
  fetchingComposeSucceeded,
  composesFailure,
  CANCELLING_COMPOSE,
  DELETING_COMPOSE,
  deletingComposeSucceeded,
  deletingComposeFailure,
  cancellingComposeSucceeded,
  cancellingComposeFailure,
  FETCHING_QUEUE,
  fetchingQueueSucceeded
} from "../actions/composes";

function* startCompose(action) {
  try {
    const { blueprintName, composeType } = action.payload;
    const response = yield call(startComposeApi, blueprintName, composeType);
    const statusResponse = yield call(fetchImageStatusApi, response.build_id);
    yield put(fetchingComposeSucceeded(statusResponse.uuids[0]));
    if (statusResponse.uuids[0].queue_status === "WAITING" || statusResponse.uuids[0].queue_status === "RUNNING") {
      yield* pollComposeStatus(statusResponse.uuids[0]);
    }
  } catch (error) {
    console.log("startComposeError", error);
    yield put(composesFailure(error));
  }
}

function* pollComposeStatus(compose) {
  try {
    let polledCompose = compose;
    while (polledCompose.queue_status === "WAITING" || polledCompose.queue_status === "RUNNING") {
      const response = yield call(fetchImageStatusApi, polledCompose.id);
      polledCompose = response.uuids[0];
      if (polledCompose !== undefined) {
        yield put(fetchingComposeStatusSucceeded(polledCompose));
        yield call(delay, 60000);
      } else {
        // polledCompose was stopped by user
        break;
      }
    }
  } catch (error) {
    console.log("pollComposeStatusError", error);
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
    if (queue.length >= 1) {
      yield all(queue.map(compose => pollComposeStatus(compose)));
    }
  } catch (error) {
    console.log("fetchComposesError", error);
    yield put(composesFailure(error));
  }
}

function* deleteCompose(action) {
  try {
    const { composeId } = action.payload;
    const response = yield call(deleteComposeApi, composeId);
    yield put(deletingComposeSucceeded(response, composeId));
    yield* fetchComposes();
  } catch (error) {
    console.log("errorDeleteComposeSaga", error);
    yield put(deletingComposeFailure(error));
  }
}

function* cancelCompose(action) {
  try {
    const { composeId } = action.payload;
    const response = yield call(cancelComposeApi, composeId);
    yield put(cancellingComposeSucceeded(response, composeId));
    yield* fetchComposes();
  } catch (error) {
    console.log("errorCancelComposeSaga", error);
    yield put(cancellingComposeFailure(error));
  }
}

function* fetchQueue() {
  try {
    const queue = yield call(fetchComposeQueueApi);
    yield put(fetchingQueueSucceeded(queue));
  } catch (error) {
    console.log("fetchQueueError", error);
    yield put(composesFailure(error));
  }
}

function* fetchComposeTypes() {
  try {
    console.info("fetchComposeTypes");
    const response = yield call(fetchComposeTypesApi);
    yield put(fetchingComposeTypesSucceeded(response));
  } catch (error) {
    console.log("Error in loadImageTypesSaga");
  }
}

export default function*() {
  yield* fetchComposeTypes();
  yield takeEvery(START_COMPOSE, startCompose);
  yield takeEvery(FETCHING_COMPOSES, fetchComposes);
  yield takeEvery(DELETING_COMPOSE, deleteCompose);
  yield takeEvery(CANCELLING_COMPOSE, cancelCompose);
  yield takeEvery(FETCHING_QUEUE, fetchQueue);
}
