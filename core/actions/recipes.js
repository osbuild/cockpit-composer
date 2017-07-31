export const FETCHING_RECIPE = 'FETCHING_RECIPE';
export const fetchingRecipe = (recipeId) => ({
  type: FETCHING_RECIPE,
  payload: {
    recipeId,
  },
});

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

export const FETCHING_RECIPE_SUCCEEDED = 'FETCHING_RECIPE_SUCCEEDED';
export const fetchingRecipeSucceeded = (recipe) => ({
  type: FETCHING_RECIPE_SUCCEEDED,
  payload: {
    recipe,
  },
});

export const FETCHING_RECIPES = 'FETCHING_RECIPES';
export const fetchingRecipes = () => ({
  type: FETCHING_RECIPES,
});

export const FETCHING_RECIPES_SUCCEEDED = 'FETCHING_RECIPES_SUCCEEDED';
export const fetchingRecipesSucceeded = (recipes) => ({
  type: FETCHING_RECIPES_SUCCEEDED,
  payload: {
    recipes,
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
export const fetchingRecipeContentsSucceeded = (recipe) => ({
  type: FETCHING_RECIPE_CONTENTS_SUCCEEDED,
  payload: {
    recipe,
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

export const ADD_RECIPE_COMPONENT = 'ADD_RECIPE_COMPONENT';
export const addRecipeComponent = (recipe, component) => ({
  type: ADD_RECIPE_COMPONENT,
  payload: {
    recipe,
    component,
  },
});

export const REMOVE_RECIPE_COMPONENT = 'REMOVE_RECIPE_COMPONENT';
export const removeRecipeComponent = (recipe, component) => ({
  type: REMOVE_RECIPE_COMPONENT,
  payload: {
    recipe,
    component,
  },
});

export const SET_RECIPE_COMPONENTS = 'SET_RECIPE_COMPONENTS';
export const setRecipeComponents = (recipe, components) => ({
  type: SET_RECIPE_COMPONENTS,
  payload: {
    recipe,
    components,
  },
});

export const SET_RECIPE_DEPENDENCIES = 'SET_RECIPE_DEPENDENCIES';
export const setRecipeDependencies = (recipe, dependencies) => ({
  type: SET_RECIPE_DEPENDENCIES,
  payload: {
    recipe,
    dependencies,
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
