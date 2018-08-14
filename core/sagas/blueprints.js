import { call, put, takeEvery, select } from 'redux-saga/effects';
import {
  fetchBlueprintInfoApi, fetchBlueprintNamesApi, fetchBlueprintContentsApi, fetchWorkspaceBlueprintContentsApi, fetchSelectedComponentsInfoApi, fetchDependenciesInfoApi,
  deleteBlueprintApi, setBlueprintDescriptionApi,
  createBlueprintApi,
  depsolveComponentsApi,
  commitToWorkspaceApi, fetchDiffWorkspaceApi,
} from '../apiCalls';
import {
  FETCHING_BLUEPRINTS, fetchingBlueprintsSucceeded, fetchingBlueprintNamesSucceeded,
  FETCHING_BLUEPRINT_CONTENTS, fetchingBlueprintContentsSucceeded,
  CREATING_BLUEPRINT, creatingBlueprintSucceeded,
  ADD_BLUEPRINT_COMPONENT, ADD_BLUEPRINT_COMPONENT_SUCCEEDED, addBlueprintComponentSucceeded,
  REMOVE_BLUEPRINT_COMPONENT, REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED, removeBlueprintComponentSucceeded,
  SET_BLUEPRINT_DESCRIPTION,
  DELETING_BLUEPRINT, deletingBlueprintSucceeded,
  COMMIT_TO_WORKSPACE,
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
    const blueprintData = yield call(fetchBlueprintContentsApi, blueprintId);

    // List of all components
    const componentNames = blueprintData.dependencies.map(component => component.name);
    // List of selected components
    const selectedComponentNames = blueprintData.blueprint.packages.map(component => component.name);
    // List of dependencies (component list without selected components)
    const dependencyNames = componentNames.filter(component => !selectedComponentNames.includes(component));

    const selectedComponents = yield call(fetchSelectedComponentsInfoApi, selectedComponentNames);
    const dependencies = yield call(fetchDependenciesInfoApi, dependencyNames);
    const components = selectedComponents.concat(dependencies);

    const workspaceChanges = yield call(fetchDiffWorkspaceApi, blueprintId);
    const addedChanges = workspaceChanges.diff.filter(componentUpdated => componentUpdated.old === null);
    const deletedChanges = workspaceChanges.diff.filter(componentUpdated => componentUpdated.new === null);

    const blueprint = Object.assign({}, blueprintData.blueprint, {
      components: components,
      id: blueprintId,
      localPendingChanges: [],
      workspacePendingChanges: {
        'addedChanges': addedChanges,
        'deletedChanges': deletedChanges,
      },
    });

    yield put(fetchingBlueprintContentsSucceeded(blueprint));
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
    const { blueprint } = action.payload;
    yield call(createBlueprintApi, blueprint);
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

export default function* () {
  yield takeEvery(CREATING_BLUEPRINT, createBlueprint);
  yield takeEvery(FETCHING_BLUEPRINT_CONTENTS, fetchBlueprintContents);
  yield takeEvery(SET_BLUEPRINT_DESCRIPTION, setBlueprintDescription);
  yield takeEvery(DELETING_BLUEPRINT, deleteBlueprint);
  yield takeEvery(ADD_BLUEPRINT_COMPONENT_SUCCEEDED, commitToWorkspace);
  yield takeEvery(REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED, commitToWorkspace);
  yield takeEvery(COMMIT_TO_WORKSPACE, commitToWorkspace);
  yield takeEvery(ADD_BLUEPRINT_COMPONENT, addComponent);
  yield takeEvery(REMOVE_BLUEPRINT_COMPONENT, removeComponent);
  yield takeEvery(FETCHING_BLUEPRINTS, fetchBlueprints);
}
