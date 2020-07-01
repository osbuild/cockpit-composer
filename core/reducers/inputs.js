import {
  FETCHING_INPUTS_SUCCEEDED,
  FETCHING_FILTER_NO_RESULTS,
  SET_SELECTED_INPUT_PAGE,
  CLEAR_SELECTED_INPUT,
  SET_SELECTED_INPUT,
  SET_SELECTED_INPUT_PARENT,
  SET_SELECTED_INPUT_DEPS,
  SET_DEP_DETAILS,
  DELETE_FILTER,
} from "../actions/inputs";

const inputs = (state = [], action) => {
  switch (action.type) {
    case FETCHING_INPUTS_SUCCEEDED:
      return {
        ...state,
        inputFilters: action.payload.filter,
        inputComponents:
          action.payload.selectedInputPage > 0
            ? state.inputComponents
                .slice(0, action.payload.selectedInputPage)
                .concat(
                  [action.payload.inputs].concat(
                    Array(
                      Math.ceil(action.payload.total / action.payload.pageSize - 1) - action.payload.selectedInputPage
                    ).fill([])
                  )
                )
            : [action.payload.inputs].concat(
                Array(Math.ceil(action.payload.total / action.payload.pageSize - 1)).fill([])
              ),
        totalInputs: action.payload.total,
        pageSize: action.payload.pageSize,
      };
    case FETCHING_FILTER_NO_RESULTS:
      return {
        ...state,
        inputFilters: action.payload.filter,
        inputComponents: [[]],
        totalInputs: 0,
        pageSize: action.payload.pageSize,
      };
    case SET_SELECTED_INPUT_PAGE:
      return { ...state, selectedInputPage: action.payload.selectedInputPage };
    case CLEAR_SELECTED_INPUT:
      return {
        ...state,
        selectedInput: {
          ...state.selectedInput,
          set: false,
          component: {
            name: undefined,
            dependencies: undefined,
          },
          parent: [],
        },
      };
    case SET_SELECTED_INPUT:
      return {
        ...state,
        selectedInput: {
          ...state.selectedInput,
          set: true,
          // if same component, keep it and just add additional properties
          component:
            state.selectedInput.component.name === action.payload.selectedInput.name
              ? { ...state.selectedInput.component, ...action.payload.selectedInput }
              : { ...action.payload.selectedInput },
        },
      };
    case SET_SELECTED_INPUT_DEPS:
      return {
        ...state,
        selectedInput: {
          ...state.selectedInput,
          component: { ...state.selectedInput.component, dependencies: action.payload.dependencies },
        },
      };
    case SET_DEP_DETAILS:
      return {
        ...state,
        selectedInput: {
          ...state.selectedInput,
          component: {
            ...state.selectedInput.component,
            dependencies: [
              ...state.selectedInput.component.dependencies.map((dep) => {
                if (dep.name === action.payload.depDetails.name) {
                  return { ...dep, ...action.payload.depDetails };
                }
                return dep;
              }),
            ],
          },
        },
      };
    case SET_SELECTED_INPUT_PARENT:
      return {
        ...state,
        selectedInput: { ...state.selectedInput, parent: action.payload.selectedInputParent },
      };
    case DELETE_FILTER:
      return {
        ...state,
        inputComponents: undefined,
        totalInputs: 0,
        selectedInputPage: 0,
        inputFilters: {
          field: "name",
          value: "",
        },
      };
    default:
      return state;
  }
};

export default inputs;
