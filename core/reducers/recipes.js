import {
  UNDO, REDO, DELETE_HISTORY,
  CREATING_RECIPE_SUCCEEDED,
  FETCHING_RECIPES_SUCCEEDED,
  FETCHING_RECIPE_CONTENTS_SUCCEEDED,
  SET_RECIPE, SET_RECIPE_DESCRIPTION, SET_RECIPE_COMPONENTS, SET_RECIPE_COMMENT,
  REMOVE_RECIPE_COMPONENT,
  DELETING_RECIPE_SUCCEEDED,
} from '../actions/recipes';

const recipes = (state = [], action) => {
  switch (action.type) {
    case REMOVE_RECIPE_COMPONENT:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: Object.assign(
                {}, recipe.present, {
                components: recipe.present.components.filter(component => component.name !== action.payload.component.name),
                packages: recipe.present.packages.filter(component => component.name !== action.payload.component.name),
                localPendingChanges: recipe.present.localPendingChanges.some((component) => {
                  return (component.componentNew === action.payload.pendingChange.componentOld && component.componentNew !== null)
                   || (component.componentOld === action.payload.pendingChange.componentNew && component.componentOld !== null)
                }) ? recipe.present.localPendingChanges.filter((component) => {
                  return component.componentNew != action.payload.pendingChange.componentOld
                  || component.componentOld != action.payload.pendingChange.componentNew
                }) : [action.payload.pendingChange].concat(recipe.present.localPendingChanges),
              }),
            });
          }
          return recipe;
        }),
      ];
    case CREATING_RECIPE_SUCCEEDED:
      return [
        ...state.filter(recipe => recipe.present.id !== action.payload.recipe.id), {
          past: [],
          present: Object.assign({}, action.payload.recipe, { localPendingChanges: [], workspacePendingChanges: [] }),
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
          present: Object.assign({}, action.payload.recipe, { localPendingChanges: [], workspacePendingChanges: [] }),
          future: [],
        }]
      : state;
    case FETCHING_RECIPE_CONTENTS_SUCCEEDED:
      return [
        ...state.filter(recipe => recipe.present.id !== action.payload.recipePresent.id), {
          past: action.payload.recipePast,
          present: action.payload.recipePresent,
          future: [],
        }
      ];
    case SET_RECIPE:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipe.id) {
            return Object.assign(
              {}, recipe, {
              past: [],
              present: Object.assign({}, action.payload.recipe, { localPendingChanges: [], workspacePendingChanges: [] }),
              future: [],
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
              present: Object.assign({}, recipe.present, {
                components: action.payload.components,
                dependencies: action.payload.dependencies,
                localPendingChanges: recipe.present.localPendingChanges.some((component) => {
                  return (component.componentNew === action.payload.pendingChange.componentOld && component.componentNew !== null)
                  || (component.componentOld === action.payload.pendingChange.componentNew && component.componentOld !== null)
                }) ? recipe.present.localPendingChanges.filter((component) => {
                  return component.componentNew != action.payload.pendingChange.componentOld
                  || component.componentOld != action.payload.pendingChange.componentNew
                }) : [action.payload.pendingChange].concat(recipe.present.localPendingChanges),
              }),
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
          if (recipe.present.id === action.payload.recipeId) {
            return Object.assign(
              {}, recipe, {
              future: recipe.future.concat([recipe.present]),
              present: recipe.past.pop(),
            });
          }
          return recipe;
        }),
      ];
    case REDO:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipeId) {
            return Object.assign(
              {}, recipe, {
              past: recipe.past.concat([recipe.present]),
              present: recipe.future.pop(),
            });
          }
          return recipe;
        }),
      ];
    case DELETE_HISTORY:
      return [
        ...state.map(recipe => {
          if (recipe.present.id === action.payload.recipeId) {
            return Object.assign(
              {}, recipe, {
              present: Object.assign({}, recipe.past.shift(), { localPendingChanges: [], workspacePendingChanges: [] }),
              past: [],
              future: [],
            });
          }
          return recipe;
        }),
      ];
    default:
      return state;
  }
};

export default recipes;
