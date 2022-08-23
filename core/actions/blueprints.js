import * as composer from "../composer";

export const blueprintsUpdate = (blueprint) => async (dispatch) => {
  try {
    await composer.newBlueprint(blueprint);
    dispatch(blueprintsUpdated(blueprint));
  } catch (error) {
    dispatch(blueprintsFailure(error));
  }
};

export const BLUEPRINTS_UPDATED = "BLUEPRINTS_UPDATED";
export const blueprintsUpdated = (blueprint) => ({
  type: BLUEPRINTS_UPDATED,
  payload: {
    blueprint,
  },
});

export const blueprintsGetAll = () => async (dispatch) => {
  try {
    const bpNames = await composer.getBlueprintsNames();
    if (bpNames?.length) {
      const blueprints = await composer.getBlueprintsInfo(bpNames);
      blueprints.forEach((bp) => dispatch(blueprintsAdded(bp)));
    }
    dispatch(blueprintsFetched());
  } catch (error) {
    dispatch(blueprintsFailure(error));
  }
};

export const BLUEPRINTS_ADDED = "BLUEPRINTS_ADDED";
export const blueprintsAdded = (blueprint) => ({
  type: BLUEPRINTS_ADDED,
  payload: {
    blueprint,
  },
});

export const BLUEPRINTS_FETCHED = "BLUEPRINTS_FETCHED";
export const blueprintsFetched = () => ({
  type: BLUEPRINTS_FETCHED,
});

// Above are useful for unified and should be kept post-cleanup

export const CREATING_BLUEPRINT = "CREATING_BLUEPRINT";
export const creatingBlueprint = (blueprint) => ({
  type: CREATING_BLUEPRINT,
  payload: {
    blueprint,
  },
});

export const CREATING_BLUEPRINT_SUCCEEDED = "CREATING_BLUEPRINT_SUCCEEDED";
export const creatingBlueprintSucceeded = (blueprint) => ({
  type: CREATING_BLUEPRINT_SUCCEEDED,
  payload: {
    blueprint,
  },
});

export const FETCHING_BLUEPRINTS = "FETCHING_BLUEPRINTS";
export const fetchingBlueprints = () => ({
  type: FETCHING_BLUEPRINTS,
});

export const FETCHING_BLUEPRINT_NAMES_SUCCEEDED = "FETCHING_BLUEPRINT_NAMES_SUCCEEDED";
export const fetchingBlueprintNamesSucceeded = (blueprints) => ({
  type: FETCHING_BLUEPRINT_NAMES_SUCCEEDED,
  payload: {
    blueprints,
  },
});

export const FETCHING_BLUEPRINTS_SUCCEEDED = "FETCHING_BLUEPRINTS_SUCCEEDED";
export const fetchingBlueprintsSucceeded = (blueprint, pendingChanges) => ({
  type: FETCHING_BLUEPRINTS_SUCCEEDED,
  payload: {
    blueprint,
    pendingChanges,
  },
});

export const FETCHING_BLUEPRINT_CONTENTS = "FETCHING_BLUEPRINT_CONTENTS";
export const fetchingBlueprintContents = (blueprintName) => ({
  type: FETCHING_BLUEPRINT_CONTENTS,
  payload: {
    blueprintName,
  },
});

export const FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED = "FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED";
export const fetchingBlueprintContentsSucceeded = (blueprint) => ({
  type: FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED,
  payload: {
    blueprint,
  },
});

export const RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED = "RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED";
export const reloadingBlueprintContentsSucceeded = (blueprint) => ({
  type: RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED,
  payload: {
    blueprint,
  },
});

export const SET_BLUEPRINT = "SET_BLUEPRINT";
export const setBlueprint = (blueprint) => ({
  type: SET_BLUEPRINT,
  payload: {
    blueprint,
  },
});

export const SET_BLUEPRINT_USERS = "SET_BLUEPRINT_USERS";
export const setBlueprintUsers = (blueprintName, users) => ({
  type: SET_BLUEPRINT_USERS,
  payload: {
    blueprintName,
    users,
  },
});

export const SET_BLUEPRINT_USERS_SUCCEEDED = "SET_BLUEPRINT_USERS_SUCCEEDED";
export const setBlueprintUsersSucceeded = (blueprint) => ({
  type: SET_BLUEPRINT_USERS_SUCCEEDED,
  payload: {
    blueprint,
  },
});

