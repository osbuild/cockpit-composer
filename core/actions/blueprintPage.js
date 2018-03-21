export const SET_EDIT_DESCRIPTION_VISIBLE = 'SET_EDIT_DESCRIPTION_VISIBLE';
export const setEditDescriptionVisible = (visible) => ({
  type: SET_EDIT_DESCRIPTION_VISIBLE,
  payload: {
    visible,
  },
});

export const SET_EDIT_DESCRIPTION_VALUE = 'SET_EDIT_DESCRIPTION_VALUE';
export const setEditDescriptionValue = (value) => ({
  type: SET_EDIT_DESCRIPTION_VALUE,
  payload: {
    value,
  },
});

export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
export const setActiveTab = (activeTab) => ({
  type: SET_ACTIVE_TAB,
  payload: {
    activeTab,
  },
});

export const SET_ACTIVE_COMPONENT = 'SET_ACTIVE_COMPONENT';
export const setActiveComponent = (component) => ({
  type: SET_ACTIVE_COMPONENT,
  payload: {
    component,
  },
});

export const SET_ACTIVE_COMPONENT_PARENT = 'SET_ACTIVE_COMPONENT_PARENT';
export const setActiveComponentParent = (componentParent) => ({
  type: SET_ACTIVE_COMPONENT_PARENT,
  payload: {
    componentParent,
  },
});

export const SET_ACTIVE_COMPONENT_STATUS = 'SET_ACTIVE_COMPONENT_STATUS';
export const setActiveComponentStatus = (componentStatus) => ({
  type: SET_ACTIVE_COMPONENT_STATUS,
  payload: {
    componentStatus,
  },
});
