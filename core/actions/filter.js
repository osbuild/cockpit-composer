export const COMPONENTS_FILTER_ADD_VALUE = 'COMPONENTS_FILTER_ADD_VALUE';
export const componentsFilterAddValue = (filter) => ({
  type: COMPONENTS_FILTER_ADD_VALUE,
  payload: {
    filter,
  },
});

export const COMPONENTS_FILTER_REMOVE_VALUE = 'COMPONENTS_FILTER_REMOVE_VALUE';
export const componentsFilterRemoveValue = (filter) => ({
  type: COMPONENTS_FILTER_REMOVE_VALUE,
  payload: {
    filter,
  },
})

export const COMPONENTS_FILTER_CLEAR_VALUES = 'COMPONENTS_FILTER_CLEAR_VALUES';
export const componentsFilterClearValues = () => ({
  type: COMPONENTS_FILTER_CLEAR_VALUES,
})

export const BLUEPRINTS_FILTER_ADD_VALUE = 'BLUEPRINTS_FILTER_ADD_VALUE';
export const blueprintsFilterAddValue = (filter) => ({
  type: BLUEPRINTS_FILTER_ADD_VALUE,
  payload: {
    filter,
  },
});

export const BLUEPRINTS_FILTER_REMOVE_VALUE = 'BLUEPRINTS_FILTER_REMOVE_VALUE';
export const blueprintsFilterRemoveValue = (filter) => ({
  type: BLUEPRINTS_FILTER_REMOVE_VALUE,
  payload: {
    filter,
  },
});

export const BLUEPRINTS_FILTER_CLEAR_VALUES = 'BLUEPRINTS_FILTER_CLEAR_VALUES';
export const blueprintsFilterClearValues = () => ({
  type: BLUEPRINTS_FILTER_CLEAR_VALUES,
});
