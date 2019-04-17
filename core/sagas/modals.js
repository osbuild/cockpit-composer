import { call, put, takeEvery } from "redux-saga/effects";
import { fetchSourceInfoApi, addSourceApi, deleteSourceApi } from "../apiCalls";

import {
  FETCHING_MODAL_MANAGE_SOURCES_CONTENTS,
  setModalManageSourcesContents,
  modalManageSourcesFailure,
  ADD_MODAL_MANAGE_SOURCES_ENTRY,
  REMOVE_MODAL_MANAGE_SOURCES_ENTRY
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

function* addModalManageSourcesEntry(action) {
  try {
    const { source } = action.payload;
    const addResponse = yield call(addSourceApi, source);
    if (addResponse) {
      yield call(fetchModalManageSourcesContents);
    }
  } catch (error) {
    console.log("Error adding source. ", error);
    yield put(modalManageSourcesFailure(error));
  }
}

function* removeModalManageSourcesEntry(action) {
  try {
    const { sourceName } = action.payload;
    yield call(deleteSourceApi, sourceName);
    yield call(fetchModalManageSourcesContents);
  } catch (error) {
    console.log("Error deleting source. ", error);
    yield put(modalManageSourcesFailure(error));
  }
}

export default function*() {
  yield takeEvery(FETCHING_MODAL_MANAGE_SOURCES_CONTENTS, fetchModalManageSourcesContents);
  yield takeEvery(ADD_MODAL_MANAGE_SOURCES_ENTRY, addModalManageSourcesEntry);
  yield takeEvery(REMOVE_MODAL_MANAGE_SOURCES_ENTRY, removeModalManageSourcesEntry);
}
