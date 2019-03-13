export const CREATING_BLUEPRINT = "CREATING_BLUEPRINT";
export const creatingBlueprint = blueprint => ({
  type: CREATING_BLUEPRINT,
  payload: {
    blueprint
  }
});

export const CREATING_BLUEPRINT_SUCCEEDED = "CREATING_BLUEPRINT_SUCCEEDED";
export const creatingBlueprintSucceeded = blueprint => ({
  type: CREATING_BLUEPRINT_SUCCEEDED,
  payload: {
    blueprint
  }
});

export const FETCHING_BLUEPRINTS = "FETCHING_BLUEPRINTS";
export const fetchingBlueprints = () => ({
  type: FETCHING_BLUEPRINTS
});

export const FETCHING_BLUEPRINT_NAMES_SUCCEEDED = "FETCHING_BLUEPRINT_NAMES_SUCCEEDED";
export const fetchingBlueprintNamesSucceeded = () => ({
  type: FETCHING_BLUEPRINT_NAMES_SUCCEEDED
});

export const FETCHING_BLUEPRINTS_SUCCEEDED = "FETCHING_BLUEPRINTS_SUCCEEDED";
export const fetchingBlueprintsSucceeded = (blueprint, pendingChanges) => ({
  type: FETCHING_BLUEPRINTS_SUCCEEDED,
  payload: {
    blueprint,
    pendingChanges
  }
});

export const FETCHING_BLUEPRINT_CONTENTS = "FETCHING_BLUEPRINT_CONTENTS";
export const fetchingBlueprintContents = blueprintId => ({
  type: FETCHING_BLUEPRINT_CONTENTS,
  payload: {
    blueprintId
  }
});

export const FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED = "FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED";
export const fetchingBlueprintContentsSucceeded = (blueprint, pastBlueprint) => ({
  type: FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED,
  payload: {
    blueprint,
    pastBlueprint
  }
});

export const RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED = "RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED";
export const reloadingBlueprintContentsSucceeded = blueprint => ({
  type: RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED,
  payload: {
    blueprint
  }
});

export const SET_BLUEPRINT = "SET_BLUEPRINT";
export const setBlueprint = blueprint => ({
  type: SET_BLUEPRINT,
  payload: {
    blueprint
  }
});

export const SET_BLUEPRINT_COMMENT = "SET_BLUEPRINT_COMMENT";
export const setBlueprintComment = (blueprint, comment) => ({
  type: SET_BLUEPRINT_COMMENT,
  payload: {
    blueprint,
    comment
  }
});

export const SET_BLUEPRINT_USERS = "SET_BLUEPRINT_USERS";
export const setBlueprintUsers = (blueprintId, users) => ({
  type: SET_BLUEPRINT_USERS,
  payload: {
    blueprintId,
    users
  }
});

export const SET_BLUEPRINT_USERS_SUCCEEDED = "SET_BLUEPRINT_USERS_SUCCEEDED";
export const setBlueprintUsersSucceeded = blueprint => ({
  type: SET_BLUEPRINT_USERS_SUCCEEDED,
  payload: {
    blueprint
  }
});

export const SET_BLUEPRINT_HOSTNAME = "SET_BLUEPRINT_HOSTNAME";
export const setBlueprintHostname = (blueprint, hostname) => ({
  type: SET_BLUEPRINT_HOSTNAME,
  payload: {
    blueprint,
    hostname
  }
});

export const SET_BLUEPRINT_HOSTNAME_SUCCEEDED = "SET_BLUEPRINT_HOSTNAME_SUCCEEDED";
export const setBlueprintHostnameSucceeded = blueprint => ({
  type: SET_BLUEPRINT_HOSTNAME_SUCCEEDED,
  payload: {
    blueprint
  }
});

export const SET_BLUEPRINT_DESCRIPTION = "SET_BLUEPRINT_DESCRIPTION";
export const setBlueprintDescription = (blueprint, description) => ({
  type: SET_BLUEPRINT_DESCRIPTION,
  payload: {
    blueprint,
    description
  }
});

export const SET_BLUEPRINT_DESCRIPTION_SUCCEEDED = "SET_BLUEPRINT_DESCRIPTION_SUCCEEDED";
export const setBlueprintDescriptionSucceeded = blueprint => ({
  type: SET_BLUEPRINT_DESCRIPTION_SUCCEEDED,
  payload: {
    blueprint
  }
});

export const UPDATE_BLUEPRINT_COMPONENTS = "UPDATE_BLUEPRINT_COMPONENTS";
export const updateBlueprintComponents = (blueprintId, components, packages, modules, pendingChange) => ({
  type: UPDATE_BLUEPRINT_COMPONENTS,
  payload: {
    blueprintId,
    components,
    packages,
    modules,
    pendingChange
  }
});

export const DELETING_BLUEPRINT = "DELETING_BLUEPRINT";
export const deletingBlueprint = blueprintId => ({
  type: DELETING_BLUEPRINT,
  payload: {
    blueprintId
  }
});

export const DELETING_BLUEPRINT_SUCCEEDED = "DELETING_BLUEPRINT_SUCCEEDED";
export const deletingBlueprintSucceeded = blueprintId => ({
  type: DELETING_BLUEPRINT_SUCCEEDED,
  payload: {
    blueprintId
  }
});

export const BLUEPRINTS_FAILURE = "BLUEPRINTS_FAILURE";
export const blueprintsFailure = error => ({
  type: BLUEPRINTS_FAILURE,
  payload: {
    error
  }
});

export const BLUEPRINT_CONTENTS_FAILURE = "BLUEPRINT_CONTENTS_FAILURE";
export const blueprintContentsFailure = (error, blueprintId) => ({
  type: BLUEPRINT_CONTENTS_FAILURE,
  payload: {
    error,
    blueprintId
  }
});

export const UNDO = "UNDO";
export const undo = (blueprintId, reload) => ({
  type: UNDO,
  payload: {
    blueprintId,
    reload
  }
});

export const REDO = "REDO";
export const redo = (blueprintId, reload) => ({
  type: REDO,
  payload: {
    blueprintId,
    reload
  }
});

export const DELETE_HISTORY = "DELETE_HISTORY";
export const deleteHistory = (blueprintId, reload) => ({
  type: DELETE_HISTORY,
  payload: {
    blueprintId,
    reload
  }
});

export const DELETE_WORKSPACE = "DELETE_WORKSPACE";
export const deleteWorkspace = blueprintId => ({
  type: DELETE_WORKSPACE,
  payload: {
    blueprintId
  }
});

export const FETCHING_COMP_DEPS = "FETCHING_COMP_DEPS";
export const fetchingCompDeps = (component, blueprintId) => ({
  type: FETCHING_COMP_DEPS,
  payload: {
    component,
    blueprintId
  }
});

export const SET_COMP_DEPS = "SET_COMP_DEPS";
export const setCompDeps = (component, blueprintId) => ({
  type: SET_COMP_DEPS,
  payload: {
    component,
    blueprintId
  }
});
