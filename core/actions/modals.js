export const SET_MODAL_ACTIVE = 'SET_MODAL_ACTIVE';
export function setModalActive(modalActive) {
  return {
    type: SET_MODAL_ACTIVE,
    payload: {
      modalActive,
    },
  };
}

export const SET_MODAL_CREATE_BLUEPRINT_ERROR_NAME_VISIBLE = 'SET_MODAL_CREATE_BLUEPRINT_ERROR_NAME_VISIBLE';
export function setModalCreateBlueprintErrorNameVisible(errorNameVisible) {
  return {
    type: SET_MODAL_CREATE_BLUEPRINT_ERROR_NAME_VISIBLE,
    payload: {
      errorNameVisible,
    },
  };
}

export const SET_MODAL_CREATE_BLUEPRINT_ERROR_DUPLICATE_VISIBLE = 'SET_MODAL_CREATE_BLUEPRINT_ERROR_DUPLICATE_VISIBLE';
export function setModalCreateBlueprintErrorDuplicateVisible(errorDuplicateVisible) {
  return {
    type: SET_MODAL_CREATE_BLUEPRINT_ERROR_DUPLICATE_VISIBLE,
    payload: {
      errorDuplicateVisible,
    },
  };
}

export const SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE = 'SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE';
export function setModalCreateBlueprintErrorInline(errorInline) {
  return {
    type: SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE,
    payload: {
      errorInline,
    },
  };
}

export const SET_MODAL_CREATE_BLUEPRINT_CHECK_ERRORS = 'SET_MODAL_CREATE_BLUEPRINT_CHECK_ERRORS';
export function setModalCreateBlueprintCheckErrors(checkErrors) {
  return {
    type: SET_MODAL_CREATE_BLUEPRINT_CHECK_ERRORS,
    payload: {
      checkErrors,
    },
  };
}

export const SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT = 'SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT';
export function setModalCreateBlueprintBlueprint(blueprint) {
  return {
    type: SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT,
    payload: {
      blueprint,
    },
  };
}

export const FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS = 'FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS';
export function fetchingModalCreateImageTypesSuccess(imageTypes) {
  return {
    type: FETCHING_MODAL_CREATE_COMPOSTION_TYPES_SUCCESS,
    payload: {
      imageTypes,
    },
  };
}

export const SET_MODAL_EXPORT_BLUEPRINT_NAME = 'SET_MODAL_EXPORT_BLUEPRINT_NAME';
export function setModalExportBlueprintName(blueprintName) {
  return {
    type: SET_MODAL_EXPORT_BLUEPRINT_NAME,
    payload: {
      blueprintName,
    },
  };
}

export const SET_MODAL_EXPORT_BLUEPRINT_VISIBLE = 'SET_MODAL_EXPORT_BLUEPRINT_VISIBLE';
export function setModalExportBlueprintVisible(visible) {
  return {
    type: SET_MODAL_EXPORT_BLUEPRINT_VISIBLE,
    payload: {
      visible,
    },
  };
}

export const SET_MODAL_EXPORT_BLUEPRINT_CONTENTS = 'SET_MODAL_EXPORT_BLUEPRINT_CONTENTS';
export function setModalExportBlueprintContents(blueprintContents) {
  return {
    type: SET_MODAL_EXPORT_BLUEPRINT_CONTENTS,
    payload: {
      blueprintContents,
    },
  };
}

export const FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS = 'FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS';
export function fetchingModalExportBlueprintContents(blueprintName) {
  return {
    type: FETCHING_MODAL_EXPORT_BLUEPRINT_CONTENTS,
    payload: {
      blueprintName,
    },
  };
}

export const SET_MODAL_DELETE_BLUEPRINT_NAME = 'SET_MODAL_DELETE_BLUEPRINT_NAME';
export function setModalDeleteBlueprintName(blueprintName) {
  return {
    type: SET_MODAL_DELETE_BLUEPRINT_NAME,
    payload: {
      blueprintName,
    },
  };
}

export const SET_MODAL_DELETE_BLUEPRINT_ID = 'SET_MODAL_DELETE_BLUEPRINT_ID';
export function setModalDeleteBlueprintId(blueprintId) {
  return {
    type: SET_MODAL_DELETE_BLUEPRINT_ID,
    payload: {
      blueprintId,
    },
  };
}

export const SET_MODAL_DELETE_BLUEPRINT_VISIBLE = 'SET_MODAL_DELETE_BLUEPRINT_VISIBLE';
export function setModalDeleteBlueprintVisible(visible) {
  return {
    type: SET_MODAL_DELETE_BLUEPRINT_VISIBLE,
    payload: {
      visible,
    },
  };
}

export const SET_MODAL_CREATE_IMAGE_BLUEPRINT_NAME = 'SET_MODAL_CREATE_IMAGE_BLUEPRINT_NAME';
export function setModalCreateImageBlueprintName(blueprintName) {
  return {
    type: SET_MODAL_CREATE_IMAGE_BLUEPRINT_NAME,
    payload: {
      blueprintName,
    },
  };
}

export const SET_MODAL_CREATE_IMAGE_VISIBLE = 'SET_MODAL_CREATE_IMAGE_VISIBLE';
export function setModalCreateImageVisible(visible) {
  return {
    type: SET_MODAL_CREATE_IMAGE_VISIBLE,
    payload: {
      visible,
    },
  };
}

export const APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES = 'APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES';
export function appendModalPendingChangesComponentUpdates(componentUpdate) {
  return {
    type: APPEND_MODAL_PENDING_CHANGES_COMPONENT_UPDATES,
    payload: {
      componentUpdate
    },
  };
}
