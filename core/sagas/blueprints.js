import { call, put, takeEvery, select } from "redux-saga/effects";
import BlueprintApi from "../../data/BlueprintApi";
import * as composer from "../composer";
import {
  FETCHING_BLUEPRINTS,
  fetchingBlueprintsSucceeded,
  fetchingBlueprintNamesSucceeded,
  FETCHING_BLUEPRINT_CONTENTS,
  fetchingBlueprintContentsSucceeded,
  reloadingBlueprintContentsSucceeded,
  CREATING_BLUEPRINT,
  creatingBlueprintSucceeded,
  UPDATE_BLUEPRINT_COMPONENTS,
  SET_BLUEPRINT_USERS,
  setBlueprintUsersSucceeded,
  SET_BLUEPRINT_HOSTNAME,
  setBlueprintHostnameSucceeded,
  SET_BLUEPRINT_DESCRIPTION,
  setBlueprintDescriptionSucceeded,
  DELETING_BLUEPRINT,
  deletingBlueprintSucceeded,
  DELETE_HISTORY,
  UNDO,
  REDO,
  blueprintsFailure,
  blueprintContentsFailure,
  FETCHING_COMP_DEPS,
  setCompDeps
} from "../actions/blueprints";
import { FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS, setModalExportBlueprintContents } from "../actions/modals";
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
    yield* blueprintNames.map(blueprintName => fetchBlueprintsFromName(blueprintName));
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
    if (response.errors.length > 0) {
      yield put(blueprintContentsFailure(response.errors[0], blueprintId));
    }
    let components = [];
    if (blueprintData.dependencies.length > 0) {
      components = yield call(generateComponents, blueprintData);
    }
    const workspaceChanges = yield call(composer.diffBlueprintToWorkspace, blueprintId);
    let pastComponents;
    let workspacePendingChanges = [];
    if (workspaceChanges.diff.length > 0) {
      workspacePendingChanges = workspaceChanges.diff.map(change => {
        return {
          componentOld: change.old === null ? null : change.old.Package ? change.old.Package : change.old.Module,
          componentNew: change.new === null ? null : change.new.Package ? change.new.Package : change.new.Module
        };
      });
      pastComponents = generatePastComponents(workspaceChanges, blueprintData.blueprint.packages);
    }
    const blueprint = Object.assign({}, blueprintData.blueprint, {
      components: components,
      id: blueprintId,
      localPendingChanges: [],
      workspacePendingChanges: workspacePendingChanges,
      errorState: response.errors[0]
    });
    const pastBlueprint = pastComponents
      ? [
          Object.assign({}, blueprint, pastComponents, {
            workspacePendingChanges: [],
            errorState: {}
          })
        ]
      : [];
    yield put(fetchingBlueprintContentsSucceeded(blueprint, pastBlueprint, response.errors[0]));
  } catch (error) {
    console.log("Error in fetchBlueprintContentsSaga", error);
    yield put(blueprintContentsFailure(error, action.payload.blueprintId));
  }
}

function generatePastComponents(workspaceChanges, packages) {
  const updatedPackages = workspaceChanges.diff
    .filter(change => change.old !== null)
    .map(change => (change.old.Package ? change.old.Package : change.old.Module));
  const originalPackages = packages.filter(originalPackage => {
    const addedPackage = workspaceChanges.diff.find(
      change => change.old === null && change.new.Package.name === originalPackage.name
    );
    if (addedPackage === undefined) {
      return true;
    }
  });
  const blueprintPackages = updatedPackages.concat(originalPackages);
  const blueprintComponents = blueprintPackages.map(component => {
    const componentData = Object.assign({}, component, {
      inBlueprint: true,
      userSelected: true
    });
    return componentData;
  });
  const blueprint = {
    components: blueprintComponents,
    packages: blueprintPackages
  };
  return blueprint;
}

