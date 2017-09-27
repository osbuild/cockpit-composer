import {
  UNDO, REDO,
  CREATING_RECIPE_SUCCEEDED,
  FETCHING_RECIPE_SUCCEEDED,
  FETCHING_RECIPES_SUCCEEDED,
  FETCHING_RECIPE_CONTENTS_SUCCEEDED,
  SET_RECIPE, SET_RECIPE_DESCRIPTION, SET_RECIPE_COMPONENTS, SET_RECIPE_DEPENDENCIES,
  ADD_RECIPE_COMPONENT, REMOVE_RECIPE_COMPONENT,
  DELETING_RECIPE_SUCCEEDED,
} from '../actions/recipes';

const recipesPresent = (state = [], action) => {
  switch (action.type) {
    case ADD_RECIPE_COMPONENT:
      return Object.assign(
        {}, state, {
        past: state.past.concat([state.present]),
        present: [
          ...state.present.map(recipe => {
            if (recipe.id === action.payload.recipe.id) {
              return Object.assign({}, recipe, recipe.components.append(action.payload.component) );
            }
            return recipe;
          }),
        ]
      });
    case REMOVE_RECIPE_COMPONENT:
      return Object.assign(
        {}, state, {
        past: state.past.concat([state.present]),
        present: [
          ...state.present.map(recipe => {
            if (recipe.id === action.payload.recipe.id) {
              return Object.assign(
                {},
                recipe,
                { components: recipe.components.filter(component => component.name !== action.payload.component.name) });
            }
            return recipe;
          }),
        ]
      });
    case CREATING_RECIPE_SUCCEEDED:
      return Object.assign(
        {}, state, {
        present: [
          ...state.present.filter(recipe => recipe.id !== action.payload.recipe.id),
          action.payload.recipe,
        ]
      });
    // The following reducers filter the recipe out of the state and add the new version if
    // the recipe contains component data or is not found in the state
    case FETCHING_RECIPES_SUCCEEDED:
      return Object.assign(
        {}, state, {
        present: action.payload.recipe.components !== undefined
          || !state.present.some(recipe => recipe.id === action.payload.recipe.id)
          ? state.present.filter(recipe => recipe.id !== action.payload.recipe.id).concat(action.payload.recipe)
          : state.present,
      });
    case FETCHING_RECIPE_SUCCEEDED:
      return Object.assign(
        {}, state, {
        present: [
          ...state.present.filter(recipe => recipe.id !== action.payload.recipe.id),
          action.payload.recipe,
        ]
      });
    case FETCHING_RECIPE_CONTENTS_SUCCEEDED:
      return Object.assign(
        {}, state, {
        present: [
          ...state.present.filter(recipe => recipe.id !== action.payload.recipe.id),
          action.payload.recipe,
        ]
      });
    case SET_RECIPE:
      return Object.assign(
        {}, state, {
        present: [
          ...state.present.map(recipe => {
            if (recipe.id === action.payload.recipe.id) {
              return action.payload.recipe;
            }
            return recipe;
          }),
        ]
      });
    case SET_RECIPE_COMPONENTS:
      return Object.assign(
        {}, state, {
        past: state.past.concat([state.present]),
        present: [
          ...state.present.map(recipe => {
            if (recipe.id === action.payload.recipe.id) {
              return Object.assign({}, recipe, { components: action.payload.components });
            }
            return recipe;
          }),
        ]
      });
    case SET_RECIPE_DEPENDENCIES:
      return Object.assign(
        {}, state, {
        present: [
          ...state.present.map(recipe => {
            if (recipe.id === action.payload.recipe.id) {
              return Object.assign({}, recipe, { dependencies: action.payload.dependencies });
            }
            return recipe;
          }),
        ]
      });
    case SET_RECIPE_DESCRIPTION:
      return Object.assign(
        {}, state, {
        present: [
          ...state.present.map(recipe => {
            if (recipe.id === action.payload.recipe.id) {
              return Object.assign({}, recipe, { description: action.payload.description });
            }
            return recipe;
          }),
        ]
      });

    case DELETING_RECIPE_SUCCEEDED:
      return Object.assign(
        {}, state, {
        present: [
          ...state.present.filter(recipe => recipe.id !== action.payload.recipeId),
        ],
      });
    default:
      return state;
  }
};

const recipes = (state = [], action) => {
  switch (action.type) {
    case UNDO:
      return Object.assign(
        {}, state, {
        future: state.future.concat([state.present]),
        present: state.past.pop(),
      });
    case REDO:
      return Object.assign(
        {}, state, {
        past: state.past.concat([state.present]),
        present: state.future.pop(),
      });
    case ADD_RECIPE_COMPONENT:
      return recipesPresent(state, action);
    case REMOVE_RECIPE_COMPONENT:
      return recipesPresent(state, action);
    case CREATING_RECIPE_SUCCEEDED:
      return recipesPresent(state, action);
    case FETCHING_RECIPES_SUCCEEDED:
      return recipesPresent(state, action);
    case FETCHING_RECIPE_SUCCEEDED:
      return recipesPresent(state, action);
    case FETCHING_RECIPE_CONTENTS_SUCCEEDED:
      return recipesPresent(state, action);
    case SET_RECIPE:
      return recipesPresent(state, action);
    case SET_RECIPE_COMPONENTS:
      return recipesPresent(state, action);
    case SET_RECIPE_DEPENDENCIES:
      return recipesPresent(state, action);
    case SET_RECIPE_DESCRIPTION:
      return recipesPresent(state, action);
    case DELETING_RECIPE_SUCCEEDED:
      return recipesPresent(state, action);
    default:
      return state;
  }
};

export default recipes;
