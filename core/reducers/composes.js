import {
  FETCHING_COMPOSE_TYPES_SUCCEEDED,
  FETCHING_COMPOSE_SUCCEEDED,
  FETCHING_COMPOSE_STATUS_SUCCEEDED,
  COMPOSES_FAILURE,
  DELETING_COMPOSE_SUCCEEDED,
  DELETING_COMPOSE_FAILURE,
  CANCELLING_COMPOSE,
  CANCELLING_COMPOSE_SUCCEEDED,
  CANCELLING_COMPOSE_FAILURE,
  FETCHING_QUEUE_SUCCEEDED,
  CLEAR_QUEUE,
} from "../actions/composes";

function removeCompose(array, composeId) {
  return array.filter((compose) => compose.id !== composeId);
}

const compose = (state = [], action) => {
  switch (action.type) {
    case FETCHING_COMPOSE_TYPES_SUCCEEDED:
      return { ...state, composeTypes: action.payload.composeTypes };
    case FETCHING_COMPOSE_STATUS_SUCCEEDED:
      // Check composes for one that matches the id then replace it with its up-to-date version
      return {
        ...state,
        composeList: [
          ...state.composeList.map((compose) =>
            compose.id === action.payload.compose.id
              ? action.payload.compose
              : compose
          ),
        ],
      };
    case FETCHING_COMPOSE_SUCCEEDED:
      // Remove any instance of the compose and append the new one to the array
      return {
        ...state,
        fetchingComposes: false,
        composeList: removeCompose(
          state.composeList,
          action.payload.compose.id
        ).concat(action.payload.compose),
      };
    case FETCHING_QUEUE_SUCCEEDED:
      // Replace any existing queue with new queue
      return { ...state, queue: action.payload.queue, queueFetched: true };
    case CLEAR_QUEUE:
      return { ...state, queue: [], queueFetched: false };
    case COMPOSES_FAILURE:
      return {
        ...state,
        errorState: action.payload.error,
        fetchingComposes: false,
      };
    case DELETING_COMPOSE_SUCCEEDED:
      return {
        ...state,
        deleteStatus: action.payload.status,
        composeList: removeCompose(state.composeList, action.payload.composeId),
      };
    case DELETING_COMPOSE_FAILURE:
      return { ...state, errorState: action.payload.error };
    case CANCELLING_COMPOSE:
      return {
        ...state,
        composeList: [
          ...state.composeList.map((compose) => {
            if (compose.id === action.payload.composeId) {
              return { ...compose, queue_status: "STOPPING" };
            }
            return compose;
          }),
        ],
      };
    case CANCELLING_COMPOSE_SUCCEEDED:
      return {
        ...state,
        deleteStatus: action.payload.status,
        composeList: removeCompose(state.composeList, action.payload.composeId),
      };
    case CANCELLING_COMPOSE_FAILURE:
      return { ...state, errorState: action.payload.error };
    default:
      return state;
  }
};

export default compose;
