import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchBlueprintContentsApi, fetchModalCreateImageTypesApi } from '../apiCalls';

import {
   FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS, setModalExportBlueprintContents,
   fetchingModalCreateImageTypesSuccess,
} from '../actions/modals';

function* fetchModalBlueprintContents(action) {
  try {
    const { blueprintName } = action.payload;
    const response = yield call(fetchBlueprintContentsApi, blueprintName);
    yield put(setModalExportBlueprintContents(response.components));
  } catch (error) {
    console.log('Error in loadModalBlueprintSaga');
  }
}

function* fetchModalCreateImageTypes() {
  try {
    const response = yield call(fetchModalCreateImageTypesApi);
    yield put(fetchingModalCreateImageTypesSuccess(response));
  } catch (error) {
    console.log('Error in loadModalBlueprintSaga');
  }
}

export default function* () {
  yield takeEvery(FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS, fetchModalBlueprintContents);
  yield* fetchModalCreateImageTypes();
}
