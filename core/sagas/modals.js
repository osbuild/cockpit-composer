import { call, put, takeEvery } from "redux-saga/effects";
import { fetchModalCreateImageTypesApi, fetchSourceInfoApi } from "../apiCalls";

import {
  fetchingModalCreateImageTypesSuccess,
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

function* fetchModalCreateImageTypes() {
  try {
    const response = yield call(fetchModalCreateImageTypesApi);
    yield put(fetchingModalCreateImageTypesSuccess(response));
  } catch (error) {
    console.log("Error in loadModalBlueprintSaga");
  }
}

export default function*() {
  yield takeEvery(FETCHING_MODAL_MANAGE_SOURCES_CONTENTS, fetchModalManageSourcesContents);
  yield* fetchModalCreateImageTypes();
}
