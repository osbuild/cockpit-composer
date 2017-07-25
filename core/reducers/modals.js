import {
  SET_MODAL_RECIPE_NAME, SET_MODAL_RECIPE_CONTENTS, SET_MODAL_RECIPE_VISIBLE,
} from '../actions/modals';

const modalExportRecipe = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_RECIPE_NAME:
      return {
        ...state,
        name: action.payload.modalRecipeName,
      };
    case SET_MODAL_RECIPE_CONTENTS:
      return {
        ...state,
        contents: action.payload.modalRecipeContents,
      };
    case SET_MODAL_RECIPE_VISIBLE:
      return {
        ...state,
        visible: action.payload.modalRecipeVisible,
      };
    default:
      return state;
  }
};

export default modalExportRecipe;
