export const BLUEPRINTS_SORT_SET_KEY = 'BLUEPRINTS_SORT_SET_KEY';
export const blueprintsSortSetKey = (key) => ({
  type: BLUEPRINTS_SORT_SET_KEY,
  payload: {
    key,
  },
});

export const BLUEPRINTS_SORT_SET_VALUE = 'BLUEPRINTS_SORT_SET_VALUE';
export const blueprintsSortSetValue = (value) => ({
  type: BLUEPRINTS_SORT_SET_VALUE,
  payload: {
    value,
  },
});

export const DEPENDENCIES_SORT_SET_KEY = 'DEPENDENCIES_SORT_SET_KEY';
export const dependenciesSortSetKey = (key) => ({
  type: DEPENDENCIES_SORT_SET_KEY,
  payload: {
    key,
  },
});

export const DEPENDENCIES_SORT_SET_VALUE = 'DEPENDENCIES_SORT_SET_VALUE';
export const dependenciesSortSetValue = (value) => ({
  type: DEPENDENCIES_SORT_SET_VALUE,
  payload: {
    value,
  },
});

export const COMPONENTS_SORT_SET_KEY = 'COMPONENTS_SORT_SET_KEY';
export const componentsSortSetKey = (key) => ({
  type: COMPONENTS_SORT_SET_KEY,
  payload: {
    key,
  },
});

export const COMPONENTS_SORT_SET_VALUE = 'COMPONENTS_SORT_SET_VALUE';
export const componentsSortSetValue = (value) => ({
  type: COMPONENTS_SORT_SET_VALUE,
  payload: {
    value,
  },
});
