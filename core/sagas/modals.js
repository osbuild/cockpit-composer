import { call, put, takeEvery } from "redux-saga/effects";
import { fetchSourceInfoApi } from "../apiCalls";

import {
  FETCHING_MODAL_MANAGE_SOURCES_CONTENTS,
  setModalManageSourcesContents,
  modalManageSourcesFailure
} from "../actions/modals";

function* fetchModalManageSourcesContents() {
  try {
    const response = yield call(fetchSourceInfoApi, "*");
    yield put(setModalManageSourcesContents(response));
  } catch (error) {
    console.log("Error fetching sources. ", error);
    yield put(modalManageSourcesFailure(error));
  }
}

export default function*() {
  yield takeEvery(FETCHING_MODAL_MANAGE_SOURCES_CONTENTS, fetchModalManageSourcesContents);
}
