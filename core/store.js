import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers/index";
import rootSaga from "./sagas/index";

const sagaMiddleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const initialState = {
  blueprintPage: {
    editDescriptionVisible: false,
    editHostnameVisible: false
  },
  inputs: {
    selectedInputPage: 0,
    pageSize: 50,
    selectedInput: {
      set: false,
      component: {
        dependencies: undefined
      },
      parent: [],
      status: ""
    },
    inputFilters: {
      field: "name",
      value: ""
    }
  },
  blueprints: {
    blueprintList: [],
    fetchingBlueprints: true,
    errorState: null
  },
  composes: {
    composeTypes: [],
    composeList: [],
    queue: [],
    queueFetched: false,
    fetchingComposes: true,
    errorState: null
  },
  uploads: {
    providerSettings: {}
  },
  modals: {
    stopBuild: {
      composeId: "",
      blueprintName: "",
      visible: false
    },
    deleteImage: {
      composeId: "",
      blueprintName: "",
      visible: false
    },
    deleteBlueprint: {
      name: "",
      id: "",
      visible: false
    },
    pendingChanges: {
      componentUpdates: {
        past: [],
        present: [],
        future: []
      }
    },
    manageSources: {
      fetchingSources: true,
      sources: {},
      error: {}
    },
    userAccount: {
      name: "",
      description: "",
      password: "",
      key: "",
      groups: [],
      showDuplicateUser: false,
      showInvalidName: false,
      showInvalidPassword: false,
      dynamicName: true,
      visible: false,
      editUser: ""
    }
  },
  sort: {
    blueprints: {
      key: "name",
      value: "DESC"
    },
    components: {
      key: "name",
      value: "DESC"
    },
    dependencies: {
      key: "name",
      value: "DESC"
    }
  },
  filter: {
    blueprints: {
      filterValues: [],
      filterTypes: [
        {
          id: "name",
          title: "Name",
          placeholder: "Filter by Name",
          filterType: "text"
        }
      ],
      defaultFilterType: "name"
    },
    components: {
      filterValues: [],
      filterTypes: [
        {
          id: "name",
          title: "Name",
          placeholder: "Filter by Name",
          filterType: "text"
        },
        {
          id: "version",
          title: "Version",
          placeholder: "Filter by Version",
          filterType: "text"
        },
        {
          id: "release",
          title: "Release",
          placeholder: "Filter by Release",
          filterType: "text"
        }
      ],
      defaultFilterType: "name"
    }
  }
};

const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);

export default store;
