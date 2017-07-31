// gets picked up by recipes saga
export const FETCHING_INPUTS = 'FETCHING_INPUTS';
export const fetchingInputs = (filter, selectedInputPage, pageSize) => ({
  type: FETCHING_INPUTS,
  payload: {
    filter,
    selectedInputPage,
    pageSize,
  },
});

export const FETCHING_INPUTS_SUCCEEDED = 'FETCHING_INPUTS_SUCCEEDED';
export const fetchingInputsSucceeded = (filter, selectedInputPage, pageSize, inputComponents) => ({
  type: FETCHING_INPUTS_SUCCEEDED,
  payload: {
    filter,
    selectedInputPage,
    pageSize,
    inputComponents,
  },
});

export const SET_INPUT_COMPONENTS = 'SET_INPUT_COMPONENTS';
export const setInputComponents = (inputComponents) => ({
  type: SET_INPUT_COMPONENTS,
  payload: {
    inputComponents,
  },
});

export const SET_FILTERED_INPUT_COMPONENTS = 'SET_FILTERED_INPUT_COMPONENTS';
export const setFilteredInputComponents = (filteredInputComponents) => ({
  type: SET_FILTERED_INPUT_COMPONENTS,
  payload: {
    filteredInputComponents,
  },
});

export const SET_SELECTED_INPUT_PAGE = 'SET_SELECTED_INPUT_PAGE';
export const setSelectedInputPage = (selectedInputPage) => ({
  type: SET_SELECTED_INPUT_PAGE,
  payload: {
    selectedInputPage,
  },
});

export const SET_SELECTED_COMPONENT = 'SET_SELECTED_COMPONENT';
export const setSelectedComponent = (selectedComponent) => ({
  type: SET_SELECTED_COMPONENT,
  payload: {
    selectedComponent,
  },
});

export const SET_SELECTED_COMPONENT_STATUS = 'SET_SELECTED_COMPONENT_STATUS';
export const setSelectedComponentStatus = (selectedComponentStatus) => ({
  type: SET_SELECTED_COMPONENT_STATUS,
  payload: {
    selectedComponentStatus,
  },
});

export const SET_SELECTED_COMPONENT_PARENT = 'SET_SELECTED_COMPONENT_PARENT';
export const setSelectedComponentParent = (selectedComponentParent) => ({
  type: SET_SELECTED_COMPONENT_PARENT,
  payload: {
    selectedComponentParent,
  },
});

export const DELETE_FILTER = 'DELETE_FILTER';
export const deleteFilter = () => ({
  type: DELETE_FILTER,
});
