import {
  FETCHING_COMPOSE_SUCCEEDED, FETCHING_COMPOSE_STATUS_SUCCEEDED, COMPOSES_FAILURE,
} from '../actions/composes';

function removeCompose(array, action) {
  return array.filter(compose => compose.id !== action.payload.compose.id);
}

const compose = (state = [], action) => {
  switch (action.type) {
    case FETCHING_COMPOSE_STATUS_SUCCEEDED:
      // Check composes for one that matches the id then replace it with its up-to-date version
      return Object.assign({}, state, {
        composeList: [
          ...state.composeList.map(compose => compose.id === action.payload.compose.id ? action.payload.compose : compose),
        ],
      });
    case FETCHING_COMPOSE_SUCCEEDED:
      // Remove any instance of the compose and append the new one to the array
      return Object.assign({}, state, {
        composeList: removeCompose(state.composeList, action).concat(action.payload.compose),
      });
    case COMPOSES_FAILURE:
      return Object.assign({}, state, {
        errorState: action.payload.error,
      });
    default:
      return state;
  }
};

export default compose;
