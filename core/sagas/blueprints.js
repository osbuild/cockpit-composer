import { call, put, takeEvery, select } from 'redux-saga/effects';
import {
  fetchBlueprintInfoApi, fetchBlueprintNamesApi, fetchBlueprintContentsApi,
  deleteBlueprintApi, setBlueprintDescriptionApi,
  createBlueprintApi,
  depsolveComponentsApi,
  commitToWorkspaceApi, fetchDiffWorkspaceApi,
  deleteWorkspaceApi,
} from '../apiCalls';
import {
  FETCHING_BLUEPRINTS, fetchingBlueprintsSucceeded, fetchingBlueprintNamesSucceeded,
  FETCHING_BLUEPRINT_CONTENTS, fetchingBlueprintContentsSucceeded,
  CREATING_BLUEPRINT, creatingBlueprintSucceeded,
  ADD_BLUEPRINT_COMPONENT, ADD_BLUEPRINT_COMPONENT_SUCCEEDED, addBlueprintComponentSucceeded,
  REMOVE_BLUEPRINT_COMPONENT, REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED, removeBlueprintComponentSucceeded,
  SET_BLUEPRINT_DESCRIPTION, setBlueprintDescriptionSucceeded,
  DELETING_BLUEPRINT, deletingBlueprintSucceeded,
  COMMIT_TO_WORKSPACE, DELETE_WORKSPACE,
  blueprintsFailure, blueprintContentsFailure,
} from '../actions/blueprints';
import { makeGetBlueprintById } from '../selectors';

function* fetchBlueprintsFromName(blueprintName) {
  const response = yield call(fetchBlueprintInfoApi, blueprintName);
  yield put(fetchingBlueprintsSucceeded(response));
}

function* fetchBlueprints() {
  try {
    const blueprintNames = yield call(fetchBlueprintNamesApi);
    yield put(fetchingBlueprintNamesSucceeded());
    yield* blueprintNames.map(blueprintName => fetchBlueprintsFromName(blueprintName));
  } catch (error) {
    console.log('errorloadBlueprintsSaga');
    yield put(blueprintsFailure(error));
  }
}

function* fetchBlueprintContents(action) {
  try {
    const { blueprintId } = action.payload;
    let blueprintPast = [];
    let blueprintPresent = null;
    const blueprint = yield call(fetchBlueprintInfoApi, blueprintId);   
    const blueprintResponse = yield call(fetchBlueprintContentsApi, blueprint.name);
    let workspacePendingChanges = {
      'addedChanges': [],
      'deletedChanges': [],
    };
    if (blueprint.changed === true) {
      const workspaceChanges = yield call(fetchDiffWorkspaceApi, blueprintId);
      const addedChanges = workspaceChanges.diff.filter(componentUpdated => componentUpdated.old === null);
      const deletedChanges = workspaceChanges.diff.filter(componentUpdated => componentUpdated.new === null);
      workspacePendingChanges = {
        'addedChanges': addedChanges,
        'deletedChanges': deletedChanges,
      };
      blueprintPast = [Object.assign(
        {}, blueprintResponse, {
          localPendingChanges: [],
          workspacePendingChanges: {addedChanges: [], deletedChanges: []},
        }
      )];
    }
    blueprintPresent = Object.assign(
      {}, blueprintResponse, {
        localPendingChanges: [],
        workspacePendingChanges: workspacePendingChanges,
      }
    );
    yield put(fetchingBlueprintContentsSucceeded(blueprintPast, blueprintPresent, workspacePendingChanges));
  } catch (error) {
    console.log('Error in fetchBlueprintContentsSaga');
    yield put(blueprintContentsFailure(error, action.payload.blueprintId));
  }
}

function* setBlueprintDescription(action) {
  try {
    const { blueprint, description } = action.payload;
    // get blueprint history
    const getBlueprintById = makeGetBlueprintById();
    const blueprintHistory = yield select(getBlueprintById, blueprint.id);
    const blueprintToPost = blueprintHistory.past[0] ? blueprintHistory.past[0] : blueprintHistory.present;
    // post the oldest blueprint with the updated description
    yield call(setBlueprintDescriptionApi, blueprintToPost, description);
    // get updated blueprint info
    const response = yield call(fetchBlueprintInfoApi, blueprint.name);
    yield put(setBlueprintDescriptionSucceeded(response));
    // post present blueprint object to workspace
    const workspace = Object.assign({}, blueprintHistory.present, {
      description: description, 
      version: response.version,
    });
    yield call(commitToWorkspaceApi, workspace);

  } catch (error) {
    console.log('Error in setBlueprintDescription');
    yield put(blueprintsFailure(error));
  }
}

