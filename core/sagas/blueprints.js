import { call, put, takeEvery, select } from "redux-saga/effects";
import BlueprintApi from "../../data/BlueprintApi";
import * as composer from "../composer";
import {
  FETCHING_BLUEPRINTS,
  fetchingBlueprintsSucceeded,
  fetchingBlueprintNamesSucceeded,
  FETCHING_BLUEPRINT_CONTENTS,
  fetchingBlueprintContentsSucceeded,
  CREATING_BLUEPRINT,
  creatingBlueprintSucceeded,
  SET_BLUEPRINT_USERS,
  setBlueprintUsersSucceeded,
  SET_BLUEPRINT_DEVICE,
  SET_BLUEPRINT_HOSTNAME,
  setBlueprintHostnameSucceeded,
  SET_BLUEPRINT_DESCRIPTION,
  setBlueprintDescriptionSucceeded,
  DELETING_BLUEPRINT,
  deletingBlueprintSucceeded,
  blueprintsFailure,
  blueprintContentsFailure,
  FETCHING_COMP_DEPS,
  setCompDeps,
} from "../actions/blueprints";
import { makeGetBlueprintById, makeGetSelectedDeps } from "../selectors";

function* fetchBlueprintsFromName(blueprintName) {
  const response = yield call(composer.getBlueprintInfo, blueprintName);
  yield put(fetchingBlueprintsSucceeded(response));
}

// need to test what happens when there are no blueprints
function* fetchBlueprints() {
  try {
    const blueprintNames = yield call(composer.listBlueprints);
    yield put(fetchingBlueprintNamesSucceeded(blueprintNames));
    yield* blueprintNames.map((blueprintName) => fetchBlueprintsFromName(blueprintName));
  } catch (error) {
    console.log("errorloadBlueprintsSaga", error);
    yield put(blueprintsFailure(error));
  }
}

function* fetchBlueprintContents(action) {
  try {
    const { blueprintId } = action.payload;
    const response = yield call(composer.depsolveBlueprint, blueprintId);
    const blueprintData = response.blueprints[0];
    let components = [];
    if (blueprintData.blueprint.packages.length > 0 || blueprintData.blueprint.modules.length > 0) {
      components = yield call(generateComponents, blueprintData);
    }
    const blueprint = {
      ...blueprintData.blueprint,
      components,
      id: blueprintId,
      localPendingChanges: [],
      workspacePendingChanges,
      errorState: response.errors[0],
    };
    yield put(fetchingBlueprintContentsSucceeded(blueprint));
  } catch (error) {
    console.log("Error in fetchBlueprintContentsSaga", error);
    yield put(blueprintContentsFailure(error, action.payload.blueprintId));
  }
}

function* generateComponents(blueprintData) {
  // List of selected components
  const packageNames = blueprintData.blueprint.packages.map((component) => component.name);
  const moduleNames = blueprintData.blueprint.modules.map((component) => component.name);
  const selectedComponentNames = packageNames.concat(moduleNames);
  // List of all components
  let componentNames = [];
  let componentsRaw = [];
  if (blueprintData.dependencies.length > 0) {
    componentNames = blueprintData.dependencies.map((component) => component.name);
    componentsRaw = flattenComponents(blueprintData.dependencies);
  } else {
    componentNames = selectedComponentNames;
    componentsRaw = blueprintData.blueprint.packages.concat(blueprintData.blueprint.modules);
  }
  // Get component info
  const componentInfo = yield call(composer.getComponentInfo, componentNames);
  const components = componentsRaw.map((component) => {
    const info = componentInfo.find((item) => item.name === component.name);
    const componentData = {
      name: component.name,
      description: info.description,
      homepage: info.homepage,
      summary: info.summary,
      inBlueprint: true,
      userSelected: selectedComponentNames.includes(component.name),
      ui_type: "RPM",
      version: component.version,
      release: component.release ? component.release : "",
    };
    return componentData;
  });
  return components;
}

function flattenComponents(components) {
  const previousComponents = {};
  const flattened = components.filter((component) => {
    return previousComponents.hasOwnProperty(component.name) ? false : (previousComponents[component.name] = true);
  });
  return flattened;
}

function* getBlueprintHistory(blueprintName) {
  const getBlueprintByName = makeGetBlueprintByName();
  const blueprintHistory = yield select(getBlueprintByName, blueprintName);
  const oldestBlueprint = blueprintHistory.past[0] ? blueprintHistory.past[0] : blueprintHistory.present;
  return [oldestBlueprint, blueprintHistory.present];
}

function* setBlueprintUsers(action) {
  try {
    const { blueprintId, users } = action.payload;
    // commit the oldest blueprint with the updated users
    const blueprintHistory = yield call(getBlueprintHistory, blueprintId);
    const blueprintToPost = BlueprintApi.postedBlueprintData({
      ...blueprintHistory[0],
      customizations: { ...blueprintHistory[0].customizations, user: users },
    });
    yield call(composer.newBlueprint, blueprintToPost);
    // get updated blueprint info (i.e. version)
    const response = yield call(composer.getBlueprintInfo, blueprintId);
    yield put(setBlueprintUsersSucceeded(response));
  } catch (error) {
    console.log("Error in setBlueprintHostname", error);
    yield put(blueprintsFailure(error));
  }
}

