export const SET_MODAL_RECIPE_NAME = 'SET_MODAL_RECIPE_NAME';
export function setModalRecipeName(modalRecipeName) {
  return {
    type: SET_MODAL_RECIPE_NAME,
    payload: {
      modalRecipeName,
    },
  };
}

export const SET_MODAL_RECIPE_VISIBLE = 'SET_MODAL_RECIPE_VISIBLE';
export function setModalRecipeVisible(modalRecipeVisible) {
  return {
    type: SET_MODAL_RECIPE_VISIBLE,
    payload: {
      modalRecipeVisible,
    },
  };
}

export const SET_MODAL_RECIPE_CONTENTS = 'SET_MODAL_RECIPE_CONTENTS';
export function setModalRecipeContents(modalRecipeContents) {
  return {
    type: SET_MODAL_RECIPE_CONTENTS,
    payload: {
      modalRecipeContents,
    },
  };
}

export const FETCHING_MODAL_RECIPE_CONTENTS = 'FETCHING_MODAL_RECIPE_CONTENTS';
export function fetchingModalRecipeContents(modalRecipeName) {
  return {
    type: FETCHING_MODAL_RECIPE_CONTENTS,
    payload: {
      modalRecipeName,
    },
  };
}
