import {
  COMPONENTS_FILTER_ADD_VALUE, COMPONENTS_FILTER_REMOVE_VALUE, COMPONENTS_FILTER_CLEAR_VALUES,
  BLUEPRINTS_FILTER_ADD_VALUE, BLUEPRINTS_FILTER_REMOVE_VALUE, BLUEPRINTS_FILTER_CLEAR_VALUES
} from '../actions/filter';

const filtersWithNewFilter = (filters, filterValue) => {
  const index = filters.findIndex(filter => filter.key === filterValue.key);
  if (index === -1) {
    return [...filters, filterValue]
  } else {
    return [
      ...filters.slice(0, index),
      ...filters.slice(index + 1),
      filterValue
    ]
  }
};

const filtersWithRemovedFilter = (filters, filterValue) => {
  const index = filters.indexOf(filterValue);
  return [
    ...filters.slice(0, index),
    ...filters.slice(index + 1)
  ];
};

const updateFilters = (state, filters, filterList) => {
  return Object.assign({}, state,
    { [filterList]: Object.assign({}, state[filterList],
      { filterValues: filters })
    }
  );
};

const handlers = {

  [COMPONENTS_FILTER_ADD_VALUE]: (state, action) => {
    return updateFilters(state, filtersWithNewFilter(state.components.filterValues, action.payload.filter), 'components')
  },

  [COMPONENTS_FILTER_REMOVE_VALUE]: (state, action) => {
    return updateFilters(state, filtersWithRemovedFilter(state.components.filterValues, action.payload.filter), 'components')
  },

  [COMPONENTS_FILTER_CLEAR_VALUES]: (state) => {
    return updateFilters(state, [], 'components')
  },

  [BLUEPRINTS_FILTER_ADD_VALUE]: (state, action) => {
    return updateFilters(state, filtersWithNewFilter(state.components.filterValues, action.payload.filter), 'blueprints')
  },

  [BLUEPRINTS_FILTER_REMOVE_VALUE]: (state, action) => {
    return updateFilters(state, filtersWithRemovedFilter(state.components.filterValues, action.payload.filter), 'blueprints')
  },

  [BLUEPRINTS_FILTER_CLEAR_VALUES]: (state) => {
    return updateFilters(state, [], 'blueprints')
  },
};

const filter = (state = [], action) => {
  const handler = handlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
};

export default filter;
