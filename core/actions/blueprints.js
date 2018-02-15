export const CREATING_RECIPE = 'CREATING_RECIPE';
export const creatingBlueprint = (events, blueprint) => ({
  type: CREATING_RECIPE,
  payload: {
    events,
    blueprint,
  },
});

export const CREATING_RECIPE_SUCCEEDED = 'CREATING_RECIPE_SUCCEEDED';
export const creatingBlueprintSucceeded = (blueprint) => ({
  type: CREATING_RECIPE_SUCCEEDED,
  payload: {
    blueprint,
  },
});

export const FETCHING_RECIPES = 'FETCHING_RECIPES';
export const fetchingBlueprints = () => ({
  type: FETCHING_RECIPES,
});

export const FETCHING_RECIPES_SUCCEEDED = 'FETCHING_RECIPES_SUCCEEDED';
export const fetchingBlueprintsSucceeded = (blueprint, pendingChanges) => ({
  type: FETCHING_RECIPES_SUCCEEDED,
  payload: {
    blueprint,
    pendingChanges,
  },
});

export const FETCHING_RECIPE_CONTENTS = 'FETCHING_RECIPE_CONTENTS';
export const fetchingBlueprintContents = (blueprintId) => ({
  type: FETCHING_RECIPE_CONTENTS,
  payload: {
    blueprintId,
  },
});

export const FETCHING_RECIPE_CONTENTS_SUCCEEDED = 'FETCHING_RECIPE_CONTENTS_SUCCEEDED';
export const fetchingBlueprintContentsSucceeded = (blueprintPast, blueprintPresent, pendingChanges) => ({
  type: FETCHING_RECIPE_CONTENTS_SUCCEEDED,
  payload: {
    blueprintPast,
    blueprintPresent,
    pendingChanges,
  },
});

export const SET_RECIPE = 'SET_RECIPE';
export const setBlueprint = (blueprint) => ({
  type: SET_RECIPE,
  payload: {
    blueprint,
  },
});

export const SET_RECIPE_DESCRIPTION = 'SET_RECIPE_DESCRIPTION';
export const setBlueprintDescription = (blueprint, description) => ({
  type: SET_RECIPE_DESCRIPTION,
  payload: {
    blueprint,
    description,
  },
});

export const REMOVE_RECIPE_COMPONENT = 'REMOVE_RECIPE_COMPONENT';
export const removeBlueprintComponent = (blueprint, component, pendingChange) => ({
  type: REMOVE_RECIPE_COMPONENT,
  payload: {
    blueprint,
    component,
    pendingChange,
  },
});

export const SET_RECIPE_COMPONENTS = 'SET_RECIPE_COMPONENTS';
export const setBlueprintComponents = (blueprint, components, dependencies, packages, pendingChange) => ({
  type: SET_RECIPE_COMPONENTS,
  payload: {
    blueprint,
    components,
    dependencies,
    packages,
    pendingChange,
  },
});

export const SET_RECIPE_COMMENT = 'SET_RECIPE_COMMENT';
export const setBlueprintComment = (blueprint, comment) => ({
  type: SET_RECIPE_COMMENT,
  payload: {
    blueprint,
    comment,
  },
});


export const DELETING_RECIPE = 'DELETING_RECIPE';
export const deletingBlueprint = (blueprintId) => ({
  type: DELETING_RECIPE,
  payload: {
    blueprintId,
  },
});

export const DELETING_RECIPE_SUCCEEDED = 'DELETING_RECIPE_SUCCEEDED';
export const deletingBlueprintSucceeded = (blueprintId) => ({
  type: DELETING_RECIPE_SUCCEEDED,
  payload: {
    blueprintId,
  },
});

export const RECIPES_FAILURE = 'RECIPES_FAILURE';
export const blueprintsFailure = (error) => ({
  type: RECIPES_FAILURE,
  payload: {
    error,
  },
});

export const UNDO = 'UNDO';
export const undo = (blueprintId) => ({
  type: UNDO,
  payload: {
    blueprintId,
  },
});

export const REDO = 'REDO';
export const redo = (blueprintId) => ({
  type: REDO,
  payload: {
    blueprintId,
  },
});

export const DELETE_HISTORY = 'DELETE_HISTORY';
export const deleteHistory = (blueprintId) => ({
  type: DELETE_HISTORY,
  payload: {
    blueprintId,
  },
});

export const SAVE_TO_WORKSPACE = 'SAVE_TO_WORKSPACE';
export const saveToWorkspace = (blueprintId) => ({
  type: SAVE_TO_WORKSPACE,
  payload: {
    blueprintId,
  },
});
