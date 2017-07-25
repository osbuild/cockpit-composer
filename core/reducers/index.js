import { combineReducers } from 'redux';
import states from './states';
import users from './users';
import recipes from './recipes';
import modalExportRecipe from './modals';

const rootReducer = combineReducers({
  states,
  users,
  recipes,
  modalExportRecipe,
});

export default rootReducer;
