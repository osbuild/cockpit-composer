import { SET_EDIT_DESCRIPTION_VISIBLE, SET_EDIT_HOSTNAME_VISIBLE, SET_ACTIVE_TAB } from "../actions/blueprintPage";

const blueprintPage = (state = [], action) => {
  switch (action.type) {
    case SET_EDIT_DESCRIPTION_VISIBLE:
      return Object.assign({}, state, { editDescriptionVisible: action.payload.visible });
    case SET_EDIT_HOSTNAME_VISIBLE:
      return Object.assign({}, state, { editHostnameVisible: action.payload.visible });
    case SET_ACTIVE_TAB:
      return Object.assign({}, state, { activeTab: action.payload.activeTab });
    default:
      return state;
  }
};

export default blueprintPage;
