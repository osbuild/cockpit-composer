export const FETCHING_INPUTS = "FETCHING_INPUTS";
export const fetchingInputs = (filter, selectedInputPage, pageSize) => ({
  type: FETCHING_INPUTS,
  payload: {
    filter,
    selectedInputPage,
    pageSize
  }
});

export const FETCHING_INPUTS_SUCCEEDED = "FETCHING_INPUTS_SUCCEEDED";
export const fetchingInputsSucceeded = (filter, selectedInputPage, pageSize, inputs, total) => ({
  type: FETCHING_INPUTS_SUCCEEDED,
  payload: {
    filter,
    selectedInputPage,
    pageSize,
    inputs,
    total
  }
});

export const FETCHING_FILTER_NO_RESULTS = "FETCHING_FILTER_NO_RESULTS";
export const fetchingFilterNoResults = (filter, pageSize) => ({
  type: FETCHING_FILTER_NO_RESULTS,
  payload: {
    filter,
    pageSize
  }
});

export const FETCHING_INPUT_DETAILS = "FETCHING_INPUT_DETAILS";
export const fetchingInputDetails = component => ({
  type: FETCHING_INPUT_DETAILS,
  payload: {
    component
  }
});
export const FETCHING_INPUT_DEPS = "FETCHING_INPUT_DEPS";
export const fetchingInputDeps = component => ({
  type: FETCHING_INPUT_DEPS,
  payload: {
    component
  }
});
export const FETCHING_DEP_DETAILS = "FETCHING_DEP_DETAILS";
export const fetchingDepDetails = (component, blueprintId) => ({
  type: FETCHING_DEP_DETAILS,
  payload: {
    component,
    blueprintId
  }
});

export const SET_SELECTED_INPUT_PAGE = "SET_SELECTED_INPUT_PAGE";
export const setSelectedInputPage = selectedInputPage => ({
  type: SET_SELECTED_INPUT_PAGE,
  payload: {
    selectedInputPage
  }
});

export const SET_SELECTED_INPUT = "SET_SELECTED_INPUT";
export const setSelectedInput = selectedInput => ({
  type: SET_SELECTED_INPUT,
  payload: {
    selectedInput
  }
});

export const CLEAR_SELECTED_INPUT = "CLEAR_SELECTED_INPUT";
export const clearSelectedInput = () => ({
  type: CLEAR_SELECTED_INPUT
});

export const SET_SELECTED_INPUT_DEPS = "SET_SELECTED_INPUT_DEPS";
export const setSelectedInputDeps = dependencies => ({
  type: SET_SELECTED_INPUT_DEPS,
  payload: {
    dependencies
  }
});

export const SET_SELECTED_INPUT_PARENT = "SET_SELECTED_INPUT_PARENT";
export const setSelectedInputParent = selectedInputParent => ({
  type: SET_SELECTED_INPUT_PARENT,
  payload: {
    selectedInputParent
  }
});

export const SET_DEP_DETAILS = "SET_DEP_DETAILS";
export const setDepDetails = depDetails => ({
  type: SET_DEP_DETAILS,
  payload: {
    depDetails
  }
});

export const DELETE_FILTER = "DELETE_FILTER";
export const deleteFilter = () => ({
  type: DELETE_FILTER
});
