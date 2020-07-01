import { call, put, takeEvery } from "redux-saga/effects";
import * as composer from "../composer";

import { FETCHING_UPLOAD_PROVIDERS, fetchingUploadProvidersSucceeded } from "../actions/uploads";

function* fetchUploadProviders() {
  try {
    const response = yield call(composer.getUploadProviders);
    yield put(fetchingUploadProvidersSucceeded(response));
  } catch (error) {
    console.log("Error in fetchUploadsSaga");
  }
}

export default function* () {
  yield takeEvery(FETCHING_UPLOAD_PROVIDERS, fetchUploadProviders);
}
