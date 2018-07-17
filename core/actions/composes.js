export const START_COMPOSE = 'START_COMPOSE';
export const startCompose = (blueprintName, composeType) => ({
  type: START_COMPOSE,
  payload: {
    blueprintName,
    composeType,
  },
});

export const START_COMPOSE_SUCCEEDED = 'START_COMPOSE_SUCCEEDED';
export const startComposeSucceeded = (blueprintName, compose) => ({
  type: START_COMPOSE_SUCCEEDED,
  payload: {
    blueprintName,
    compose,
  },
});

export const FETCHING_COMPOSE_SUCCEEDED = 'FETCHING_COMPOSE_SUCCEEDED';
export const fetchingComposeSucceeded = (compose) => ({
  type: FETCHING_COMPOSE_SUCCEEDED,
  payload: {
    compose,
  },
});

export const FETCHING_COMPOSE_STATUS_SUCCEEDED = 'FETCHING_COMPOSE_STATUS_SUCCEEDED';
export const fetchingComposeStatusSucceeded = (compose) => ({
  type: FETCHING_COMPOSE_STATUS_SUCCEEDED,
  payload: {
    compose,
  },
});

export const COMPOSES_FAILURE = 'COMPOSES_FAILURE';
export const composesFailure = (error) => ({
  type: COMPOSES_FAILURE,
  payload: {
    error,
  },
});
