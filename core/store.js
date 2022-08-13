import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import createSagaMiddleware from "redux-saga";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers/index";
import rootSaga from "./sagas/index";

/* eslint-disable no-underscore-dangle */
/* eslint-enable */

const initialState = {
  alerts: [],
  blueprintPage: {
    editDescriptionVisible: false,
    editHostnameVisible: false,
  },
  inputs: {
    selectedInputPage: 0,
    pageSize: 50,
    selectedInput: {
      set: false,
      component: {
        dependencies: undefined,
      },
      parent: [],
      status: "",
    },
    inputFilters: {
      field: "name",
      value: "",
    },
  },
  blueprints: {
    blueprintList: [],
    fetchingBlueprints: true,
    errorState: undefined,
  },
  composes: {
    composeTypes: [],
    composeList: [],
    queue: [],
    queueFetched: false,
    fetchingComposes: true,
    errorState: null,
  },
  uploads: {
    providerSettings: {},
  },
  modals: {
    stopBuild: {
      composeId: "",
      blueprintName: "",
      visible: false,
    },
    deleteImage: {
      composeId: "",
      blueprintName: "",
      visible: false,
    },
    deleteBlueprint: {
      name: "",
      id: "",
      visible: false,
    },
    pendingChanges: {
      componentUpdates: {
        past: [],
        present: [],
        future: [],
      },
    },
    manageSources: {
      fetchingSources: true,
      sources: {},
      error: {},
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
      editUser: "",
    },
  },
  sort: {
    blueprints: {
      key: "name",
      value: "DESC",
    },
    components: {
      key: "name",
      value: "DESC",
    },
    dependencies: {
      key: "name",
      value: "DESC",
    },
  },
  filter: {
    blueprints: {
      filterValues: [],
      filterTypes: [
        {
          id: "name",
          title: "Name",
          placeholder: "Filter by name",
          filterType: "text",
        },
      ],
      defaultFilterType: "name",
    },
    components: {
      filterValues: [],
      filterTypes: [
        {
          id: "name",
          title: "Name",
          placeholder: "Filter by name",
          filterType: "text",
        },
        {
          id: "version",
          title: "Version",
          placeholder: "Filter by version",
          filterType: "text",
        },
        {
          id: "release",
          title: "Release",
          placeholder: "Filter by release",
          filterType: "text",
        },
      ],
      defaultFilterType: "name",
    },
  },
};

const sagaMiddleware = createSagaMiddleware();
const middleWareEnhancer = applyMiddleware(thunkMiddleware, sagaMiddleware);
const composedEnhancers = composeWithDevTools(middleWareEnhancer);

const store = createStore(rootReducer, initialState, composedEnhancers);
sagaMiddleware.run(rootSaga);

export default store;