export const SET_BLUEPRINT_DEVICE = "SET_BLUEPRINT_DEVICE";
export const setBlueprintDevice = (blueprint, device) => ({
  type: SET_BLUEPRINT_DEVICE,
  payload: {
    blueprint,
    device,
  },
});

export const SET_BLUEPRINT_HOSTNAME = "SET_BLUEPRINT_HOSTNAME";
export const setBlueprintHostname = (blueprint, hostname) => ({
  type: SET_BLUEPRINT_HOSTNAME,
  payload: {
    blueprint,
    hostname,
  },
});

export const SET_BLUEPRINT_HOSTNAME_SUCCEEDED = "SET_BLUEPRINT_HOSTNAME_SUCCEEDED";
export const setBlueprintHostnameSucceeded = (blueprint) => ({
  type: SET_BLUEPRINT_HOSTNAME_SUCCEEDED,
  payload: {
    blueprint,
  },
});

export const SET_BLUEPRINT_DESCRIPTION = "SET_BLUEPRINT_DESCRIPTION";
export const setBlueprintDescription = (blueprint, description) => ({
  type: SET_BLUEPRINT_DESCRIPTION,
  payload: {
    blueprint,
    description,
  },
});

export const SET_BLUEPRINT_DESCRIPTION_SUCCEEDED = "SET_BLUEPRINT_DESCRIPTION_SUCCEEDED";
export const setBlueprintDescriptionSucceeded = (blueprint) => ({
  type: SET_BLUEPRINT_DESCRIPTION_SUCCEEDED,
  payload: {
    blueprint,
  },
});

export const UPDATE_BLUEPRINT_COMPONENTS = "UPDATE_BLUEPRINT_COMPONENTS";
export const updateBlueprintComponents = (blueprintName, components, packages, modules, pendingChange) => ({
  type: UPDATE_BLUEPRINT_COMPONENTS,
  payload: {
    blueprintName,
    components,
    packages,
    modules,
    pendingChange,
  },
});

export const DELETING_BLUEPRINT = "DELETING_BLUEPRINT";
export const deletingBlueprint = (blueprintName) => ({
  type: DELETING_BLUEPRINT,
  payload: {
    blueprintName,
  },
});

export const DELETING_BLUEPRINT_SUCCEEDED = "DELETING_BLUEPRINT_SUCCEEDED";
export const deletingBlueprintSucceeded = (blueprintName) => ({
  type: DELETING_BLUEPRINT_SUCCEEDED,
  payload: {
    blueprintName,
  },
});

export const BLUEPRINTS_FAILURE = "BLUEPRINTS_FAILURE";
export const blueprintsFailure = (error) => ({
  type: BLUEPRINTS_FAILURE,
  payload: {
    error,
  },
});

export const BLUEPRINT_CONTENTS_FAILURE = "BLUEPRINT_CONTENTS_FAILURE";
export const blueprintContentsFailure = (error, blueprintName) => ({
  type: BLUEPRINT_CONTENTS_FAILURE,
  payload: {
    error,
    blueprintName,
  },
});

export const UNDO = "UNDO";
export const undo = (blueprintName, reload) => ({
  type: UNDO,
  payload: {
    blueprintName,
    reload,
  },
});

export const REDO = "REDO";
export const redo = (blueprintName, reload) => ({
  type: REDO,
  payload: {
    blueprintName,
    reload,
  },
});

export const DELETE_HISTORY = "DELETE_HISTORY";
export const deleteHistory = (blueprintName, reload) => ({
  type: DELETE_HISTORY,
  payload: {
    blueprintName,
    reload,
  },
});

export const DELETE_WORKSPACE = "DELETE_WORKSPACE";
export const deleteWorkspace = (blueprintName) => ({
  type: DELETE_WORKSPACE,
  payload: {
    blueprintName,
  },
});

export const FETCHING_COMP_DEPS = "FETCHING_COMP_DEPS";
export const fetchingCompDeps = (component, blueprintName) => ({
  type: FETCHING_COMP_DEPS,
  payload: {
    component,
    blueprintName,
  },
});

export const SET_COMP_DEPS = "SET_COMP_DEPS";
export const setCompDeps = (component, blueprintName) => ({
  type: SET_COMP_DEPS,
  payload: {
    component,
    blueprintName,
  },
});
