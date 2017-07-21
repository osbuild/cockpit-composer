import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchModalRecipeContentsApi } from '../apiCalls';

import {
   FETCHING_MODAL_RECIPE_CONTENTS, setModalRecipeContents,
} from '../actions/modals';

function* fetchModalRecipeContents(action) {
  try {
    const { modalRecipeName } = action.payload;
    const response = yield call(fetchModalRecipeContentsApi, modalRecipeName);
    yield put(setModalRecipeContents(response));
  } catch (error) {
    console.log('Error in loadModalRecipeSaga');
  }
}

export default function* () {
  yield takeEvery(FETCHING_MODAL_RECIPE_CONTENTS, fetchModalRecipeContents);
}
