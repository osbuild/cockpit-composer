import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import * as composer from "../composer";
import {
  FETCHING_INPUTS,
  fetchingInputsSucceeded,
  fetchingFilterNoResults,
  FETCHING_INPUT_DETAILS,
  FETCHING_INPUT_DEPS,
  FETCHING_DEP_DETAILS,
  setSelectedInput,
  setSelectedInputDeps,
  setDepDetails,
} from "../actions/inputs";
import { makeGetBlueprintById, makeGetSelectedDeps } from "../selectors";

function flattenInputs(response) {
  // duplicate inputs exist when more than one build is available
  // flatten duplicate inputs to a single item
  const previousInputs = {};
  const flattened = response.filter((item) => {
    const build = {
      version: item.builds[0].source.version,
      release: item.builds[0].release,
    };
    if (previousInputs.hasOwnProperty(item.name)) {
      // update the previousInput object with this item"s version/release
      // to make the default version/release the latest
      previousInputs[item.name] = Object.assign(previousInputs[item.name], build);
      // and remove this item from the list
      return false;
    }
    delete item.builds;
    item = Object.assign(item, build);

    previousInputs[item.name] = item;
    return true;
  });
  return flattened;
}

function* fetchInputs(action) {
  try {
    const { filter, selectedInputPage, pageSize } = action.payload;
    const filterValue = `*${filter.value}*`.replace("**", "*");
    const response = yield call(composer.listModules, filterValue, selectedInputPage, pageSize);
    const { total } = response;
    const inputNames = response.modules.map((input) => input.name).join(",");
    const inputs = yield call(composer.getComponentInfo, inputNames);
    const updatedInputs = flattenInputs(inputs).map((input) => {
      const inputData = {
        ui_type: "RPM",
        ...input,
      };
      return inputData;
    });
    yield put(fetchingInputsSucceeded(filter, selectedInputPage, pageSize, updatedInputs, total));
  } catch (error) {
    const { filter, pageSize } = action.payload;
    if (filter.value !== "") {
      yield put(fetchingFilterNoResults(filter, pageSize));
    } else {
      console.log("Error in fetchInputsSaga", error);
    }
  }
}

function flattenInput(response) {
  // each response item is a different build (version, release, arch)
  // flatten the response to a single item with an array of builds
  // only keep the latest release per version
  // for each version, include wildcard options
  const previousBuilds = {};
  const flattened = { ...response[0], builds: [] };
  response.forEach((item) => {
    let previousBuild;
    const build = {
      version: item.builds[0].source.version,
      release: item.builds[0].release,
      arch: [item.builds[0].arch],
    };
    if (previousBuilds.hasOwnProperty(build.version)) {
      // if this item has the same version value as a
      // previousBuild replace the release value (this is assumed to be the latest)
      // then push arch to the array of arch's and filter this item out
      previousBuild = previousBuilds[build.version];
      previousBuild.arch = previousBuild.arch.concat(build.arch);
      previousBuild.release = build.release;
      return false;
    }
    // else push the build to the array of builds
    flattened.builds = [build].concat(flattened.builds);

    previousBuilds[build.version] = build;
    return true;
  });
  flattened.builds = addWildcardVersions(flattened.builds);
  return flattened;
}

function addWildcardVersions(builds) {
  const wildcardBuilds = {};
  builds.forEach((item) => {
    item.depsolveVersion = item.version;

    const parts = item.version.split(".");
    for (let i = 0; i < parts.length; i += 1) {
      const wildcard = parts.slice(0, i).concat("*").join(".");

      if (!(wildcard in wildcardBuilds)) {
        wildcardBuilds[wildcard] = { ...item, version: wildcard };
      }
    }
    wildcardBuilds[item.version] = { ...item };
  });

  return Object.values(wildcardBuilds);
}

// when ComponentDetailsView loads, get component details
function* fetchInputDetails(action) {
  try {
    const { component } = action.payload;
    const response = yield call(composer.getComponentInfo, component.name);
    const updatedResponse = flattenInput(response);
    const componentData = {
      ...component,
      builds: updatedResponse.builds,
      description: updatedResponse.description,
      homepage: updatedResponse.homepage,
      summary: updatedResponse.summary,
    };
    yield put(setSelectedInput(componentData));
  } catch (error) {
    console.log("Error in fetchInputDetails", error);
  }
}

// when ComponentDetailsView loads, get component dependencies
function* fetchInputDeps(action) {
  try {
    const { component } = action.payload;
    const response = yield call(composer.getComponentDependencies, component.name);
    let responseIndex;
    if (response[0].builds) {
      responseIndex = response.findIndex((item) => {
        return item.builds[0].release === component.release && item.builds[0].source.version === component.version;
      });
    } else {
      responseIndex = 0;
    }
    const deps = response[responseIndex].dependencies.filter((item) => item.name !== component.name);
    const updatedDeps = deps.map((dep) => {
      const depData = {
        ui_type: "RPM",
        ...dep,
      };
      delete depData.epoch;
      delete depData.arch;
      return depData;
    });
    yield put(setSelectedInputDeps(updatedDeps));
  } catch (error) {
    console.log("Error in fetchInputDeps", error);
  }
}

// when expanding a dependency list item in ComponentDetailsView
// get additional details to display in expanded section
function* fetchDepDetails(action) {
  try {
    const { component, blueprintId } = action.payload;
    const response = yield call(composer.getComponentDependencies, component.name);
    const deps = response[0].dependencies.filter((item) => item.name !== component.name);
    const updatedDeps = deps.map((dep) => {
      const depData = { ui_type: "RPM", ...dep };
      delete depData.epoch;
      delete depData.arch;
      return depData;
    });
    const getBlueprintById = makeGetBlueprintById();
    const blueprint = yield select(getBlueprintById, blueprintId);
    const { components } = blueprint.present;

    const getSelectedDeps = makeGetSelectedDeps();
    const selectedDeps = yield select(getSelectedDeps, updatedDeps, components);

    const depDetails = {
      ...component,
      description: response[0].description,
      homepage: response[0].homepage,
      summary: response[0].summary,
      dependencies: selectedDeps,
    };
    yield put(setDepDetails(depDetails));
  } catch (error) {
    console.log("Error in fetchDepDetails", error);
  }
}

export default function* () {
  yield takeEvery(FETCHING_INPUTS, fetchInputs);
  yield takeLatest(FETCHING_INPUT_DETAILS, fetchInputDetails);
  yield takeLatest(FETCHING_INPUT_DEPS, fetchInputDeps);
  yield takeEvery(FETCHING_DEP_DETAILS, fetchDepDetails);
}
