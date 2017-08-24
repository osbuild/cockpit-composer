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
  recipePage: {
    activeTab: 'Details',
    editDescriptionVisible: 'false',
    selectedComponent: '',
    selectedComponentParent: '',
    selectedComponentStatus: 'view',
  },
  inputs: {
    selectedInputPage: 0,
    pageSize: 50,
    selectedInput: {
      component: '',
      parent: '',
      status: '',
    },
  },
  modals: {
    createComposition: {
      compositionTypes: [],
    },
    exportRecipe: {
      name: '',
      contents: [],
      visible: false,
    },
    createRecipe: {
      showErrorName: false,
      showErrorDuplicate: false,
      inlineError: false,
      checkErrors: true,
      recipe: {
        name: '',
        description: '',
        modules: [],
        packages: [],
      },
    },
  },
  sort: {
    recipes: {
      key: 'name',
      value: 'ASC',
    },
    components: {
      key: 'name',
      value: 'ASC',
    },
    dependencies: {
      key: 'name',
      value: 'ASC',
    },
  },
};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    autoRehydrate(),
  ),
);
sagaMiddleware.run(rootSaga);

persistStore(store, { whitelist: ['recipes', 'recipePage', 'inputs'] });

export default store;
