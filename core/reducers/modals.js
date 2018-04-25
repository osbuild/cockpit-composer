import {
  SET_MODAL_ACTIVE,
  SET_MODAL_EXPORT_BLUEPRINT_NAME, SET_MODAL_EXPORT_BLUEPRINT_CONTENTS, SET_MODAL_EXPORT_BLUEPRINT_VISIBLE,
  SET_MODAL_DELETE_BLUEPRINT_NAME, SET_MODAL_DELETE_BLUEPRINT_ID, SET_MODAL_DELETE_BLUEPRINT_VISIBLE,
  SET_MODAL_CREATE_BLUEPRINT_ERROR_NAME_VISIBLE, SET_MODAL_CREATE_BLUEPRINT_ERROR_DUPLICATE_VISIBLE,
  SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE, SET_MODAL_CREATE_BLUEPRINT_CHECK_ERRORS, SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT,
  SET_MODAL_CREATE_IMAGE_BLUEPRINT_NAME, SET_MODAL_CREATE_IMAGE_VISIBLE,
  FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS,
  // APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES,
} from '../actions/modals';

// import {
//   UNDO, REDO
// } from '../actions/blueprints';

const modalCreateBlueprint = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_CREATE_BLUEPRINT_ERROR_NAME_VISIBLE:
      return Object.assign(
          {}, state, {
            createBlueprint: Object.assign(
              {}, state.createBlueprint, {
              errorNameVisible: action.payload.errorNameVisible
              })
          }
      );
    case SET_MODAL_CREATE_BLUEPRINT_ERROR_DUPLICATE_VISIBLE:
      return Object.assign(
          {}, state, {
            createBlueprint: Object.assign(
              {}, state.createBlueprint, {
                errorDuplicateVisible: action.payload.errorDuplicateVisible
              })
          }
      );
    case SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE:
      return Object.assign(
          {}, state,
          { createBlueprint: Object.assign({}, state.createBlueprint, { errorInline: action.payload.errorInline }) }
      );
    case SET_MODAL_CREATE_BLUEPRINT_CHECK_ERRORS:
      return Object.assign(
          {}, state,
          { checkErrors: Object.assign({}, state.createBlueprint, { errorInline: action.payload.checkErrors }) }
      );
    case SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT:
      return Object.assign(
          {}, state,
          { createBlueprint: Object.assign({}, state.createBlueprint, { blueprint: action.payload.blueprint }) }
      );
    default:
      return state;
  }
};

const modalCreateImage = (state = [], action) => {
  switch (action.type) {
    case FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS:
      return Object.assign(
          {}, state,
          { createImage: Object.assign({}, state.createImage, { imageTypes: action.payload.imageTypes }) }
      );
    case SET_MODAL_CREATE_IMAGE_BLUEPRINT_NAME:
      return Object.assign(
          {}, state,
          { createImage: Object.assign({}, state.createImage, { name: action.payload.blueprintName }) }
      );
    case SET_MODAL_CREATE_IMAGE_VISIBLE:
      return Object.assign(
          {}, state,
          { createImage: Object.assign({}, state.createImage, { visible: action.payload.visible }) }
      );
    default:
      return state;
  }
};

const modalDeleteBlueprint = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_DELETE_BLUEPRINT_NAME:
      return Object.assign(
          {}, state,
          { deleteBlueprint: Object.assign({}, state.deleteBlueprint, { name: action.payload.blueprintName }) }
      );
    case SET_MODAL_DELETE_BLUEPRINT_ID:
      return Object.assign(
          {}, state,
          { deleteBlueprint: Object.assign({}, state.deleteBlueprint, { id: action.payload.blueprintId }) }
      );
    case SET_MODAL_DELETE_BLUEPRINT_VISIBLE:
      return Object.assign(
          {}, state,
          { deleteBlueprint: Object.assign({}, state.deleteBlueprint, { visible: action.payload.visible }) }
      );
    default:
      return state;
  }
};

const modalExportBlueprint = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_EXPORT_BLUEPRINT_NAME:
      return Object.assign(
          {}, state,
          { exportBlueprint: Object.assign({}, state.exportBlueprint, { name: action.payload.blueprintName }) }
      );
    case SET_MODAL_EXPORT_BLUEPRINT_CONTENTS:
      return Object.assign(
          {}, state,
          { exportBlueprint: Object.assign({}, state.exportBlueprint, { contents: action.payload.blueprintContents }) }
      );
    case SET_MODAL_EXPORT_BLUEPRINT_VISIBLE:
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
    case SET_MODAL_CREATE_BLUEPRINT_ERROR_NAME_VISIBLE:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_BLUEPRINT_ERROR_DUPLICATE_VISIBLE:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_BLUEPRINT_CHECK_ERRORS:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_DELETE_BLUEPRINT_NAME:
      return modalDeleteBlueprint(state, action);
    case SET_MODAL_DELETE_BLUEPRINT_ID:
      return modalDeleteBlueprint(state, action);
    case SET_MODAL_DELETE_BLUEPRINT_VISIBLE:
      return modalDeleteBlueprint(state, action);
    case FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS:
      return modalCreateImage(state, action);
    case SET_MODAL_CREATE_IMAGE_BLUEPRINT_NAME:
      return modalCreateImage(state, action);
    case SET_MODAL_CREATE_IMAGE_VISIBLE:
      return modalCreateImage(state, action);
    case SET_MODAL_EXPORT_BLUEPRINT_NAME:
      return modalExportBlueprint(state, action);
    case SET_MODAL_EXPORT_BLUEPRINT_CONTENTS:
      return modalExportBlueprint(state, action);
    case SET_MODAL_EXPORT_BLUEPRINT_VISIBLE:
      return modalExportBlueprint(state, action);
    default:
      return state;
  }
};

export default modals;
