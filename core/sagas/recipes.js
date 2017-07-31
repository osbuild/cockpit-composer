import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  fetchRecipeInfoApi, fetchRecipeNamesApi, fetchRecipeContentsApi,
  deleteRecipeApi, setRecipeDescriptionApi, saveRecipeApi,
} from '../apiCalls';
import {
   FETCHING_RECIPES, fetchingRecipesSucceeded,
   FETCHING_RECIPE_CONTENTS, fetchingRecipeContentsSucceeded,
   SET_RECIPE_DESCRIPTION,
   DELETING_RECIPE, deletingRecipeSucceeded,
   SAVING_RECIPE, savingRecipeSucceeded,
   recipesFailure,
} from '../actions/recipes';


function* fetchRecipe(recipeName) {
  const response = yield call(fetchRecipeInfoApi, recipeName);
  yield put(fetchingRecipesSucceeded(response));
}

function* fetchRecipes() {
  try {
    const recipeNames = yield call(fetchRecipeNamesApi);
    yield* recipeNames.map(recipeName => fetchRecipe(recipeName));
  } catch (error) {
    console.log('errorloadRecipesSaga');
    yield put(recipesFailure(error));
  }
}

function* fetchRecipeContents(action) {
  try {
    const { recipeId } = action.payload;
    const response = yield call(fetchRecipeContentsApi, recipeId);
    yield put(fetchingRecipeContentsSucceeded(response));
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

function* saveRecipe(action) {
  try {
    const { recipe } = action.payload;
    yield call(saveRecipeApi, recipe);
    yield put(savingRecipeSucceeded(recipe));
  } catch (error) {
    console.log('errorSavingRecipesSaga');
    yield put(recipesFailure(error));
  }
}

export default function* () {
  yield takeLatest(FETCHING_RECIPES, fetchRecipes);
  yield takeEvery(FETCHING_RECIPE_CONTENTS, fetchRecipeContents);
  yield takeLatest(SET_RECIPE_DESCRIPTION, setRecipeDescription);
  yield takeEvery(DELETING_RECIPE, deleteRecipe);
  yield takeEvery(SAVING_RECIPE, saveRecipe);
}
