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

export const FETCHING_BLUEPRINT_NAMES_SUCCEEDED = 'FETCHING_BLUEPRINT_NAMES_SUCCEEDED';
export const fetchingBlueprintNamesSucceeded = () => ({
  type: FETCHING_BLUEPRINT_NAMES_SUCCEEDED,
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

export const SET_BLUEPRINT_COMMENT = 'SET_BLUEPRINT_COMMENT';
export const setBlueprintComment = (blueprint, comment) => ({
  type: SET_BLUEPRINT_COMMENT,
  payload: {
    blueprint,
    comment,
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

export const ADD_BLUEPRINT_COMPONENT = 'ADD_BLUEPRINT_COMPONENT';
export const addBlueprintComponent = (blueprint, component) => ({
  type: ADD_BLUEPRINT_COMPONENT,
  payload: {
    blueprint,
    component,
  },
});

export const ADD_BLUEPRINT_COMPONENT_SUCCEEDED = 'ADD_BLUEPRINT_COMPONENT_SUCCEEDED';
export const addBlueprintComponentSucceeded = (blueprintId, components, packages, pendingChange) => ({
  type: ADD_BLUEPRINT_COMPONENT_SUCCEEDED,
  payload: {
    blueprintId,
    components,
    packages,
    pendingChange,
  },
});

export const REMOVE_BLUEPRINT_COMPONENT = 'REMOVE_BLUEPRINT_COMPONENT';
export const removeBlueprintComponent = (blueprint, component) => ({
  type: REMOVE_BLUEPRINT_COMPONENT,
  payload: {
    blueprint,
    component,
  },
});

export const REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED = 'REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED';
export const removeBlueprintComponentSucceeded = (blueprintId, components, packages, pendingChange) => ({
  type: REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED,
  payload: {
    blueprintId,
    components,
    packages,
    pendingChange,
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
export const BLUEPRINT_CONTENTS_FAILURE = 'BLUEPRINT_CONTENTS_FAILURE';
export const blueprintContentsFailure = (error, blueprintId) => ({
  type: BLUEPRINT_CONTENTS_FAILURE,
  payload: {
    error,
    blueprintId
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

export const COMMIT_TO_WORKSPACE = 'COMMIT_TO_WORKSPACE';
export const commitToWorkspace = (blueprintId) => ({
  type: COMMIT_TO_WORKSPACE,
  payload: {
    blueprintId,
  },
});

export const START_COMPOSE = 'START_COMPOSE';
export const startCompose = (blueprintName, composeType) => ({
  type: START_COMPOSE,
  payload: {
    blueprintName,
    composeType,
  },
});

export const START_COMPOSE_SUCCEEDED = 'START_COMPOSE_SUCCEEDED';
export const startComposeSucceeded = (blueprintName, imageInfo) => ({
  type: START_COMPOSE_SUCCEEDED,
  payload: {
    blueprintName,
    imageInfo,
  },
});

export const FETCHING_IMAGE_STATUS = 'FETCHING_IMAGE_STATUS';
export const fetchingImageStatus = (blueprintName, imageId) => ({
  type: FETCHING_IMAGE_STATUS,
  payload: {
    imageId,
  },
});

export const FETCHING_IMAGE_STATUS_SUCCEEDED = 'FETCHING_IMAGE_STATUS_SUCCEEDED';
export const fetchingImageStatusSucceeded = (blueprintName, imageInfo) => ({
  type: FETCHING_IMAGE_STATUS_SUCCEEDED,
  payload: {
    blueprintName,
    imageInfo,
  },
});
