import {
  SET_MODAL_ACTIVE,
  SET_MODAL_EXPORT_RECIPE_NAME, SET_MODAL_EXPORT_RECIPE_CONTENTS, SET_MODAL_EXPORT_RECIPE_VISIBLE,
  SET_MODAL_CREATE_RECIPE_ERROR_NAME_VISIBLE, SET_MODAL_CREATE_RECIPE_ERROR_DUPLICATE_VISIBLE,
  SET_MODAL_CREATE_RECIPE_ERROR_INLINE, SET_MODAL_CREATE_RECIPE_CHECK_ERRORS, SET_MODAL_CREATE_RECIPE_RECIPE,
  FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS,
} from '../actions/modals';

const modalCreateRecipe = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_CREATE_RECIPE_ERROR_NAME_VISIBLE:
      return {
        ...state,
        createRecipe: {
          ...state.createRecipe,
          errorNameVisible: action.payload.errorNameVisible,
        },
      };
    case SET_MODAL_CREATE_RECIPE_ERROR_DUPLICATE_VISIBLE:
      return {
        ...state,
        createRecipe: {
          ...state.createRecipe,
          errorDuplicateVisible: action.payload.errorDuplicateVisible,
        },
      };
    case SET_MODAL_CREATE_RECIPE_ERROR_INLINE:
      return {
        ...state,
        createRecipe: {
          ...state.createRecipe,
          errorInline: action.payload.errorInline,
        },
      };
    case SET_MODAL_CREATE_RECIPE_CHECK_ERRORS:
      return {
        ...state,
        createRecipe: {
          ...state.createRecipe,
          checkErrors: action.payload.checkErrors,
        },
      };
    case SET_MODAL_CREATE_RECIPE_RECIPE:
      return {
        ...state,
        createRecipe: {
          ...state.createRecipe,
          recipe: action.payload.recipe,
        },
      };
    default:
      return state;
  }
};

const modalCreateComposition = (state = [], action) => {
  switch (action.type) {
    case FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS:
      return {
        ...state,
        createComposition: {
          ...state.createComposition,
          compositionTypes: action.payload.compositionTypes,
        },
      };
    default:
      return state;
  }
};

const modalExportRecipe = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_EXPORT_RECIPE_NAME:
      return {
        ...state,
        exportRecipe: {
          ...state.exportRecipe,
          name: action.payload.recipeName,
        },
      };
    case SET_MODAL_EXPORT_RECIPE_CONTENTS:
      return {
        ...state,
        exportRecipe: {
          ...state.exportRecipe,
          contents: action.payload.recipeContents,
        },
      };
    case SET_MODAL_EXPORT_RECIPE_VISIBLE:
      return {
        ...state,
        exportRecipe: {
          ...state.exportRecipe,
          visible: action.payload.visible,
        },
      };
    default:
      return state;
  }
};

const modals = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_ACTIVE:
      return {
        ...state,
        modalActive: action.payload.modalActive,
      };
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
    default:
      return state;
  }
};

export default modals;
