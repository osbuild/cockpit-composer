import { take, call, put, takeEvery } from 'redux-saga/effects';
import { fetchBlueprintInputsApi } from '../apiCalls';
import { FETCHING_INPUTS, fetchingInputsSucceeded } from '../actions/inputs';
import {
  FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED,
} from '../actions/blueprints';


function updateInputComponentData(inputs, componentData) {
  let updatedInputs = inputs;
  if (componentData !== undefined && componentData.length > 0) {
    const parsedInputs = componentData.map(component => {
      const index = inputs[0].map(input => input.name).indexOf(component.name);
      if (index >= 0) {
        inputs[0][index].inBlueprint = true; // eslint-disable-line no-param-reassign
        inputs[0][index].user_selected = true; // eslint-disable-line no-param-reassign
        inputs[0][index].version_selected = component.version; // eslint-disable-line no-param-reassign
        inputs[0][index].release_selected = component.release; // eslint-disable-line no-param-reassign
      }
      return inputs;
    });
    updatedInputs = parsedInputs[0];
  }
  return updatedInputs;
}

function* fetchInputs(action) {
  try {
    const { filter, selectedInputPage, pageSize, componentData } = action.payload;
    let components = componentData;
    if (componentData === undefined) {
      const blueprintResponse = yield take(FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED);
      const { blueprintPresent } = blueprintResponse.payload;
      components = blueprintPresent.components;
    }
    const response = yield call(fetchBlueprintInputsApi, `/*${filter.value}*`, selectedInputPage, pageSize);
    const updatedResponse = yield call(updateInputComponentData, response, components);
    yield put(fetchingInputsSucceeded(filter, selectedInputPage, pageSize, updatedResponse));
  } catch (error) {
    console.log('Error in fetchInputsSaga');
  }
}

export default function* () {
  yield takeEvery(FETCHING_INPUTS, fetchInputs);
}
