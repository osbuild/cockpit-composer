import { take, call, put, takeEvery, select } from 'redux-saga/effects';
import { fetchBlueprintInputsApi } from '../apiCalls';
import { FETCHING_INPUTS, fetchingInputsSucceeded } from '../actions/inputs';
import {
  FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED,
} from '../actions/blueprints';
import { makeGetSortedSelectedComponents, makeGetSortedDependencies } from '../selectors';

function updateInputComponentData(inputs, selectedComponents, dependencies) {
  if (selectedComponents !== undefined && selectedComponents.length > 0) {
    inputs[0].forEach(input => {
      selectedComponents.map(component => {
        if (component.name === input.name) {
          input.inBlueprint = true; // eslint-disable-line no-param-reassign
          input.user_selected = true; // eslint-disable-line no-param-reassign
          input.version_selected = component.version; // eslint-disable-line no-param-reassign
          input.release_selected = component.release; // eslint-disable-line no-param-reassign
        }
      });
      dependencies.map(dependency => {
        if (dependency.name === input.name) {
          input.inBlueprint = true; // eslint-disable-line no-param-reassign
          input.user_selected = false; // eslint-disable-line no-param-reassign
          input.version_selected = dependency.version; // eslint-disable-line no-param-reassign
          input.release_selected = dependency.release; // eslint-disable-line no-param-reassign
        }
      });
    });
  }
  return inputs;
}

function* fetchInputs(action) {
  try {
    const { filter, selectedInputPage, pageSize, componentData } = action.payload;

    let selectedComponents = componentData;
    let dependencies = [];
    if (selectedComponents === undefined) {
      const blueprintResponse = yield take(FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED);
      const { blueprintPresent } = blueprintResponse.payload;
      const getSortedSelectedComponents = makeGetSortedSelectedComponents();
      selectedComponents = yield select(getSortedSelectedComponents, blueprintPresent);
      const getSortedDependencies = makeGetSortedDependencies();
      dependencies = yield select(getSortedDependencies, blueprintPresent);
    }

    const response = yield call(fetchBlueprintInputsApi, `/*${filter.value}*`, selectedInputPage, pageSize);
    const updatedResponse = yield call(updateInputComponentData, response, selectedComponents, dependencies);
    yield put(fetchingInputsSucceeded(filter, selectedInputPage, pageSize, updatedResponse));
  } catch (error) {
    console.log('Error in fetchInputsSaga');
  }
}

export default function* () {
  yield takeEvery(FETCHING_INPUTS, fetchInputs);
}
