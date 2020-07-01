import {
  SET_MODAL_ACTIVE,
  SET_MODAL_DELETE_IMAGE_VISIBLE,
  SET_MODAL_DELETE_IMAGE_STATE,
  SET_MODAL_STOP_BUILD_VISIBLE,
  SET_MODAL_STOP_BUILD_STATE,
  SET_MODAL_CREATE_USER_VISIBLE,
  SET_MODAL_CREATE_USER_DATA,
  SET_MODAL_MANAGE_SOURCES_CONTENTS,
  ADD_MODAL_MANAGE_SOURCES_ENTRY,
  REMOVE_MODAL_MANAGE_SOURCES_ENTRY,
  MODAL_MANAGE_SOURCES_FAILURE,
} from "../actions/modals";

const modalStopBuild = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_STOP_BUILD_STATE:
      return {
        ...state,
        stopBuild: {
          ...state.stopBuild,
          composeId: action.payload.composeId,
          blueprintName: action.payload.blueprintName,
        },
      };
    case SET_MODAL_STOP_BUILD_VISIBLE:
      return { ...state, stopBuild: { ...state.stopBuild, visible: action.payload.visible } };
    default:
      return state;
  }
};

const modalDeleteImage = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_DELETE_IMAGE_STATE:
      return {
        ...state,
        deleteImage: {
          ...state.deleteImage,
          composeId: action.payload.composeId,
          blueprintName: action.payload.blueprintName,
        },
      };
    case SET_MODAL_DELETE_IMAGE_VISIBLE:
      return { ...state, deleteImage: { ...state.deleteImage, visible: action.payload.visible } };
    default:
      return state;
  }
};

const modalUserAccount = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_CREATE_USER_VISIBLE:
      return { ...state, userAccount: { ...state.userAccount, visible: action.payload.visible } };
    case SET_MODAL_CREATE_USER_DATA:
      return { ...state, userAccount: { ...state.userAccount, ...action.payload.data } };
    default:
      return state;
  }
};

const modalManageSources = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_MANAGE_SOURCES_CONTENTS:
      return {
        ...state,
        manageSources: {
          ...state.manageSources,
          sources: action.payload.sources.sources,
          errors: action.payload.sources.errors,
          fetchingSources: false,
        },
      };
    case ADD_MODAL_MANAGE_SOURCES_ENTRY:
      return { ...state, manageSources: { ...state.manageSources, fetchingSources: true } };
    case REMOVE_MODAL_MANAGE_SOURCES_ENTRY:
      return { ...state, manageSources: { ...state.manageSources, fetchingSources: true } };
    case MODAL_MANAGE_SOURCES_FAILURE:
      return {
        ...state,
        manageSources: { ...state.manageSources, error: action.payload.error, fetchingSources: false },
      };
    default:
      return state;
  }
};

const modals = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_ACTIVE:
      return { ...state, modalActive: action.payload.modalActive };
    case SET_MODAL_STOP_BUILD_STATE:
      return modalStopBuild(state, action);
    case SET_MODAL_STOP_BUILD_VISIBLE:
      return modalStopBuild(state, action);
    case SET_MODAL_DELETE_IMAGE_STATE:
      return modalDeleteImage(state, action);
    case SET_MODAL_DELETE_IMAGE_VISIBLE:
      return modalDeleteImage(state, action);
    case SET_MODAL_CREATE_USER_VISIBLE:
      return modalUserAccount(state, action);
    case SET_MODAL_CREATE_USER_DATA:
      return modalUserAccount(state, action);
    case SET_MODAL_MANAGE_SOURCES_CONTENTS:
      return modalManageSources(state, action);
    case ADD_MODAL_MANAGE_SOURCES_ENTRY:
      return modalManageSources(state, action);
    case REMOVE_MODAL_MANAGE_SOURCES_ENTRY:
      return modalManageSources(state, action);
    case MODAL_MANAGE_SOURCES_FAILURE:
      return modalManageSources(state, action);
    default:
      return state;
  }
};

export default modals;