// convert between our stores blueprint object and the format that the weldr api expects
function createWeldrBlueprint(blueprint) {
  const weldrBlueprint = {
    name: blueprint.name,
    description: blueprint.description,
    version: blueprint.version,
    modules: blueprint.modules,
    packages: blueprint.packages,
    groups: blueprint.groups !== undefined ? blueprint.groups : [],
    customizations: blueprint.customizations,
  };
  return weldrBlueprint;
}

function* setBlueprintDevice(action) {
  try {
    const { blueprint, device } = action.payload;
    const blueprintToPost = createWeldrBlueprint(blueprint);
    blueprintToPost.customizations = {
      ...blueprintToPost.customizations,
      installation_device: device,
    };
    yield call(composer.newBlueprint, blueprintToPost);
  } catch (error) {
    console.log("Error in setBlueprintDevice", error);
    yield put(blueprintsFailure(error));
  }
}

function* setBlueprintHostname(action) {
  try {
    const { blueprint, hostname } = action.payload;
    // commit the oldest blueprint with the updated hostname
    const blueprintHistory = yield call(getBlueprintHistory, blueprint.id);
    const blueprintToPost = BlueprintApi.postedBlueprintData({
      ...blueprintHistory[0],
      customizations: { ...blueprintHistory[0].customizations, hostname },
    });
    yield call(composer.newBlueprint, blueprintToPost);
    // get updated blueprint info (i.e. version)
    const response = yield call(composer.getBlueprintInfo, blueprint.name);
    yield put(setBlueprintHostnameSucceeded(response));
  } catch (error) {
    console.log("Error in setBlueprintHostname", error);
    yield put(blueprintsFailure(error));
  }
}

function* setBlueprintDescription(action) {
  try {
    const { blueprint, description } = action.payload;
    // commit the oldest blueprint with the updated hostname
    const blueprintHistory = yield call(getBlueprintHistory, blueprint.id);
    const blueprintToPost = BlueprintApi.postedBlueprintData({ ...blueprintHistory[0], description });
    yield call(composer.newBlueprint, blueprintToPost);
    // get updated blueprint info (i.e. version)
    const response = yield call(composer.getBlueprintInfo, blueprint.name);
    yield put(setBlueprintDescriptionSucceeded(response));
    // post present blueprint object to workspace
  } catch (error) {
    console.log("Error in setBlueprintDescription", error);
    yield put(blueprintsFailure(error));
  }
}

function* deleteBlueprint(action) {
  try {
    const { blueprintId } = action.payload;
    const response = yield call(composer.deleteBlueprint, blueprintId);
    yield put(deletingBlueprintSucceeded(response));
  } catch (error) {
    console.log("errorDeleteBlueprintsSaga", error);
    yield put(blueprintsFailure(error));
  }
}

function* createBlueprint(action) {
  try {
    const { blueprint } = action.payload;
    yield call(composer.newBlueprint, blueprint);
    yield put(creatingBlueprintSucceeded(blueprint));
  } catch (error) {
    console.log("errorCreateBlueprintSaga", error);
    yield put(blueprintsFailure(error));
  }
}

function* fetchCompDeps(action) {
  try {
    const { component, blueprintId } = action.payload;
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
    const getBlueprintById = makeGetBlueprintById();
    const blueprint = yield select(getBlueprintById, blueprintId);
    const { components } = blueprint.present;
    const getSelectedDeps = makeGetSelectedDeps();
    const selectedDeps = yield select(getSelectedDeps, updatedDeps, components);
    const updatedComp = {
      name: component.name,
      dependencies: selectedDeps,
    };
    yield put(setCompDeps(updatedComp, blueprintId));
  } catch (error) {
    console.log("Error in fetchInputDeps", error);
  }
}

export default function* () {
  yield takeEvery(CREATING_BLUEPRINT, createBlueprint);
  yield takeEvery(FETCHING_BLUEPRINT_CONTENTS, fetchBlueprintContents);
  yield takeEvery(SET_BLUEPRINT_USERS, setBlueprintUsers);
  yield takeEvery(SET_BLUEPRINT_DEVICE, setBlueprintDevice);
  yield takeEvery(SET_BLUEPRINT_HOSTNAME, setBlueprintHostname);
  yield takeEvery(SET_BLUEPRINT_DESCRIPTION, setBlueprintDescription);
  yield takeEvery(DELETING_BLUEPRINT, deleteBlueprint);
  yield takeEvery(FETCHING_BLUEPRINTS, fetchBlueprints);
  yield takeEvery(FETCHING_COMP_DEPS, fetchCompDeps);
}
