import {
  SET_MODAL_ACTIVE,
  SET_MODAL_EXPORT_RECIPE_NAME, SET_MODAL_EXPORT_RECIPE_CONTENTS, SET_MODAL_EXPORT_RECIPE_VISIBLE,
  SET_MODAL_CREATE_RECIPE_ERROR_NAME_VISIBLE, SET_MODAL_CREATE_RECIPE_ERROR_DUPLICATE_VISIBLE,
  SET_MODAL_CREATE_RECIPE_ERROR_INLINE, SET_MODAL_CREATE_RECIPE_CHECK_ERRORS, SET_MODAL_CREATE_RECIPE_RECIPE,
  FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS,
  APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES,
} from '../actions/modals';

import {
  UNDO, REDO
} from '../actions/recipes';

const modalCreateRecipe = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_CREATE_RECIPE_ERROR_NAME_VISIBLE:
      return Object.assign(
          {}, state,
          { createRecipe: Object.assign({}, state.createRecipe, { errorNameVisible: action.payload.errorNameVisible }) }
      );
    case SET_MODAL_CREATE_RECIPE_ERROR_DUPLICATE_VISIBLE:
      return Object.assign(
          {}, state,
          { createRecipe: Object.assign({}, state.createRecipe, { errorDuplicateVisible: action.payload.errorDuplicateVisible }) }
      );
    case SET_MODAL_CREATE_RECIPE_ERROR_INLINE:
      return Object.assign(
          {}, state,
          { createRecipe: Object.assign({}, state.createRecipe, { errorInline: action.payload.errorInline }) }
      );
    case SET_MODAL_CREATE_RECIPE_CHECK_ERRORS:
      return Object.assign(
          {}, state,
          { checkErrors: Object.assign({}, state.createRecipe, { errorInline: action.payload.checkErrors }) }
      );
    case SET_MODAL_CREATE_RECIPE_RECIPE:
      return Object.assign(
          {}, state,
          { createRecipe: Object.assign({}, state.createRecipe, { recipe: action.payload.recipe }) }
      );
    default:
      return state;
  }
};

const modalCreateComposition = (state = [], action) => {
  switch (action.type) {
    case FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS:
      return Object.assign(
          {}, state,
          { createComposition: Object.assign({}, state.createComposition, { compositionTypes: action.payload.compositionTypes }) }
      );
    default:
      return state;
  }
};

const modalExportRecipe = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_EXPORT_RECIPE_NAME:
      return Object.assign(
          {}, state,
          { exportRecipe: Object.assign({}, state.exportRecipe, { name: action.payload.recipeName }) }
      );
    case SET_MODAL_EXPORT_RECIPE_CONTENTS:
      return Object.assign(
          {}, state,
          { exportRecipe: Object.assign({}, state.exportRecipe, { contents: action.payload.recipeContents }) }
      );
    case SET_MODAL_EXPORT_RECIPE_VISIBLE:
      return Object.assign(
          {}, state,
          { exportRecipe: Object.assign({}, state.exportRecipe, { visible: action.payload.visible }) }
      );
    default:
      return state;
  }
};

const modalPendingChanges = (state = [], action) => {
  switch (action.type) {
    case UNDO:
      return Object.assign(
        {}, state, {
          pendingChanges: Object.assign({}, state.pendingChanges, {
            componentUpdates: Object.assign({}, state.pendingChanges.componentUpdates, {
              future: state.pendingChanges.componentUpdates.future.concat([state.pendingChanges.componentUpdates.present]),
              present: state.pendingChanges.componentUpdates.past.pop(),
            })
          })
        }
      );
    case REDO:
      return Object.assign(
        {}, state, {
          pendingChanges: Object.assign({}, state.pendingChanges, {
            componentUpdates: Object.assign({}, state.pendingChanges.componentUpdates, {
              past: state.pendingChanges.componentUpdates.past.concat([state.pendingChanges.componentUpdates.present]),
              present: state.pendingChanges.componentUpdates.future.pop(),
            })
          })
        }
      );
    case APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES:
      // This checks if there is already a pending update for that component.
      // If so it gets removed from the pending changes. Otherwise the new change is added.
      // We are also maintaining a history of pendingChanges
      return Object.assign(
        {}, state, {
          pendingChanges: Object.assign({}, state.pendingChanges, {
            componentUpdates: Object.assign({}, state.pendingChanges.componentUpdates, {
              past: state.pendingChanges.componentUpdates.past.concat([state.pendingChanges.componentUpdates.present]),
              present: state.pendingChanges.componentUpdates.present.some((component) => {
                return (component.componentNew === action.payload.componentUpdate.componentOld && component.componentNew !== null)
                 || (component.componentOld === action.payload.componentUpdate.componentNew && component.componentOld !== null)
              }) ? state.pendingChanges.componentUpdates.present.filter((component) => {
                return component.componentNew != action.payload.componentUpdate.componentOld
                || component.componentOld != action.payload.componentUpdate.componentNew
              }) : [action.payload.componentUpdate].concat(state.pendingChanges.componentUpdates.present),
            }),
          }),
        }
      );
    default:
      return state;
  }
};


const modals = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_ACTIVE:
      return Object.assign({}, state, { modalActive: action.payload.modalActive });
    case SET_MODAL_CREATE_RECIPE_ERROR_NAME_VISIBLE:
      return modalCreateRecipe(state, action);
    case SET_MODAL_CREATE_RECIPE_ERROR_DUPLICATE_VISIBLE:
      return modalCreateRecipe(state, action);
    case SET_MODAL_CREATE_RECIPE_ERROR_INLINE:
      return modalCreateRecipe(state, action);
    case SET_MODAL_CREATE_RECIPE_CHECK_ERRORS:
      return modalCreateRecipe(state, action);
    case SET_MODAL_CREATE_RECIPE_RECIPE:
      return modalCreateRecipe(state, action);
    case FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS:
      return modalCreateComposition(state, action);
    case SET_MODAL_EXPORT_RECIPE_NAME:
      return modalExportRecipe(state, action);
    case SET_MODAL_EXPORT_RECIPE_CONTENTS:
      return modalExportRecipe(state, action);
    case SET_MODAL_EXPORT_RECIPE_VISIBLE:
      return modalExportRecipe(state, action);
    case APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES:
      return modalPendingChanges(state, action);
    case UNDO:
      return modalPendingChanges(state, action);
    case REDO:
      return modalPendingChanges(state, action);
    default:
      return state;
  }
};

export default modals;
