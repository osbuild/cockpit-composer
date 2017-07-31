import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchRecipeInputsApi } from '../apiCalls';
import { FETCHING_INPUTS, fetchingInputsSucceeded } from '../actions/inputs';

function* fetchInputs(action) {
  try {
    const { filter, selectedInputPage, pageSize } = action.payload;
    const response = yield call(fetchRecipeInputsApi, `/*${filter.value}*`, selectedInputPage, pageSize);
    yield put(fetchingInputsSucceeded(filter, selectedInputPage, pageSize, response));
  } catch (error) {
    console.log('Error in fetchInputsSaga');
  }
}

export default function* () {
  yield takeEvery(FETCHING_INPUTS, fetchInputs);
}
