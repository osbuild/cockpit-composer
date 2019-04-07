import {
  SET_MODAL_ACTIVE,
  SET_MODAL_EXPORT_BLUEPRINT_NAME,
  SET_MODAL_EXPORT_BLUEPRINT_CONTENTS,
  SET_MODAL_EXPORT_BLUEPRINT_VISIBLE,
  SET_MODAL_DELETE_BLUEPRINT_NAME,
  SET_MODAL_DELETE_BLUEPRINT_ID,
  SET_MODAL_DELETE_BLUEPRINT_VISIBLE,
  SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE,
  SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT,
  SET_MODAL_DELETE_IMAGE_VISIBLE,
  SET_MODAL_DELETE_IMAGE_STATE,
  SET_MODAL_STOP_BUILD_VISIBLE,
  SET_MODAL_STOP_BUILD_STATE,
  SET_MODAL_CREATE_USER_VISIBLE,
  SET_MODAL_CREATE_USER_DATA,
  SET_MODAL_MANAGE_SOURCES_VISIBLE,
  SET_MODAL_MANAGE_SOURCES_CONTENTS,
  MODAL_MANAGE_SOURCES_FAILURE
} from "../actions/modals";

const modalCreateBlueprint = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE:
      return Object.assign({}, state, {
        createBlueprint: Object.assign({}, state.createBlueprint, { errorInline: action.payload.errorInline })
      });
    case SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT:
      return Object.assign({}, state, {
        createBlueprint: Object.assign({}, state.createBlueprint, { blueprint: action.payload.blueprint })
      });
    default:
      return state;
  }
};

const modalStopBuild = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_STOP_BUILD_STATE:
      return Object.assign({}, state, {
        stopBuild: Object.assign({}, state.stopBuild, {
          composeId: action.payload.composeId,
          blueprintName: action.payload.blueprintName
        })
      });
    case SET_MODAL_STOP_BUILD_VISIBLE:
      return Object.assign({}, state, {
        stopBuild: Object.assign({}, state.stopBuild, { visible: action.payload.visible })
      });
    default:
      return state;
  }
};

const modalDeleteImage = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_DELETE_IMAGE_STATE:
      return Object.assign({}, state, {
        deleteImage: Object.assign({}, state.deleteImage, {
          composeId: action.payload.composeId,
          blueprintName: action.payload.blueprintName
        })
      });
    case SET_MODAL_DELETE_IMAGE_VISIBLE:
      return Object.assign({}, state, {
        deleteImage: Object.assign({}, state.deleteImage, { visible: action.payload.visible })
      });
    default:
      return state;
  }
};

const modalDeleteBlueprint = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_DELETE_BLUEPRINT_NAME:
      return Object.assign({}, state, {
        deleteBlueprint: Object.assign({}, state.deleteBlueprint, { name: action.payload.blueprintName })
      });
    case SET_MODAL_DELETE_BLUEPRINT_ID:
      return Object.assign({}, state, {
        deleteBlueprint: Object.assign({}, state.deleteBlueprint, { id: action.payload.blueprintId })
      });
    case SET_MODAL_DELETE_BLUEPRINT_VISIBLE:
      return Object.assign({}, state, {
        deleteBlueprint: Object.assign({}, state.deleteBlueprint, { visible: action.payload.visible })
      });
    default:
      return state;
  }
};

const modalExportBlueprint = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_EXPORT_BLUEPRINT_NAME:
      return Object.assign({}, state, {
        exportBlueprint: Object.assign({}, state.exportBlueprint, { name: action.payload.blueprintName })
      });
    case SET_MODAL_EXPORT_BLUEPRINT_CONTENTS:
      return Object.assign({}, state, {
        exportBlueprint: Object.assign({}, state.exportBlueprint, { contents: action.payload.blueprintContents })
      });
    case SET_MODAL_EXPORT_BLUEPRINT_VISIBLE:
      return Object.assign({}, state, {
        exportBlueprint: Object.assign({}, state.exportBlueprint, { visible: action.payload.visible })
      });
    default:
      return state;
  }
};

const modalUserAccount = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_CREATE_USER_VISIBLE:
      return Object.assign({}, state, {
        userAccount: Object.assign({}, state.userAccount, { visible: action.payload.visible })
      });
    case SET_MODAL_CREATE_USER_DATA:
      return Object.assign({}, state, {
        userAccount: Object.assign({}, state.userAccount, action.payload.data)
      });
    default:
      return state;
  }
};

const modalManageSources = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_MANAGE_SOURCES_CONTENTS:
      return Object.assign({}, state, {
        manageSources: Object.assign({}, state.manageSources, {
          sources: action.payload.sources.sources,
          error: action.payload.sources.errors
        })
      });
    case SET_MODAL_MANAGE_SOURCES_VISIBLE:
      return Object.assign({}, state, {
        manageSources: Object.assign({}, state.manageSources, { visible: action.payload.visible })
      });
    case MODAL_MANAGE_SOURCES_FAILURE:
      return Object.assign({}, state, {
        manageSources: Object.assign({}, state.manageSources, { error: action.payload.error })
      });
    default:
      return state;
  }
};

const modals = (state = [], action) => {
  switch (action.type) {
    case SET_MODAL_ACTIVE:
      return Object.assign({}, state, { modalActive: action.payload.modalActive });
    case SET_MODAL_CREATE_BLUEPRINT_ERROR_INLINE:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_CREATE_BLUEPRINT_BLUEPRINT:
      return modalCreateBlueprint(state, action);
    case SET_MODAL_DELETE_BLUEPRINT_NAME:
      return modalDeleteBlueprint(state, action);
    case SET_MODAL_DELETE_BLUEPRINT_ID:
      return modalDeleteBlueprint(state, action);
    case SET_MODAL_DELETE_BLUEPRINT_VISIBLE:
      return modalDeleteBlueprint(state, action);
    case SET_MODAL_STOP_BUILD_STATE:
      return modalStopBuild(state, action);
    case SET_MODAL_STOP_BUILD_VISIBLE:
      return modalStopBuild(state, action);
    case SET_MODAL_DELETE_IMAGE_STATE:
      return modalDeleteImage(state, action);
    case SET_MODAL_DELETE_IMAGE_VISIBLE:
      return modalDeleteImage(state, action);
    case SET_MODAL_EXPORT_BLUEPRINT_NAME:
      return modalExportBlueprint(state, action);
    case SET_MODAL_EXPORT_BLUEPRINT_CONTENTS:
      return modalExportBlueprint(state, action);
    case SET_MODAL_EXPORT_BLUEPRINT_VISIBLE:
      return modalExportBlueprint(state, action);
    case SET_MODAL_CREATE_USER_VISIBLE:
      return modalUserAccount(state, action);
    case SET_MODAL_CREATE_USER_DATA:
      return modalUserAccount(state, action);
    case SET_MODAL_MANAGE_SOURCES_CONTENTS:
      return modalManageSources(state, action);
    case SET_MODAL_MANAGE_SOURCES_VISIBLE:
      return modalManageSources(state, action);
    case MODAL_MANAGE_SOURCES_FAILURE:
      return modalManageSources(state, action);
    default:
      return state;
  }
};

export default modals;
