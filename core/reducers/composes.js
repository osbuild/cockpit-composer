import {
  FETCHING_COMPOSE_SUCCEEDED, FETCHING_COMPOSE_STATUS_SUCCEEDED,
} from '../actions/composes';

function removeItem(array, action) {
    return array.filter(compose => compose.id !== action.payload.compose.id);
}

const compose = (state = [], action) => {
  switch (action.type) {
    case FETCHING_COMPOSE_STATUS_SUCCEEDED:
      return removeItem(state, action).concat(action.payload.compose);
    case FETCHING_COMPOSE_SUCCEEDED:
      // We remove any instance of the compose and append the new one to the array
      return removeItem(state, action).concat(action.payload.compose);
    default:
      return state;
  }
};

export default compose;
