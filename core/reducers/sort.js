import {
  RECIPES_SORT_SET_KEY,
  RECIPES_SORT_SET_VALUE,
  DEPENDENCIES_SORT_SET_KEY,
  DEPENDENCIES_SORT_SET_VALUE,
  COMPONENTS_SORT_SET_KEY,
  COMPONENTS_SORT_SET_VALUE,
} from '../actions/sort';

const sort = (state = [], action) => {
  switch (action.type) {
    case RECIPES_SORT_SET_KEY:
      return {
        ...state,
        recipes: {
          ...state.recipes,
          key: action.payload.key,
        },
      };
    case RECIPES_SORT_SET_VALUE:
      return {
        ...state,
        recipes: {
          ...state.recipes,
          value: action.payload.value,
        },
      };
    case COMPONENTS_SORT_SET_KEY:
      return {
        ...state,
        components: {
          ...state.components,
          key: action.payload.key,
        },
      };
    case COMPONENTS_SORT_SET_VALUE:
      return {
        ...state,
        components: {
          ...state.components,
          value: action.payload.value,
        },
      };
    case DEPENDENCIES_SORT_SET_KEY:
      return {
        ...state,
        dependencies: {
          ...state.dependencies,
          key: action.payload.key,
        },
      };
    case DEPENDENCIES_SORT_SET_VALUE:
      return {
        ...state,
        dependencies: {
          ...state.dependencies,
          value: action.payload.value,
        },
      };
    default:
      return state;
  }
};

export default sort;
