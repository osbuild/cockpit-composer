import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchBlueprintContentsApi, fetchModalCreateCompositionTypesApi } from '../apiCalls';

import {
   FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS, setModalExportBlueprintContents,
   fetchingModalCreateCompositionTypesSuccess,
} from '../actions/modals';

function* fetchModalBlueprintContents(action) {
  try {
    const { blueprintName } = action.payload;
    const response = yield call(fetchBlueprintContentsApi, blueprintName);
    yield put(setModalExportBlueprintContents(response.dependencies));
  } catch (error) {
    console.log('Error in loadModalBlueprintSaga');
  }
}

function* fetchModalCreateCompositionTypes() {
  try {
    const response = yield call(fetchModalCreateCompositionTypesApi);
    yield put(fetchingModalCreateCompositionTypesSuccess(response));
  } catch (error) {
    console.log('Error in loadModalBlueprintSaga');
  }
}

export default function* () {
  yield takeEvery(FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS, fetchModalBlueprintContents);
  yield* fetchModalCreateCompositionTypes();
}
