export const CREATING_BLUEPRINT = 'CREATING_BLUEPRINT';
export const creatingBlueprint = (events, blueprint) => ({
  type: CREATING_BLUEPRINT,
  payload: {
    events,
    blueprint,
  },
});

export const CREATING_BLUEPRINT_SUCCEEDED = 'CREATING_BLUEPRINT_SUCCEEDED';
export const creatingBlueprintSucceeded = (blueprint) => ({
  type: CREATING_BLUEPRINT_SUCCEEDED,
  payload: {
    blueprint,
  },
});

export const FETCHING_BLUEPRINTS = 'FETCHING_BLUEPRINTS';
export const fetchingBlueprints = () => ({
  type: FETCHING_BLUEPRINTS,
});

export const FETCHING_BLUEPRINTS_SUCCEEDED = 'FETCHING_BLUEPRINTS_SUCCEEDED';
export const fetchingBlueprintsSucceeded = (blueprint, pendingChanges) => ({
  type: FETCHING_BLUEPRINTS_SUCCEEDED,
  payload: {
    blueprint,
    pendingChanges,
  },
});

export const FETCHING_BLUEPRINT_CONTENTS = 'FETCHING_BLUEPRINT_CONTENTS';
export const fetchingBlueprintContents = (blueprintId) => ({
  type: FETCHING_BLUEPRINT_CONTENTS,
  payload: {
    blueprintId,
  },
});

export const FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED = 'FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED';
export const fetchingBlueprintContentsSucceeded = (blueprintPast, blueprintPresent, pendingChanges) => ({
  type: FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED,
  payload: {
    blueprintPast,
    blueprintPresent,
    pendingChanges,
  },
});

export const SET_BLUEPRINT = 'SET_BLUEPRINT';
export const setBlueprint = (blueprint) => ({
  type: SET_BLUEPRINT,
  payload: {
    blueprint,
  },
});

export const SET_BLUEPRINT_DESCRIPTION = 'SET_BLUEPRINT_DESCRIPTION';
export const setBlueprintDescription = (blueprint, description) => ({
  type: SET_BLUEPRINT_DESCRIPTION,
  payload: {
    blueprint,
    description,
  },
});

export const REMOVE_BLUEPRINT_COMPONENT = 'REMOVE_BLUEPRINT_COMPONENT';
export const removeBlueprintComponent = (blueprint, component, pendingChange) => ({
  type: REMOVE_BLUEPRINT_COMPONENT,
  payload: {
    blueprint,
    component,
    pendingChange,
  },
});

export const SET_BLUEPRINT_COMPONENTS = 'SET_BLUEPRINT_COMPONENTS';
export const setBlueprintComponents = (blueprint, components, dependencies, packages, pendingChange) => ({
  type: SET_BLUEPRINT_COMPONENTS,
  payload: {
    blueprint,
    components,
    dependencies,
    packages,
    pendingChange,
  },
});

export const SET_BLUEPRINT_COMMENT = 'SET_BLUEPRINT_COMMENT';
export const setBlueprintComment = (blueprint, comment) => ({
  type: SET_BLUEPRINT_COMMENT,
  payload: {
    blueprint,
    comment,
  },
});


export const DELETING_BLUEPRINT = 'DELETING_BLUEPRINT';
export const deletingBlueprint = (blueprintId) => ({
  type: DELETING_BLUEPRINT,
  payload: {
    blueprintId,
  },
});

export const DELETING_BLUEPRINT_SUCCEEDED = 'DELETING_BLUEPRINT_SUCCEEDED';
export const deletingBlueprintSucceeded = (blueprintId) => ({
  type: DELETING_BLUEPRINT_SUCCEEDED,
  payload: {
    blueprintId,
  },
});

export const BLUEPRINTS_FAILURE = 'BLUEPRINTS_FAILURE';
export const blueprintsFailure = (error) => ({
  type: BLUEPRINTS_FAILURE,
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
