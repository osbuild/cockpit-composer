import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, autoRehydrate } from 'redux-persist';
import rootReducer from './reducers/index';
import rootSaga from './sagas/index';

const sagaMiddleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const initialState = {
  rehydrated: false,
  blueprintPage: {
    activeTab: 'Details',
    editDescriptionVisible: 'false',
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
  blueprints : [],
  modals: {
    createImage: {
      imageTypes: [],
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
};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    autoRehydrate()
  )
);
sagaMiddleware.run(rootSaga);

persistStore(store, { whitelist: ['blueprintPage'] });

export default store;
