import {
  CREATING_RECIPE_SUCCEEDED,
  FETCHING_RECIPE_SUCCEEDED,
  FETCHING_RECIPES_SUCCEEDED,
  FETCHING_RECIPE_CONTENTS_SUCCEEDED,
  SET_RECIPE, SET_RECIPE_DESCRIPTION, SET_RECIPE_COMPONENTS, SET_RECIPE_DEPENDENCIES,
  ADD_RECIPE_COMPONENT, REMOVE_RECIPE_COMPONENT,
  DELETING_RECIPE_SUCCEEDED,
} from '../actions/recipes';

const recipes = (state = [], action) => {
  switch (action.type) {
    case ADD_RECIPE_COMPONENT:
      return [
        ...state.map(recipe => {
          if (recipe.id === action.payload.recipe.id) {
            return Object.assign({}, recipe, recipe.components.append(action.payload.component) );
          }
          return recipe;
        }),
      ];
    case REMOVE_RECIPE_COMPONENT:
      return [
        ...state.map(recipe => {
          if (recipe.id === action.payload.recipe.id) {
            return Object.assign(
                {},
                recipe,
                { components: recipe.components.filter(component => component.name !== action.payload.component.name) });
          }
          return recipe;
        }),
      ];
    case CREATING_RECIPE_SUCCEEDED:
      return [
        ...state.filter(recipe => recipe.id !== action.payload.recipe.id),
        action.payload.recipe,
      ];
    // The following reducers filter the recipe out of the state and add the new version if
    // the recipe contains component data or is not found in the state
    case FETCHING_RECIPES_SUCCEEDED:
      return action.payload.recipe.components !== undefined || !state.some(recipe => recipe.id === action.payload.recipe.id)
        ? [...state.filter(recipe => recipe.id !== action.payload.recipe.id), action.payload.recipe]
        : state;
    case FETCHING_RECIPE_SUCCEEDED:
      return [
        ...state.filter(recipe => recipe.id !== action.payload.recipe.id),
        action.payload.recipe,
      ];
    case FETCHING_RECIPE_CONTENTS_SUCCEEDED:
      return [
        ...state.filter(recipe => recipe.id !== action.payload.recipe.id),
        action.payload.recipe,
      ];
    case SET_RECIPE:
      return [
        ...state.map(recipe => {
          if (recipe.id === action.payload.recipe.id) {
            return action.payload.recipe;
          }
          return recipe;
        }),
      ];
    case SET_RECIPE_COMPONENTS:
      return [
        ...state.map(recipe => {
          if (recipe.id === action.payload.recipe.id) {
            return Object.assign({}, recipe, { components: action.payload.components });
          }
          return recipe;
        }),
      ];
    case SET_RECIPE_DEPENDENCIES:
      return [
        ...state.map(recipe => {
          if (recipe.id === action.payload.recipe.id) {
            return Object.assign({}, recipe, { dependencies: action.payload.dependencies });
          }
          return recipe;
        }),
      ];
    case SET_RECIPE_DESCRIPTION:
      return [
        ...state.map(recipe => {
          if (recipe.id === action.payload.recipe.id) {
            return Object.assign({}, recipe, { description: action.payload.description });
          }
          return recipe;
        }),
      ];

    case DELETING_RECIPE_SUCCEEDED:
      return state.filter(recipe => recipe.id !== action.payload.recipeId);
    default:
      return state;
  }
};

export default recipes;
