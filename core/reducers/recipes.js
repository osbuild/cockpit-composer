import {
  FETCHING_RECIPES,
  FETCHING_RECIPES_SUCCEEDED,
  DELETING_RECIPE_SUCCEEDED,
} from '../actions/recipes';

const recipes = (state = [], action) => {
  switch (action.type) {
    case FETCHING_RECIPES:
      return [];
    case FETCHING_RECIPES_SUCCEEDED:
      return [
        ...state,
        action.payload.recipes,
      ];
    case DELETING_RECIPE_SUCCEEDED:
      return state.filter(recipe => recipe.id !== action.payload.recipe);
    default:
      return state;
  }
};

export default recipes;
