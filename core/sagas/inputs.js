import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import { fetchBlueprintInputsApi, fetchComponentDetailsApi, fetchDepsApi } from "../apiCalls";
import {
  FETCHING_INPUTS,
  fetchingInputsSucceeded,
  FETCHING_INPUT_DETAILS,
} from "../actions/inputs";

function flattenInputs(response) {
  // duplicate inputs exist when more than one build is available
  // flatten duplicate inputs to a single item
  let previousInputs = {};
  let flattened = response.filter(item => {
    let build = {
      version: item.builds[0].source.version,
      release: item.builds[0].release
    };
    if (previousInputs.hasOwnProperty(item.name)) {
      // update the previousInput object with this item"s version/release
      // to make the default version/release the latest
      previousInputs[item.name] = Object.assign(previousInputs[item.name], build);
      // and remove this item from the list
      return false;
    } else {
      delete item.builds;
      item = Object.assign(item, build);
    }
    previousInputs[item.name] = item;
    return true;
  });
  return flattened;
}

function* fetchInputs(action) {
  try {
    const { filter, selectedInputPage, pageSize } = action.payload;
    const filter_value = `/*${filter.value}*`.replace("**", "*");
    const response = yield call(fetchBlueprintInputsApi, filter_value, selectedInputPage, pageSize);
    const total = response[1];
    const inputNames = response[0].map(input => input.name).join(",");
    const inputs = yield call(fetchComponentDetailsApi, inputNames);
    const updatedInputs = flattenInputs(inputs).map(input => {
      const inputData = Object.assign(
        {},
        {
          ui_type: "RPM"
        },
        input
      );
      return inputData;
    });
    yield put(fetchingInputsSucceeded(filter, selectedInputPage, pageSize, updatedInputs, total));
  } catch (error) {
    console.log("Error in fetchInputsSaga");
  }
}

export default function*() {
  yield takeEvery(FETCHING_INPUTS, fetchInputs);
  yield takeLatest(FETCHING_INPUT_DETAILS, fetchInputDetails);
}
