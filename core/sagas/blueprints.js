import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import {
  fetchBlueprintInfoApi, fetchBlueprintNamesApi, fetchBlueprintContentsApi, fetchWorkspaceBlueprintContentsApi,
  deleteBlueprintApi, setBlueprintDescriptionApi,
  createBlueprintApi, fetchDiffWorkspaceApi,
  commitToWorkspaceApi,
} from '../apiCalls';
import {
  fetchingBlueprintsSucceeded,
  FETCHING_BLUEPRINT_CONTENTS, fetchingBlueprintContentsSucceeded,
  SET_BLUEPRINT_DESCRIPTION,
  CREATING_BLUEPRINT, creatingBlueprintSucceeded,
  DELETING_BLUEPRINT, deletingBlueprintSucceeded,
  COMMIT_TO_WORKSPACE,
  blueprintsFailure,
} from '../actions/blueprints';
import { makeGetBlueprintById } from '../selectors';

function* fetchBlueprintsFromName(blueprintName) {
  const response = yield call(fetchBlueprintInfoApi, blueprintName);
  yield put(fetchingBlueprintsSucceeded(response));
}

function* fetchBlueprints() {
  try {
    const blueprintNames = yield call(fetchBlueprintNamesApi);
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
        {}, blueprintResponse, { localPendingChanges: [], workspacePendingChanges: {addedChanges: [], deletedChanges: []} }
      )];
      blueprintPresent = Object.assign(
        {}, workspaceDepsolved, { localPendingChanges: [], workspacePendingChanges: workspacePendingChanges }
      );
    } else {
      blueprintPast = [];
      blueprintPresent = Object.assign(
        {}, blueprintResponse, { localPendingChanges: [], workspacePendingChanges: workspacePendingChanges }
      );
    }
    yield put(fetchingBlueprintContentsSucceeded(blueprintPast, blueprintPresent, workspacePendingChanges));
  } catch (error) {
    console.log('Error in fetchBlueprintContentsSaga');
    yield put(blueprintsFailure(error));
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

export default function* () {
  yield takeEvery(CREATING_BLUEPRINT, createBlueprint);
  yield takeLatest(FETCHING_BLUEPRINT_CONTENTS, fetchBlueprintContents);
  yield takeLatest(SET_BLUEPRINT_DESCRIPTION, setBlueprintDescription);
  yield takeEvery(DELETING_BLUEPRINT, deleteBlueprint);
  yield takeEvery(COMMIT_TO_WORKSPACE, commitToWorkspace);
  yield* fetchBlueprints();
}
