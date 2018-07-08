import { delay } from 'redux-saga'
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import {
  fetchBlueprintInfoApi, fetchBlueprintNamesApi, fetchBlueprintContentsApi, fetchWorkspaceBlueprintContentsApi,
  deleteBlueprintApi, setBlueprintDescriptionApi,
  createBlueprintApi,
  depsolveComponentsApi,
  commitToWorkspaceApi, fetchDiffWorkspaceApi,
  startComposeApi, fetchImageStatusApi,
} from '../apiCalls';
import {
  fetchingBlueprintsSucceeded, fetchingBlueprintNamesSucceeded,
  FETCHING_BLUEPRINT_CONTENTS, fetchingBlueprintContentsSucceeded,
  fetchingImageStatusSucceeded,
  CREATING_BLUEPRINT, creatingBlueprintSucceeded,
  ADD_BLUEPRINT_COMPONENT, ADD_BLUEPRINT_COMPONENT_SUCCEEDED, addBlueprintComponentSucceeded,
  REMOVE_BLUEPRINT_COMPONENT, REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED, removeBlueprintComponentSucceeded,
  SET_BLUEPRINT_DESCRIPTION,
  DELETING_BLUEPRINT, deletingBlueprintSucceeded,
  COMMIT_TO_WORKSPACE,
  START_COMPOSE,
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
    let blueprintPast = null;
    let blueprintPresent = null;

    const blueprintResponse = yield call(fetchBlueprintContentsApi, blueprintId);
    const workspaceChanges = yield call(fetchDiffWorkspaceApi, blueprintId);
    const addedChanges = workspaceChanges.diff.filter(componentUpdated => componentUpdated.old === null);
    const deletedChanges = workspaceChanges.diff.filter(componentUpdated => componentUpdated.new === null);
    const workspacePendingChanges = {
      'addedChanges': addedChanges,
      'deletedChanges': deletedChanges,
    };

    if ((addedChanges.length > 0 || deletedChanges.length > 0) ) {
      //fetchBlueprintInfo will return the most recent blueprint version even if its from the workspace
      const workspaceBlueprint = yield call(fetchBlueprintInfoApi, blueprintId);
      const workspaceDepsolved = yield call(fetchWorkspaceBlueprintContentsApi, workspaceBlueprint);
      blueprintPast = [Object.assign(
        {}, blueprintResponse, {
          localPendingChanges: [],
          workspacePendingChanges: {addedChanges: [], deletedChanges: []},
          images: []
        }
      )];
      blueprintPresent = Object.assign(
        {}, workspaceDepsolved, {
          localPendingChanges: [],
          workspacePendingChanges: workspacePendingChanges,
          images: []
        }
      );
    } else {
      blueprintPast = [];
      blueprintPresent = Object.assign(
        {}, blueprintResponse, {
          localPendingChanges: [],
          workspacePendingChanges: workspacePendingChanges,
          images: [],
        }
      );
    }
    yield put(fetchingBlueprintContentsSucceeded(blueprintPast, blueprintPresent, workspacePendingChanges));
  } catch (error) {
    console.log('Error in fetchBlueprintContentsSaga');
    yield put(blueprintContentsFailure(error, action.payload.blueprintId));
  }
}

function* setBlueprintDescription(action) {
  try {
    const { blueprint, description } = action.payload;
    yield call(setBlueprintDescriptionApi, blueprint, description);
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
    const components = yield call(depsolveComponentsApi, packages);

    yield put(addBlueprintComponentSucceeded(blueprint.id, components, packages, pendingChange));
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
    const components = yield call(depsolveComponentsApi, packages);

    yield put(removeBlueprintComponentSucceeded(blueprint.id, components, packages, pendingChange));
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

function* startCompose(action) {
  try {
    const {blueprintName, composeType} = action.payload;
    const response = yield call(startComposeApi, blueprintName, composeType);
    yield* fetchImageStatus(blueprintName, response.build_id);
  } catch (error) {
    console.log('startComposeError');
    yield put(blueprintsFailure(error));
  }
}

function* fetchImageStatus(blueprintName, imageId) {
  try {
    let statusResponse = yield call(fetchImageStatusApi, imageId);
    yield put(fetchingImageStatusSucceeded(blueprintName, statusResponse.uuids[0]));
    while (statusResponse.uuids[0].queue_status === "WAITING" || statusResponse.uuids[0].queue_status === "RUNNING") {
      yield call(delay, 60000);
      statusResponse = yield call(fetchImageStatusApi, imageId);
      yield put(fetchingImageStatusSucceeded(blueprintName, statusResponse.uuids[0]));
    }
  } catch (error) {
    console.log('fetchImagesError');
    yield put(blueprintsFailure(error));
  }
}

export default function* () {
  yield takeEvery(CREATING_BLUEPRINT, createBlueprint);
  yield takeLatest(FETCHING_BLUEPRINT_CONTENTS, fetchBlueprintContents);
  yield takeLatest(SET_BLUEPRINT_DESCRIPTION, setBlueprintDescription);
  yield takeEvery(DELETING_BLUEPRINT, deleteBlueprint);
  yield takeLatest(ADD_BLUEPRINT_COMPONENT_SUCCEEDED, commitToWorkspace);
  yield takeLatest(REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED, commitToWorkspace);
  yield takeEvery(COMMIT_TO_WORKSPACE, commitToWorkspace);
  yield takeEvery(ADD_BLUEPRINT_COMPONENT, addComponent);
  yield takeEvery(REMOVE_BLUEPRINT_COMPONENT, removeComponent);
  yield takeEvery(START_COMPOSE, startCompose);
  yield* fetchBlueprints();
}
