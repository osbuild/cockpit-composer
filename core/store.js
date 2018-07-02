import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/index';
import rootSaga from './sagas/index';

const sagaMiddleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const initialState = {
  blueprintPage: {
    activeTab: 'Details',
    editDescriptionVisible: false,
    activeComponent: '',
    activeComponentParent: '',
    activeComponentStatus: 'view',
  },
  inputs: {
    selectedInputPage: 0,
    pageSize: 50,
    selectedInput: {
      component: '',
      parent: '',
      status: '',
    },
    inputFilters: {
        field: 'name',
        value: '',
    },
  },
  blueprints: {
    errorState: null,
    fetchingBlueprints: true,
    blueprintList: [],
  },
  modals: {
    createImage: {
      name: '',
      imageTypes: [],
      visible: false,
    },
    exportBlueprint: {
      name: '',
      contents: [],
      visible: false,
    },
    deleteBlueprint: {
      name: '',
      id: '',
      visible: false,
    },
    createBlueprint: {
      showErrorName: false,
      showErrorDuplicate: false,
      inlineError: false,
      checkErrors: true,
      blueprint: {
        name: '',
        description: '',
        modules: [],
        packages: [],
      },
    },
    pendingChanges: {
      componentUpdates: {
        past: [],
        present: [],
        future: [],
      },
    },
  },
  sort: {
    blueprints: {
      key: 'name',
      value: 'DESC',
    },
    components: {
      key: 'name',
      value: 'DESC',
    },
    dependencies: {
      key: 'name',
      value: 'DESC',
    },
  },
  filter: {
    blueprints: {
      filterValues: [],
      filterTypes: [
        {
          id: 'name',
          title: 'Name',
          placeholder: 'Filter by Name',
          filterType: 'text'
        }
      ],
      defaultFilterType: 'name'
    },
    components: {
      filterValues: [],
      filterTypes: [
        {
          id: 'name',
          title: 'Name',
          placeholder: 'Filter by Name',
          filterType: 'text'
        },
        {
          id: 'version',
          title: 'Version',
          placeholder: 'Filter by Version',
          filterType: 'text'
        },
        {
          id: 'release',
          title: 'Release',
          placeholder: 'Filter by Release',
          filterType: 'text'
        }
      ],
      defaultFilterType: 'name'
    },
  },
};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
);
sagaMiddleware.run(rootSaga);

export default store;
