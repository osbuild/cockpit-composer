export const SET_EDIT_DESCRIPTION_VISIBLE = "SET_EDIT_DESCRIPTION_VISIBLE";
export const setEditDescriptionVisible = visible => ({
  type: SET_EDIT_DESCRIPTION_VISIBLE,
  payload: {
    visible
  }
});

export const SET_EDIT_HOSTNAME_VISIBLE = "SET_EDIT_HOSTNAME_VISIBLE";
export const setEditHostnameVisible = visible => ({
  type: SET_EDIT_HOSTNAME_VISIBLE,
  payload: {
    visible
  }
});

export const SET_EDIT_HOSTNAME_INVALID = "SET_EDIT_HOSTNAME_INVALID";
export const setEditHostnameInvalid = invalid => ({
  type: SET_EDIT_HOSTNAME_INVALID,
  payload: {
    invalid
  }
});

export const SET_ACTIVE_COMPONENT = "SET_ACTIVE_COMPONENT";
export const setActiveComponent = component => ({
  type: SET_ACTIVE_COMPONENT,
  payload: {
    component
  }
});

export const SET_ACTIVE_COMPONENT_PARENT = "SET_ACTIVE_COMPONENT_PARENT";
export const setActiveComponentParent = componentParent => ({
  type: SET_ACTIVE_COMPONENT_PARENT,
  payload: {
    componentParent
  }
});

export const SET_ACTIVE_COMPONENT_STATUS = "SET_ACTIVE_COMPONENT_STATUS";
export const setActiveComponentStatus = componentStatus => ({
  type: SET_ACTIVE_COMPONENT_STATUS,
  payload: {
    componentStatus
  }
});
