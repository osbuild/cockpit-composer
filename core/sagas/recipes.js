import { call, put, takeEvery, takeLatest, all } from 'redux-saga/effects';
import { fetchRecipeInfoApi, fetchRecipeNamesApi, deleteRecipeApi } from '../apiCalls';

import {
   FETCHING_RECIPES, fetchingRecipesSucceeded,
   DELETING_RECIPE, deletingRecipeSucceeded,
   recipesFailure,
} from '../actions/recipes';

function* fetchRecipes() {
  try {
    const recipeNames = yield call(fetchRecipeNamesApi);
    const responses = yield all(recipeNames.map(recipeName => call(fetchRecipeInfoApi, recipeName)));
    yield all(responses.map(response => {
      if (response != null) {
        return put(fetchingRecipesSucceeded(response));
      }
      return null;
    }));
  } catch (error) {
    console.log('errorloadRecipesSaga');
    yield put(recipesFailure(error));
  }
}

function* deleteRecipe(action) {
  try {
    const { recipe } = action.payload;
    const response = yield call(deleteRecipeApi, recipe);
    yield put(deletingRecipeSucceeded(response));
  } catch (error) {
    console.log('errorDeleteRecipesSaga');
    yield put(recipesFailure(error));
  }
}


export default function* () {
  yield takeLatest(FETCHING_RECIPES, fetchRecipes);
  yield takeEvery(DELETING_RECIPE, deleteRecipe);
}
