import { SET_EDIT_DESCRIPTION_VISIBLE, SET_EDIT_DESCRIPTION_VALUE, SET_ACTIVE_TAB } from "../actions/blueprintPage";

const blueprintPage = (state = [], action) => {
  switch (action.type) {
    case SET_EDIT_DESCRIPTION_VISIBLE:
      return Object.assign({}, state, { editDescriptionVisible: action.payload.visible });
    case SET_EDIT_DESCRIPTION_VALUE:
      return Object.assign({}, state, { editDescriptionValue: action.payload.value });
    case SET_ACTIVE_TAB:
      return Object.assign({}, state, { activeTab: action.payload.activeTab });
    default:
      return state;
  }
};

export default blueprintPage;
