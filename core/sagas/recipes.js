import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import {
  fetchRecipeInfoApi, fetchRecipeNamesApi, fetchRecipeContentsApi, fetchWorkspaceRecipeContentsApi,
  deleteRecipeApi, setRecipeDescriptionApi,
  createRecipeApi, fetchDiffWorkspaceApi,
  saveToWorkspaceApi,
} from '../apiCalls';
import {
  fetchingRecipesSucceeded,
  FETCHING_RECIPE_CONTENTS, fetchingRecipeContentsSucceeded,
  SET_RECIPE_DESCRIPTION,
  CREATING_RECIPE, creatingRecipeSucceeded,
  DELETING_RECIPE, deletingRecipeSucceeded,
  SAVE_TO_WORKSPACE,
  recipesFailure,
} from '../actions/recipes';
import { makeGetRecipeById } from '../selectors';

function* fetchRecipesFromName(recipeName) {
  const response = yield call(fetchRecipeInfoApi, recipeName);
  yield put(fetchingRecipesSucceeded(response));
}

function* fetchRecipes() {
  try {
    const recipeNames = yield call(fetchRecipeNamesApi);
    yield* recipeNames.map(recipeName => fetchRecipesFromName(recipeName));
  } catch (error) {
    console.log('errorloadRecipesSaga');
    yield put(recipesFailure(error));
  }
}

function* fetchRecipeContents(action) {
  try {
    const { recipeId } = action.payload;
    let recipePast = null;
    let recipePresent = null;

    const recipeResponse = yield call(fetchRecipeContentsApi, recipeId);
    const workspaceChanges = yield call(fetchDiffWorkspaceApi, recipeId);
    const addedChanges = workspaceChanges.diff.filter(componentUpdated => componentUpdated.old === null);
    const deletedChanges = workspaceChanges.diff.filter(componentUpdated => componentUpdated.new === null);
    const workspacePendingChanges = {
      'addedChanges': addedChanges,
      'deletedChanges': deletedChanges,
    };

    if ((addedChanges.length > 0 || deletedChanges.length > 0) ) {
      //fetchRecipeInfo will return the most recent recipe version even if its from the workspace
      const workspaceRecipe = yield call(fetchRecipeInfoApi, recipeId);
      const workspaceDepsolved = yield call(fetchWorkspaceRecipeContentsApi, workspaceRecipe);
      recipePast = [Object.assign(
        {}, recipeResponse, { localPendingChanges: [], workspacePendingChanges: [] }
      )];
      recipePresent = Object.assign(
        {}, workspaceDepsolved, { localPendingChanges: [], workspacePendingChanges: workspacePendingChanges }
      );
    } else {
      recipePast = [];
      recipePresent = Object.assign(
        {}, recipeResponse, { localPendingChanges: [], workspacePendingChanges: workspacePendingChanges }
      );
    }
    yield put(fetchingRecipeContentsSucceeded(recipePast, recipePresent, workspacePendingChanges));
  } catch (error) {
    console.log('Error in fetchRecipeContentsSaga');
    yield put(recipesFailure(error));
  }
}

function* setRecipeDescription(action) {
  try {
    const { recipe, description } = action.payload;
    yield call(setRecipeDescriptionApi, recipe, description);
  } catch (error) {
    console.log('Error in setRecipeDescription');
    yield put(recipesFailure(error));
  }
}

function* deleteRecipe(action) {
  try {
    const { recipeId } = action.payload;
    const response = yield call(deleteRecipeApi, recipeId);
    yield put(deletingRecipeSucceeded(response));
  } catch (error) {
    console.log('errorDeleteRecipesSaga');
    yield put(recipesFailure(error));
  }
}

function* createRecipe(action) {
  try {
    const { events, recipe } = action.payload;
    yield call(createRecipeApi, events, recipe);
    yield put(creatingRecipeSucceeded(recipe));
  } catch (error) {
    console.log('errorCreateRecipeSaga');
    yield put(recipesFailure(error));
  }
}

function* saveToWorkspace(action) {
  try {
    const { recipeId } = action.payload;
    const getRecipeById = makeGetRecipeById();
    const recipe = yield select(getRecipeById, recipeId);
    yield call(saveToWorkspaceApi, recipe.present);
  } catch (error) {
    console.log('saveToWorkspaceError');
    yield put(recipesFailure(error));
  }
}

export default function* () {
  yield takeEvery(CREATING_RECIPE, createRecipe);
  yield takeLatest(FETCHING_RECIPE_CONTENTS, fetchRecipeContents);
  yield takeLatest(SET_RECIPE_DESCRIPTION, setRecipeDescription);
  yield takeEvery(DELETING_RECIPE, deleteRecipe);
  yield takeEvery(SAVE_TO_WORKSPACE, saveToWorkspace);
  yield* fetchRecipes();
}
