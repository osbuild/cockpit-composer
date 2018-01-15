export const CREATING_RECIPE = 'CREATING_RECIPE';
export const creatingRecipe = (events, recipe) => ({
  type: CREATING_RECIPE,
  payload: {
    events,
    recipe,
  },
});

export const CREATING_RECIPE_SUCCEEDED = 'CREATING_RECIPE_SUCCEEDED';
export const creatingRecipeSucceeded = (recipe) => ({
  type: CREATING_RECIPE_SUCCEEDED,
  payload: {
    recipe,
  },
});

export const FETCHING_RECIPES = 'FETCHING_RECIPES';
export const fetchingRecipes = () => ({
  type: FETCHING_RECIPES,
});

export const FETCHING_RECIPES_SUCCEEDED = 'FETCHING_RECIPES_SUCCEEDED';
export const fetchingRecipesSucceeded = (recipe, pendingChanges) => ({
  type: FETCHING_RECIPES_SUCCEEDED,
  payload: {
    recipe,
    pendingChanges,
  },
});

export const FETCHING_RECIPE_CONTENTS = 'FETCHING_RECIPE_CONTENTS';
export const fetchingRecipeContents = (recipeId) => ({
  type: FETCHING_RECIPE_CONTENTS,
  payload: {
    recipeId,
  },
});

export const FETCHING_RECIPE_CONTENTS_SUCCEEDED = 'FETCHING_RECIPE_CONTENTS_SUCCEEDED';
export const fetchingRecipeContentsSucceeded = (recipePast, recipePresent, pendingChanges) => ({
  type: FETCHING_RECIPE_CONTENTS_SUCCEEDED,
  payload: {
    recipePast,
    recipePresent,
    pendingChanges,
  },
});

export const SET_RECIPE = 'SET_RECIPE';
export const setRecipe = (recipe) => ({
  type: SET_RECIPE,
  payload: {
    recipe,
  },
});

export const SET_RECIPE_DESCRIPTION = 'SET_RECIPE_DESCRIPTION';
export const setRecipeDescription = (recipe, description) => ({
  type: SET_RECIPE_DESCRIPTION,
  payload: {
    recipe,
    description,
  },
});

export const REMOVE_RECIPE_COMPONENT = 'REMOVE_RECIPE_COMPONENT';
export const removeRecipeComponent = (recipe, component, pendingChange) => ({
  type: REMOVE_RECIPE_COMPONENT,
  payload: {
    recipe,
    component,
    pendingChange,
  },
});

export const SET_RECIPE_COMPONENTS = 'SET_RECIPE_COMPONENTS';
export const setRecipeComponents = (recipe, components, dependencies, packages, pendingChange) => ({
  type: SET_RECIPE_COMPONENTS,
  payload: {
    recipe,
    components,
    dependencies,
    packages,
    pendingChange,
  },
});

export const SET_RECIPE_COMMENT = 'SET_RECIPE_COMMENT';
export const setRecipeComment = (recipe, comment) => ({
  type: SET_RECIPE_COMMENT,
  payload: {
    recipe,
    comment,
  },
});


export const DELETING_RECIPE = 'DELETING_RECIPE';
export const deletingRecipe = (recipeId) => ({
  type: DELETING_RECIPE,
  payload: {
    recipeId,
  },
});

export const DELETING_RECIPE_SUCCEEDED = 'DELETING_RECIPE_SUCCEEDED';
export const deletingRecipeSucceeded = (recipeId) => ({
  type: DELETING_RECIPE_SUCCEEDED,
  payload: {
    recipeId,
  },
});

export const RECIPES_FAILURE = 'RECIPES_FAILURE';
export const recipesFailure = (error) => ({
  type: RECIPES_FAILURE,
  payload: {
    error,
  },
});

export const UNDO = 'UNDO';
export const undo = (recipeId) => ({
  type: UNDO,
  payload: {
    recipeId,
  },
});

export const REDO = 'REDO';
export const redo = (recipeId) => ({
  type: REDO,
  payload: {
    recipeId,
  },
});

export const DELETE_HISTORY = 'DELETE_HISTORY';
export const deleteHistory = (recipeId) => ({
  type: DELETE_HISTORY,
  payload: {
    recipeId,
  },
});

export const SAVE_TO_WORKSPACE = 'SAVE_TO_WORKSPACE';
export const saveToWorkspace = (recipeId) => ({
  type: SAVE_TO_WORKSPACE,
  payload: {
    recipeId,
  },
});
