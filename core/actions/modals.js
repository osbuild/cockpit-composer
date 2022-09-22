export const SET_MODAL_ACTIVE = "SET_MODAL_ACTIVE";
export function setModalActive(modalActive) {
  return {
    type: SET_MODAL_ACTIVE,
    payload: {
      modalActive,
    },
  };
}

export const SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT =
  "SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT";
export function setModalCreateBlueprintBlueprint(blueprint) {
  return {
    type: SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT,
    payload: {
      blueprint,
    },
  };
}

export const SET_MODAL_STOP_BUILD_STATE = "SET_MODAL_STOP_BUILD_STATE";
export function setModalStopBuildState(composeId, blueprintName) {
  return {
    type: SET_MODAL_STOP_BUILD_STATE,
    payload: {
      composeId,
      blueprintName,
    },
  };
}

export const SET_MODAL_STOP_BUILD_VISIBLE = "SET_MODAL_STOP_BUILD_VISIBLE";
export function setModalStopBuildVisible(visible) {
  return {
    type: SET_MODAL_STOP_BUILD_VISIBLE,
    payload: {
      visible,
    },
  };
}

export const SET_MODAL_DELETE_IMAGE_STATE = "SET_MODAL_DELETE_IMAGE_STATE";
export function setModalDeleteImageState(composeId, blueprintName) {
  return {
    type: SET_MODAL_DELETE_IMAGE_STATE,
    payload: {
      composeId,
      blueprintName,
    },
  };
}

export const SET_MODAL_DELETE_IMAGE_VISIBLE = "SET_MODAL_DELETE_IMAGE_VISIBLE";
export function setModalDeleteImageVisible(visible) {
  return {
    type: SET_MODAL_DELETE_IMAGE_VISIBLE,
    payload: {
      visible,
    },
  };
}

export const APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES =
  "APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES";
export function appendModalPendingChangesComponentUpdates(componentUpdate) {
  return {
    type: APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES,
    payload: {
      componentUpdate,
    },
  };
}

export const SET_MODAL_CREATE_USER_DATA = "SET_MODAL_CREATE_USER_DATA";
export function setModalUserAccountData(data) {
  return {
    type: SET_MODAL_CREATE_USER_DATA,
    payload: {
      data,
    },
  };
}

export const SET_MODAL_CREATE_USER_VISIBLE = "SET_MODAL_CREATE_USER_VISIBLE";
export function setModalUserAccountVisible(visible) {
  return {
    type: SET_MODAL_CREATE_USER_VISIBLE,
    payload: {
      visible,
    },
  };
}

export const SET_MODAL_MANAGE_SOURCES_CONTENTS =
  "SET_MODAL_MANAGE_SOURCES_CONTENTS";
export function setModalManageSourcesContents(sources) {
  return {
    type: SET_MODAL_MANAGE_SOURCES_CONTENTS,
    payload: {
      sources,
    },
  };
}

export const FETCHING_MODAL_MANAGE_SOURCES_CONTENTS =
  "FETCHING_MODAL_MANAGE_SOURCES_CONTENTS";
export function fetchingModalManageSourcesContents() {
  return {
    type: FETCHING_MODAL_MANAGE_SOURCES_CONTENTS,
  };
}

export const MODAL_MANAGE_SOURCES_FAILURE = "MODAL_MANAGE_SOURCES_FAILURE";
export function modalManageSourcesFailure(error) {
  return {
    type: MODAL_MANAGE_SOURCES_FAILURE,
    payload: {
      error,
    },
  };
}

export const ADD_MODAL_MANAGE_SOURCES_ENTRY = "ADD_MODAL_MANAGE_SOURCES_ENTRY";
export function addModalManageSourcesEntry(source) {
  return {
    type: ADD_MODAL_MANAGE_SOURCES_ENTRY,
    payload: {
      source,
    },
  };
}

export const REMOVE_MODAL_MANAGE_SOURCES_ENTRY =
  "REMOVE_MODAL_MANAGE_SOURCES_ENTRY";
export function removeModalManageSourcesEntry(sourceName) {
  return {
    type: REMOVE_MODAL_MANAGE_SOURCES_ENTRY,
    payload: {
      sourceName,
    },
  };
}
