import {
  // FETCHING_INPUTS_SUCCEEDED,
  SET_SELECTED_INPUT_PAGE,
  SET_SELECTED_COMPONENT, SET_SELECTED_COMPONENT_STATUS, SET_SELECTED_COMPONENT_PARENT,
  SET_INPUT_COMPONENTS, SET_FILTERED_INPUT_COMPONENTS,
  DELETE_FILTER,
} from '../actions/inputs';

const inputs = (state = [], action) => {
  switch (action.type) {
    // case FETCHING_INPUTS_SUCCEEDED:
    //   const input = [action.payload.inputComponents[0]];
    //   const totalInputs = action.payload.inputComponents[1];
    //   const selectedInputPage = action.payload.selectedInputPage;
    //   const filter = action.payload.filter;
    //   const pageSize = action.payload.pageSize;
    //   const totalPages = Math.ceil((totalInputs / pageSize) - 1);
    //   const pagedInputs = selectedInputPage > 0
    //   ? state.inputComponents.slice(0, selectedInputPage)
    //     .concat(input.concat(Array(totalPages - selectedInputPage).fill([])))
    //   : input.concat(Array(totalPages).fill([]));
    //   if (action.payload.filter.value === '') {
    //     return {
    //       ...state,
    //       inputFilters: filter,
    //       inputComponents: pagedInputs,
    //       totalInputs,
    //       pageSize,
    //     };
    //   } else {
    //       return {
    //         ...state,
    //         inputFilters: filter,
    //         filteredInputComponents: pagedInputs,
    //         totalFilteredInputs: totalInputs,
    //         pageSize: pageSize,
    //       };
    //   }
    case SET_INPUT_COMPONENTS:
      return {
        ...state,
        inputComponents: action.payload.inputComponents,
      };
    case SET_FILTERED_INPUT_COMPONENTS:
      return {
        ...state,
        filteredInputComponents: action.payload.filteredInputComponents,
      };
    case SET_SELECTED_INPUT_PAGE:
      return {
        ...state,
        selectedInputPage: action.payload.selectedInputPage,
      };
    case SET_SELECTED_COMPONENT:
      return {
        ...state,
        selectedComponent: { ...state.selectedComponent, component: action.payload.selectedComponent },
      };
    case SET_SELECTED_COMPONENT_STATUS:
      return {
        ...state,
        selectedComponent: { ...state.selectedComponent, status: action.payload.selectedComponentStatus },
      };
    case SET_SELECTED_COMPONENT_PARENT:
      return {
        ...state,
        selectedComponent: { ...state.selectedComponent, parent: action.payload.selectedComponentParent },
      };
    case DELETE_FILTER:
      return {
        ...state,
        filteredInputComponents: [[]],
        totalFilteredInputs: 0,
        selectedInputPage: 0,
        inputFilters: [],
      };
    default:
      return state;
  }
};

export default inputs;
