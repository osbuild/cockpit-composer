import {
  UNDO, REDO,
  CREATING_RECIPE_SUCCEEDED,
  FETCHING_RECIPE_SUCCEEDED,
  FETCHING_RECIPES_SUCCEEDED,
  FETCHING_RECIPE_CONTENTS_SUCCEEDED,
  SET_RECIPE, SET_RECIPE_DESCRIPTION, SET_RECIPE_COMPONENTS, SET_RECIPE_DEPENDENCIES, SET_RECIPE_COMMENT,
  ADD_RECIPE_COMPONENT, REMOVE_RECIPE_COMPONENT,
  DELETING_RECIPE_SUCCEEDED,
} from '../actions/recipes';

const recipesPresent = (state = [], action) => {
  switch (action.type) {
    case ADD_RECIPE_COMPONENT:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: recipe.present.components.append(action.payload.component),
            });
          }
          return recipe;
        }),
      ];
    case REMOVE_RECIPE_COMPONENT:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: Object.assign(
                {}, recipe.present, {
                components: recipe.present.components.filter(component => component.name !== action.payload.component.name)
              })
            });
          }
          return recipe;
        }),
      ];
    case CREATING_RECIPE_SUCCEEDED:
      return [
        ...state.filter(recipe => recipe.present.id !== action.payload.recipe.id), {
          past: [],
          present: action.payload.recipe,
          future: [],
        }
      ];
    // The following reducers filter the recipe out of the state and add the new version if
    // the recipe contains component data or is not found in the state
    case FETCHING_RECIPES_SUCCEEDED:
      return action.payload.recipe.components !== undefined
      || !state.some(recipe => recipe.present.id === action.payload.recipe.id)
      ? [...state.filter(recipe => recipe.present.id !== action.payload.recipe.id), {
          past: [],
          present: action.payload.recipe,
          future: [],
        }]
      : state;
    case FETCHING_RECIPE_CONTENTS_SUCCEEDED:
      return [
        ...state.filter(recipe => recipe.present.id !== action.payload.recipe.id), {
          past: [],
          present: action.payload.recipe,
          future: [],
        }
      ];
    case SET_RECIPE:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: action.payload.recipe,
            });
          }
          return recipe;
        }),
      ];
    case SET_RECIPE_COMPONENTS:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: Object.assign({}, recipe.present, { components: action.payload.components }),
            });
          }
          return recipe;
        }),
      ];
    case SET_RECIPE_DEPENDENCIES:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: Object.assign({}, recipe.present, { dependencies: action.payload.dependencies }),
            });
          }
          return recipe;
        }),
      ];
    case SET_RECIPE_DESCRIPTION:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: Object.assign({}, recipe.present, { description: action.payload.description }),
            });
          }
          return recipe;
        }),
      ];
    case SET_RECIPE_COMMENT:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: Object.assign({}, recipe.present, { comment: action.payload.comment }),
            });
          }
          return recipe;
        }),
      ];
    case DELETING_RECIPE_SUCCEEDED:
      return state.filter(recipe => recipe.present.id !== action.payload.recipeId);
    case UNDO:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              present: recipe.past.pop(),
              future: recipe.future.concat([recipe.present]),
            });
          }
          return recipe;
        }),
      ];
    case REDO:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: recipe.future.pop(),
            });
          }
          return recipe;
        }),
      ];
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
    case SET_RECIPE_COMMENT:
      return recipesPresent(state, action);
    case DELETING_RECIPE_SUCCEEDED:
      return recipesPresent(state, action);
    default:
      return state;
  }
};

export default recipes;
