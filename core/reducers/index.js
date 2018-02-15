import { combineReducers } from 'redux';
import states from './states';
import blueprints from './blueprints';
import blueprintPage from './blueprintPage';
import inputs from './inputs';
import modals from './modals';
import rehydrated from './rehydrated';
import sort from './sort';

const rootReducer = combineReducers({
  states,
  blueprints,
  blueprintPage,
  inputs,
  modals,
  rehydrated,
  sort,
});

export default rootReducer;
