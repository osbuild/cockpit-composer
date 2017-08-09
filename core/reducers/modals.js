import {
  SET_EXPORT_MODAL_RECIPE_NAME, SET_EXPORT_MODAL_RECIPE_CONTENTS, SET_EXPORT_MODAL_VISIBLE,
} from '../actions/modals';

const exportModal = (state = [], action) => {
  switch (action.type) {
    case SET_EXPORT_MODAL_RECIPE_NAME:
      return {
        ...state,
        name: action.payload.recipeName,
      };
    case SET_EXPORT_MODAL_RECIPE_CONTENTS:
      return {
        ...state,
        contents: action.payload.recipeContents,
      };
    case SET_EXPORT_MODAL_VISIBLE:
      return {
        ...state,
        visible: action.payload.visible,
      };
    default:
      return state;
  }
};

export default exportModal;
