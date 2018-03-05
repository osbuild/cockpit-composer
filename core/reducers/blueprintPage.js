import {
  SET_EDIT_DESCRIPTION_VISIBLE, SET_EDIT_DESCRIPTION_VALUE,
  SET_ACTIVE_COMPONENT, SET_ACTIVE_COMPONENT_PARENT, SET_ACTIVE_COMPONENT_STATUS,
  SET_ACTIVE_TAB,
} from '../actions/blueprintPage';

const blueprintPage = (state = [], action) => {
  switch (action.type) {
    case SET_EDIT_DESCRIPTION_VISIBLE:
      return Object.assign({}, state,
                           { editDescriptionVisible: action.payload.visible });
    case SET_EDIT_DESCRIPTION_VALUE:
      return Object.assign({}, state,
                           { editDescriptionValue: action.payload.value });
    case SET_ACTIVE_COMPONENT:
      return Object.assign({}, state,
                           { activeComponent: action.payload.component });
    case SET_ACTIVE_COMPONENT_PARENT:
      return Object.assign({}, state,
                           { activeComponentParent: action.payload.componentParent });
    case SET_ACTIVE_COMPONENT_STATUS:
      return Object.assign({}, state,
                           { activeComponentStatus: action.payload.componentStatus });
    case SET_ACTIVE_TAB:
      return Object.assign({}, state,
                           { activeTab: action.payload.activeTab });
    default:
      return state;
  }
};

export default blueprintPage;
