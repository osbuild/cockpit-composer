import {
  SET_MODAL_ACTIVE,
  SET_MODAL_EXPORT_RECIPE_NAME, SET_MODAL_EXPORT_RECIPE_CONTENTS, SET_MODAL_EXPORT_RECIPE_VISIBLE,
  SET_MODAL_CREATE_RECIPE_ERROR_NAME_VISIBLE, SET_MODAL_CREATE_RECIPE_ERROR_DUPLICATE_VISIBLE,
  SET_MODAL_CREATE_RECIPE_ERROR_INLINE, SET_MODAL_CREATE_RECIPE_CHECK_ERRORS, SET_MODAL_CREATE_RECIPE_RECIPE,
  FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS,
  // APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES,
} from '../actions/modals';

// import {
//   UNDO, REDO
// } from '../actions/blueprints';

const modalCreateBlueprint = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_CREATE_RECIPE_ERROR_NAME_VISIBLE:
      return Object.assign(
          {}, state,
          { createBlueprint: Object.assign({}, state.createBlueprint, { errorNameVisible: action.payload.errorNameVisible }) }
      );
    case SET_MODAL_CREATE_RECIPE_ERROR_DUPLICATE_VISIBLE:
      return Object.assign(
          {}, state,
          { createBlueprint: Object.assign({}, state.createBlueprint, { errorDuplicateVisible: action.payload.errorDuplicateVisible }) }
      );
    case SET_MODAL_CREATE_RECIPE_ERROR_INLINE:
      return Object.assign(
          {}, state,
          { createBlueprint: Object.assign({}, state.createBlueprint, { errorInline: action.payload.errorInline }) }
      );
    case SET_MODAL_CREATE_RECIPE_CHECK_ERRORS:
      return Object.assign(
          {}, state,
          { checkErrors: Object.assign({}, state.createBlueprint, { errorInline: action.payload.checkErrors }) }
      );
    case SET_MODAL_CREATE_RECIPE_RECIPE:
      return Object.assign(
          {}, state,
          { createBlueprint: Object.assign({}, state.createBlueprint, { blueprint: action.payload.blueprint }) }
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

const modalExportBlueprint = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_EXPORT_RECIPE_NAME:
      return Object.assign(
          {}, state,
          { exportBlueprint: Object.assign({}, state.exportBlueprint, { name: action.payload.blueprintName }) }
      );
    case SET_MODAL_EXPORT_RECIPE_CONTENTS:
      return Object.assign(
          {}, state,
          { exportBlueprint: Object.assign({}, state.exportBlueprint, { contents: action.payload.blueprintContents }) }
      );
    case SET_MODAL_EXPORT_RECIPE_VISIBLE:
      return Object.assign(
          {}, state,
          { exportBlueprint: Object.assign({}, state.exportBlueprint, { visible: action.payload.visible }) }
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
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_RECIPE_ERROR_DUPLICATE_VISIBLE:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_RECIPE_ERROR_INLINE:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_RECIPE_CHECK_ERRORS:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_RECIPE_RECIPE:
      return modalCreateBlueprint(state, action);
    case FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS:
      return modalCreateComposition(state, action);
    case SET_MODAL_EXPORT_RECIPE_NAME:
      return modalExportBlueprint(state, action);
    case SET_MODAL_EXPORT_RECIPE_CONTENTS:
      return modalExportBlueprint(state, action);
    case SET_MODAL_EXPORT_RECIPE_VISIBLE:
      return modalExportBlueprint(state, action);
    default:
      return state;
  }
};

export default modals;
