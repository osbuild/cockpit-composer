import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchRecipeContentsApi } from '../apiCalls';

import {
   FETCHING_EXPORT_MODAL_RECIPE_CONTENTS, setExportModalRecipeContents,
} from '../actions/modals';

function* fetchModalRecipeContents(action) {
  try {
    const { recipeName } = action.payload;
    const response = yield call(fetchRecipeContentsApi, recipeName);
    yield put(setExportModalRecipeContents(response.dependencies));
  } catch (error) {
    console.log('Error in loadModalRecipeSaga');
  }
}

export default function* () {
  yield takeEvery(FETCHING_EXPORT_MODAL_RECIPE_CONTENTS, fetchModalRecipeContents);
}
