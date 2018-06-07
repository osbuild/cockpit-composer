import { combineReducers } from 'redux';
import blueprints from './blueprints';
import blueprintPage from './blueprintPage';
import inputs from './inputs';
import modals from './modals';
import sort from './sort';
import filter from './filter';

const rootReducer = combineReducers({
  blueprints,
  blueprintPage,
  inputs,
  modals,
  sort,
  filter
});

export default rootReducer;