function* deleteBlueprint(action) {
  try {
    const { blueprintId } = action.payload;
    const response = yield call(deleteBlueprintApi, blueprintId);
    yield put(deletingBlueprintSucceeded(response));
  } catch (error) {
    console.log('errorDeleteBlueprintsSaga');
    yield put(blueprintsFailure(error));
  }
}

function* createBlueprint(action) {
  try {
    const { events, blueprint } = action.payload;
    yield call(createBlueprintApi, events, blueprint);
    yield put(creatingBlueprintSucceeded(blueprint));
  } catch (error) {
    console.log('errorCreateBlueprintSaga');
    yield put(blueprintsFailure(error));
  }
}

function* addComponent(action) {
  try {
    const { blueprint, component } = action.payload;

    const addedPackage = Object.assign({}, {}, {
      name: component.name,
      version: component.version
    });
    const pendingChange = {
      componentOld: null,
      componentNew: component.name + '-' + component.version + '-' + component.release
    };

    const packages = blueprint.packages.concat(addedPackage);
    const modules = blueprint.modules;
    const components = yield call(depsolveComponentsApi, packages, modules);

    yield put(addBlueprintComponentSucceeded(blueprint.id, components, packages, modules, pendingChange));
  } catch (error) {
    console.log('errorAddComponentSaga');
    yield put(blueprintsFailure(error));
  }
}

function* removeComponent(action) {
  try {
    const { blueprint, component } = action.payload;

    const pendingChange = {
      componentOld: component.name + '-' + component.version + '-' + component.release,
      componentNew: null,
    };
    const packages = blueprint.packages.filter(pack => pack.name !== component.name);
    const modules = blueprint.modules.filter(module => module.name !== component.name);
    const components = yield call(depsolveComponentsApi, packages, modules);
    yield put(removeBlueprintComponentSucceeded(blueprint.id, components, packages, modules, pendingChange));
  } catch (error) {
    console.log('errorRemoveComponentSaga');
    yield put(blueprintsFailure(error));
  }
}

function* commitToWorkspace(action) {
  try {
    const { blueprintId } = action.payload;
    const getBlueprintById = makeGetBlueprintById();
    const blueprint = yield select(getBlueprintById, blueprintId);
    yield call(commitToWorkspaceApi, blueprint.present);
  } catch (error) {
    console.log('commitToWorkspaceError');
    yield put(blueprintsFailure(error));
  }
}

function* deleteWorkspace(action) {
  try {
    const { blueprintId } = action.payload;
    yield call(deleteWorkspaceApi, blueprintId);
    const blueprint = yield call(fetchBlueprintInfoApi, blueprintId);
    let blueprintPast = [];
    let blueprintPresent = null;
    let workspacePendingChanges = {
      'addedChanges': [],
      'deletedChanges': [],
    };
    const blueprintDepsolved = yield call(fetchBlueprintContentsApi, blueprint.name);
    blueprintPresent = Object.assign(
      {}, blueprintDepsolved, {
        localPendingChanges: [],
        workspacePendingChanges: workspacePendingChanges,
      }
    );
    yield put(fetchingBlueprintContentsSucceeded(blueprintPast, blueprintPresent, workspacePendingChanges));
  } catch (error) {
    console.log('deleteWorkspaceError');
    yield put(blueprintsFailure(error));
  }
}

export default function* () {
  yield takeEvery(CREATING_BLUEPRINT, createBlueprint);
  yield takeEvery(FETCHING_BLUEPRINT_CONTENTS, fetchBlueprintContents);
  yield takeEvery(SET_BLUEPRINT_DESCRIPTION, setBlueprintDescription);
  yield takeEvery(DELETING_BLUEPRINT, deleteBlueprint);
  yield takeEvery(ADD_BLUEPRINT_COMPONENT_SUCCEEDED, commitToWorkspace);
  yield takeEvery(REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED, commitToWorkspace);
  yield takeEvery(COMMIT_TO_WORKSPACE, commitToWorkspace);
  yield takeEvery(DELETE_WORKSPACE, deleteWorkspace);
  yield takeEvery(ADD_BLUEPRINT_COMPONENT, addComponent);
  yield takeEvery(REMOVE_BLUEPRINT_COMPONENT, removeComponent);
  yield takeEvery(FETCHING_BLUEPRINTS, fetchBlueprints);
}
