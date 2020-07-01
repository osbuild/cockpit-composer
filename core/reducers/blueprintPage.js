import {
  SET_EDIT_DESCRIPTION_VISIBLE,
  SET_EDIT_HOSTNAME_VISIBLE,
  SET_EDIT_HOSTNAME_INVALID,
} from "../actions/blueprintPage";

const blueprintPage = (state = [], action) => {
  switch (action.type) {
    case SET_EDIT_DESCRIPTION_VISIBLE:
      return { ...state, editDescriptionVisible: action.payload.visible };
    case SET_EDIT_HOSTNAME_VISIBLE:
      return { ...state, editHostnameVisible: action.payload.visible };
    case SET_EDIT_HOSTNAME_INVALID:
      return { ...state, editHostnameInvalid: action.payload.invalid };
    default:
      return state;
  }
};

export default blueprintPage;
