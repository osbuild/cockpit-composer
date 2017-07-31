export const SET_EXPORT_MODAL_RECIPE_NAME = 'SET_EXPORT_MODAL_RECIPE_NAME';
export function setExportModalRecipeName(recipeName) {
  return {
    type: SET_EXPORT_MODAL_RECIPE_NAME,
    payload: {
      recipeName,
    },
  };
}

export const SET_EXPORT_MODAL_VISIBLE = 'SET_EXPORT_MODAL_VISIBLE';
export function setExportModalVisible(visible) {
  return {
    type: SET_EXPORT_MODAL_VISIBLE,
    payload: {
      visible,
    },
  };
}

export const SET_EXPORT_MODAL_RECIPE_CONTENTS = 'SET_EXPORT_MODAL_RECIPE_CONTENTS';
export function setExportModalRecipeContents(recipeContents) {
  return {
    type: SET_EXPORT_MODAL_RECIPE_CONTENTS,
    payload: {
      recipeContents,
    },
  };
}

export const FETCHING_EXPORT_MODAL_RECIPE_CONTENTS = 'FETCHING_EXPORT_MODAL_RECIPE_CONTENTS';
export function fetchingExportModalRecipeContents(recipeName) {
  return {
    type: FETCHING_EXPORT_MODAL_RECIPE_CONTENTS,
    payload: {
      recipeName,
    },
  };
}