function* generateComponents(blueprintData) {
  // List of all components
  const componentNames = blueprintData.dependencies.map(component => component.name);
  // List of selected components
  const packageNames = blueprintData.blueprint.packages.map(component => component.name);
  const moduleNames = blueprintData.blueprint.modules.map(component => component.name);
  const selectedComponentNames = packageNames.concat(moduleNames);
  const componentInfo = yield call(composer.getComponentInfo, componentNames);
  const components = flattenComponents(blueprintData.dependencies).map(component => {
    const info = componentInfo.find(item => item.name === component.name);
    const componentData = Object.assign(
      {},
      {
        name: component.name,
        description: info.description,
        homepage: info.homepage,
        summary: info.summary,
        inBlueprint: true,
        userSelected: selectedComponentNames.includes(component.name),
        ui_type: "RPM",
        version: component.version,
        release: component.release
      }
    );
    return componentData;
  });
  return components;
}

function flattenComponents(components) {
  let previousComponents = {};
  let flattened = components.filter(component => {
    return previousComponents.hasOwnProperty(component.name) ? false : (previousComponents[component.name] = true);
  });
  return flattened;
}

function* reloadBlueprintContents(blueprintId) {
  // after updating components or deleting the workspace changes,
  // get the latest depsolved blueprint components
  try {
    const response = yield call(composer.depsolveBlueprint, blueprintId);
    const blueprintData = response.blueprints[0];
    if (response.errors.length > 0) {
      yield put(blueprintContentsFailure(response.errors[0], blueprintId));
    }
    let components = [];
    if (blueprintData.dependencies.length > 0) {
      components = yield call(generateComponents, blueprintData);
    }
    const blueprint = Object.assign({}, blueprintData.blueprint, {
      components: components,
      id: blueprintId,
      errorState: response.errors[0]
    });
    yield put(reloadingBlueprintContentsSucceeded(blueprint, response.errors[0]));
  } catch (error) {
    console.log("Error in fetchBlueprintContentsSaga", error);
    yield put(blueprintContentsFailure(error, blueprintId));
  }
}

function* fetchModalBlueprintContents(action) {
  // fetches contents for Export modal on Blueprints page
  try {
    const { blueprintName } = action.payload;
    const response = yield call(composer.depsolveBlueprint, blueprintName);
    const blueprintData = response.blueprints[0];
    let components = [];
    if (blueprintData.dependencies.length > 0) {
      components = yield call(generateComponents, blueprintData);
    }
    yield put(setModalExportBlueprintContents(components));
  } catch (error) {
    console.log("Error in loadModalBlueprintSaga", error);
  }
}

function* getBlueprintHistory(blueprintId) {
  const getBlueprintById = makeGetBlueprintById();
  const blueprintHistory = yield select(getBlueprintById, blueprintId);
  const oldestBlueprint = blueprintHistory.past[0] ? blueprintHistory.past[0] : blueprintHistory.present;
  return [oldestBlueprint, blueprintHistory.present];
}

function* setBlueprintUsers(action) {
  try {
    const { blueprintId, users } = action.payload;
    // commit the oldest blueprint with the updated users
    const blueprintHistory = yield call(getBlueprintHistory, blueprintId);
    const blueprintToPost = BlueprintApi.postedBlueprintData(
      Object.assign({}, blueprintHistory[0], {
        customizations: Object.assign({}, blueprintHistory[0].customizations, { user: users })
      })
    );
    yield call(composer.newBlueprint, blueprintToPost);
    // get updated blueprint info (i.e. version)
    const response = yield call(composer.getBlueprintInfo, blueprintId);
    yield put(setBlueprintUsersSucceeded(response));
    // post present blueprint object to workspace
    if (response.changed === true) {
      const workspace = Object.assign({}, blueprintHistory[1], {
        version: response.version,
        customizations: Object.assign({}, blueprintHistory[1].customizations, {
          user: users
        })
      });
      yield call(composer.commitToWorkspace, workspace);
    }
  } catch (error) {
    console.log("Error in setBlueprintHostname", error);
    yield put(blueprintsFailure(error));
  }
}

