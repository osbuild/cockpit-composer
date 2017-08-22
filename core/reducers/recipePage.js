import {
  SET_EDIT_DESCRIPTION_VISIBLE, SET_EDIT_DESCRIPTION_VALUE,
  SET_SELECTED_COMPONENT, SET_SELECTED_COMPONENT_PARENT, SET_SELECTED_COMPONENT_STATUS,
  SET_ACTIVE_TAB,
} from '../actions/recipePage';

const recipePage = (state = [], action) => {
  switch (action.type) {
    case SET_EDIT_DESCRIPTION_VISIBLE:
      return {
        ...state,
        editDescriptionVisible: action.payload.visible,
      };
    case SET_EDIT_DESCRIPTION_VALUE:
      return {
        ...state,
        editDescriptionValue: action.payload.value,
      };
    case SET_SELECTED_COMPONENT:
      return {
        ...state,
        selectedComponent: action.payload.component,
      };
    case SET_SELECTED_COMPONENT_PARENT:
      return {
        ...state,
        selectedComponentParent: action.payload.componentParent,
      };
    case SET_SELECTED_COMPONENT_STATUS:
      return {
        ...state,
        selectedComponentStatus: action.payload.componentStatus,
      };
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload.activeTab,
      };
    default:
      return state;
  }
};

export default recipePage;
