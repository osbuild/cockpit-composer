import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import { fetchBlueprintInputsApi, fetchComponentDetailsApi, fetchDepsApi } from "../apiCalls";
import {
  FETCHING_INPUTS,
  fetchingInputsSucceeded,
  FETCHING_INPUT_DETAILS,
  FETCHING_INPUT_DEPS,
  FETCHING_DEP_DETAILS,
  setSelectedInput,
  setSelectedInputDeps,
  setDepDetails
} from "../actions/inputs";
import { makeGetBlueprintById, makeGetSelectedDeps } from "../selectors";

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

function flattenInput(response) {
  // each response item is a different build (version, release, arch)
  // flatten the response to a single item with an array of builds
  // only keep the latest release per version
  // for each version, include wildcard options
  let previousBuilds = {};
  let flattened = Object.assign({}, response[0], { builds: [] });
  response.forEach(item => {
    let previousBuild;
    let build = {
      version: item.builds[0].source.version,
      release: item.builds[0].release,
      arch: [item.builds[0].arch]
    };
    if (previousBuilds.hasOwnProperty(build.version)) {
      // if this item has the same version value as a
      // previousBuild replace the release value (this is assumed to be the latest)
      // then push arch to the array of arch's and filter this item out
      previousBuild = previousBuilds[build.version];
      previousBuild.arch = previousBuild.arch.concat(build.arch);
      previousBuild.release = build.release;
      return false;
    } else {
      // else push the build to the array of builds
      flattened.builds = [build].concat(flattened.builds);
    }
    previousBuilds[build.version] = build;
    return true;
  });
  flattened.builds = addWildcardVersions(flattened.builds);
  return flattened;
}

function addWildcardVersions(builds) {
  // create a new array of builds that includes wildcard versions
  let wildcardBuilds = [];
  builds.forEach(item => {
    item.depsolveVersion = item.version;
    let newBuilds = [item];
    const wildcardVersion = createWildcardVersion(item.version);
    // add this version if it doesn't exist already in wildcardBuilds
    const versionIndex = wildcardBuilds.findIndex(build => build.version === wildcardVersion);
    if (versionIndex === -1) {
      const wildcardBuild = Object.assign({}, item, {
        version: wildcardVersion
      });
      newBuilds.unshift(wildcardBuild);
    }
    // if wildcardVersion has a period, repeat this step for each period
    const versionValues = wildcardVersion.split(".");
    versionValues.pop();
    for (let index = 0; index < versionValues.length; index++) {
      const newWildcardVersion = createWildcardVersion(newBuilds[0].version);
      const versionIndex = wildcardBuilds.findIndex(build => build.version === newWildcardVersion);
      if (versionIndex === -1) {
        const newWildcardBuild = Object.assign({}, item, {
          version: newWildcardVersion
        });
        newBuilds.unshift(newWildcardBuild);
      }
    }
    wildcardBuilds = wildcardBuilds.concat(newBuilds);
  });
  return wildcardBuilds;
}

function createWildcardVersion(version) {
  const versionValues = version.split(".");
  if (versionValues.pop() === "*") {
    versionValues.pop();
  } // removes the last 2 values if the last is "*", or just removes the last
  versionValues.push("*"); // replaces the removed value(s) with a wildcard
  let wildcardVersion = versionValues.join(".");
  return wildcardVersion;
}

// when ComponentDetailsView loads, get component details
function* fetchInputDetails(action) {
  try {
    const { component } = action.payload;
    const response = yield call(fetchComponentDetailsApi, component.name);
    const updatedResponse = flattenInput(response);
    const componentData = Object.assign({}, component, {
      builds: updatedResponse.builds,
      description: updatedResponse.description,
      homepage: updatedResponse.homepage,
      summary: updatedResponse.summary
    });
    yield put(setSelectedInput(componentData));
  } catch (error) {
    console.log("Error in fetchInputDetails");
  }
}

// when ComponentDetailsView loads, get component dependencies
function* fetchInputDeps(action) {
  try {
    const { component } = action.payload;
    const response = yield call(fetchDepsApi, component.name);
    let responseIndex;
    if (response[0].builds) {
      responseIndex = response.findIndex(item => {
        return item.builds[0].release === component.release && item.builds[0].source.version === component.version;
      });
    } else {
      responseIndex = 0;
    }
    const deps = response[responseIndex].dependencies.filter(item => item.name !== component.name);
    const updatedDeps = deps.map(dep => {
      const depData = Object.assign(
        {},
        {
          ui_type: "RPM"
        },
        dep
      );
      delete depData.epoch;
      delete depData.arch;
      return depData;
    });
    yield put(setSelectedInputDeps(updatedDeps));
  } catch (error) {
    console.log("Error in fetchInputDeps");
  }
}

// when expanding a dependency list item in ComponentDetailsView
// get additional details to display in expanded section
function* fetchDepDetails(action) {
  try {
    const { component, blueprintId } = action.payload;
    const response = yield call(fetchDepsApi, component.name);
    const deps = response[0].dependencies.filter(item => item.name !== component.name);
    const updatedDeps = deps.map(dep => {
      const depData = Object.assign({}, { ui_type: "RPM" }, dep);
      delete depData.epoch;
      delete depData.arch;
      return depData;
    });
    const getBlueprintById = makeGetBlueprintById();
    const blueprint = yield select(getBlueprintById, blueprintId);
    const components = blueprint.present.components;

    const getSelectedDeps = makeGetSelectedDeps();
    const selectedDeps = yield select(getSelectedDeps, updatedDeps, components);

    const depDetails = Object.assign({}, component, {
      description: response[0].description,
      homepage: response[0].homepage,
      summary: response[0].summary,
      dependencies: selectedDeps
    });
    yield put(setDepDetails(depDetails));
  } catch (error) {
    console.log("Error in fetchDepDetails");
  }
}

export default function*() {
  yield takeEvery(FETCHING_INPUTS, fetchInputs);
  yield takeLatest(FETCHING_INPUT_DETAILS, fetchInputDetails);
  yield takeLatest(FETCHING_INPUT_DEPS, fetchInputDeps);
  yield takeEvery(FETCHING_DEP_DETAILS, fetchDepDetails);
}