function* setBlueprintHostname(action) {
  try {
    const { blueprint, hostname } = action.payload;
    // commit the oldest blueprint with the updated hostname
    const blueprintHistory = yield call(getBlueprintHistory, blueprint.id);
    const blueprintToPost = BlueprintApi.postedBlueprintData(
      Object.assign({}, blueprintHistory[0], {
        customizations: Object.assign({}, blueprintHistory[0].customizations, { hostname: hostname })
      })
    );
    yield call(composer.newBlueprint, blueprintToPost);
    // get updated blueprint info (i.e. version)
    const response = yield call(composer.getBlueprintInfo, blueprint.name);
    yield put(setBlueprintHostnameSucceeded(response));
    // post present blueprint object to workspace
    if (response.changed === true) {
      const workspace = Object.assign({}, blueprintHistory[1], {
        version: response.version,
        customizations: Object.assign({}, blueprintHistory[1].customizations, {
          hostname: hostname
        })
      });
      yield call(composer.commitToWorkspace, workspace);
    }
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
    const blueprintToPost = BlueprintApi.postedBlueprintData(
      Object.assign({}, blueprintHistory[0], {
        description: description
      })
    );
    yield call(composer.newBlueprint, blueprintToPost);
    // get updated blueprint info (i.e. version)
    const response = yield call(composer.getBlueprintInfo, blueprint.name);
    yield put(setBlueprintDescriptionSucceeded(response));
    // post present blueprint object to workspace
    if (response.changed === true) {
      const workspace = Object.assign({}, blueprintHistory[1], {
        version: response.version,
        description: description
      });
      yield call(composer.commitToWorkspace, workspace);
    }
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

function* commitToWorkspace(action) {
  try {
    const { blueprintId, reload } = action.payload;
    const getBlueprintById = makeGetBlueprintById();
    const blueprint = yield select(getBlueprintById, blueprintId);
    const blueprintData = {
      name: blueprint.present.name,
      description: blueprint.present.description,
      modules: blueprint.present.modules,
      packages: blueprint.present.packages,
      version: blueprint.present.version,
      groups: blueprint.present.groups
    };
    if (blueprint.present.customizations !== undefined) {
      blueprintData.customizations = blueprint.present.customizations;
    }
    yield call(composer.commitToWorkspace, blueprintData);
    if (reload !== false) {
      yield call(reloadBlueprintContents, blueprintId);
    }
  } catch (error) {
    console.log("commitToWorkspaceError", error);
    yield put(blueprintsFailure(error));
  }
}

function* deleteWorkspace(action) {
  try {
    const { blueprintId, reload } = action.payload;
    yield call(composer.deleteWorkspace, blueprintId);
    if (reload !== false) {
      yield call(reloadBlueprintContents, blueprintId);
    }
  } catch (error) {
    console.log("deleteWorkspaceError", error);
    yield put(blueprintsFailure("failed delete workspace"));
  }
}

function* fetchCompDeps(action) {
  try {
    const { component, blueprintId } = action.payload;
    const response = yield call(composer.getComponentDependencies, component.name);
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
    const getBlueprintById = makeGetBlueprintById();
    const blueprint = yield select(getBlueprintById, blueprintId);
    const components = blueprint.present.components;
    const getSelectedDeps = makeGetSelectedDeps();
    const selectedDeps = yield select(getSelectedDeps, updatedDeps, components);
    const updatedComp = Object.assign(
      {},
      {
        name: component.name,
        dependencies: selectedDeps
      }
    );
    yield put(setCompDeps(updatedComp, blueprintId));
  } catch (error) {
    console.log("Error in fetchInputDeps", error);
  }
}

export default function*() {
  yield takeEvery(CREATING_BLUEPRINT, createBlueprint);
  yield takeEvery(FETCHING_BLUEPRINT_CONTENTS, fetchBlueprintContents);
  yield takeEvery(FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS, fetchModalBlueprintContents);
  yield takeEvery(SET_BLUEPRINT_USERS, setBlueprintUsers);
  yield takeEvery(SET_BLUEPRINT_HOSTNAME, setBlueprintHostname);
  yield takeEvery(SET_BLUEPRINT_DESCRIPTION, setBlueprintDescription);
  yield takeEvery(DELETING_BLUEPRINT, deleteBlueprint);
  yield takeEvery(UPDATE_BLUEPRINT_COMPONENTS, commitToWorkspace);
  yield takeEvery(UNDO, commitToWorkspace);
  yield takeEvery(REDO, commitToWorkspace);
  yield takeEvery(DELETE_HISTORY, deleteWorkspace);
  yield takeEvery(FETCHING_BLUEPRINTS, fetchBlueprints);
  yield takeEvery(FETCHING_COMP_DEPS, fetchCompDeps);
}
