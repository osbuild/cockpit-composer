export const START_COMPOSE = "START_COMPOSE";
export const startCompose = (blueprintName, composeType) => ({
  type: START_COMPOSE,
  payload: {
    blueprintName,
    composeType
  }
});

export const START_COMPOSE_SUCCEEDED = "START_COMPOSE_SUCCEEDED";
export const startComposeSucceeded = (blueprintName, compose) => ({
  type: START_COMPOSE_SUCCEEDED,
  payload: {
    blueprintName,
    compose
  }
});

export const FETCHING_COMPOSES = "FETCHING_COMPOSES";
export const fetchingComposes = () => ({
  type: FETCHING_COMPOSES
});

export const FETCHING_QUEUE = "FETCHING_QUEUE";
export const fetchingQueue = () => ({
  type: FETCHING_QUEUE
});

export const FETCHING_COMPOSE_SUCCEEDED = "FETCHING_COMPOSE_SUCCEEDED";
export const fetchingComposeSucceeded = compose => ({
  type: FETCHING_COMPOSE_SUCCEEDED,
  payload: {
    compose
  }
});

export const FETCHING_COMPOSE_STATUS_SUCCEEDED = "FETCHING_COMPOSE_STATUS_SUCCEEDED";
export const fetchingComposeStatusSucceeded = compose => ({
  type: FETCHING_COMPOSE_STATUS_SUCCEEDED,
  payload: {
    compose
  }
});

export const FETCHING_QUEUE_SUCCEEDED = "FETCHING_QUEUE_SUCCEEDED";
export const fetchingQueueSucceeded = queue => ({
  type: FETCHING_QUEUE_SUCCEEDED,
  payload: {
    queue
  }
});
export const CLEAR_QUEUE = "CLEAR_QUEUE";
export const clearQueue = () => ({
  type: CLEAR_QUEUE
});

export const COMPOSES_FAILURE = "COMPOSES_FAILURE";
export const composesFailure = error => ({
  type: COMPOSES_FAILURE,
  payload: {
    error
  }
});

export const DELETING_COMPOSE = "DELETING_COMPOSE";
export const deletingCompose = composeId => ({
  type: DELETING_COMPOSE,
  payload: {
    composeId
  }
});

export const DELETING_COMPOSE_SUCCEEDED = "DELETING_COMPOSE_SUCCEEDED";
export const deletingComposeSucceeded = (status, composeId) => ({
  type: DELETING_COMPOSE_SUCCEEDED,
  payload: {
    status,
    composeId
  }
});

export const DELETING_COMPOSE_FAILURE = "DELETING_COMPOSE_FAILURE";
export const deletingComposeFailure = error => ({
  type: DELETING_COMPOSE_FAILURE,
  payload: {
    error
  }
});

export const CANCELLING_COMPOSE = "CANCELLING_COMPOSE";
export const cancellingCompose = composeId => ({
  type: CANCELLING_COMPOSE,
  payload: {
    composeId
  }
});

export const CANCELLING_COMPOSE_SUCCEEDED = "CANCELLING_COMPOSE_SUCCEEDED";
export const cancellingComposeSucceeded = (status, composeId) => ({
  type: CANCELLING_COMPOSE_SUCCEEDED,
  payload: {
    status,
    composeId
  }
});

export const CANCELLING_COMPOSE_FAILURE = "CANCELLING_COMPOSE_FAILURE";
export const cancellingComposeFailure = error => ({
  type: CANCELLING_COMPOSE_FAILURE,
  payload: {
    error
  }
});
