import { createSelector } from 'reselect';

const getPastLength = (blueprint) => {
  const pastLength = blueprint.past.length;
  return pastLength;
};

export const makeGetPastLength = () => createSelector(
  [getPastLength],
  (pastLength) => pastLength
);

const getFutureLength = (blueprint) => {
  const futureLength = blueprint.future.length;
  return futureLength;
};

export const makeGetFutureLength = () => createSelector(
  [getFutureLength],
  (futureLength) => futureLength
);

const getBlueprintById = (state, blueprintId) => {
  const blueprintById = state.blueprints.find(blueprint => blueprint.present.id === blueprintId);
  return blueprintById;
};

export const makeGetBlueprintById = () => createSelector(
  [getBlueprintById],
  (blueprint) => blueprint
);

const getSortedSelectedComponents = (state, blueprint) => {
  const selectedComponentNames = blueprint.packages.map(item => item.name);

  const components = blueprint.components;
  if (components === undefined) {
    return [];
  }

  const sortedSelectedComponents = components.filter(component => selectedComponentNames.includes(component.name));
  sortedSelectedComponents.map(component => {
    component.inBlueprint = true; // eslint-disable-line no-param-reassign
    component.user_selected = true;
  });
  const key = state.sort.components.key;
  const value = state.sort.components.value;
  sortedSelectedComponents.sort((a, b) => {
    if (a[key] > b[key]) return value === 'DESC' ? 1 : -1;
    if (b[key] > a[key]) return value === 'DESC' ? -1 : 1;
    return 0;
  });
  return sortedSelectedComponents;
};

export const makeGetSortedSelectedComponents = () => createSelector(
  [getSortedSelectedComponents],
  (selectedComponents) => selectedComponents
);

const getSortedDependencies = (state, blueprint) => {
  const selectedComponentNames = blueprint.packages.map(item => item.name);
  const dependencies = blueprint.components;
  if (dependencies === undefined) {
    return [];
  }

  const sortedDependencies = dependencies.filter(dependency => !selectedComponentNames.includes(dependency.name));
  sortedDependencies.map(dependency => {
    dependency.inBlueprint = true; // eslint-disable-line no-param-reassign
  });
  const key = state.sort.dependencies.key;
  const value = state.sort.dependencies.value;
  sortedDependencies.sort((a, b) => {
    if (a[key] > b[key]) return value === 'DESC' ? 1 : -1;
    if (b[key] > a[key]) return value === 'DESC' ? -1 : 1;
    return 0;
  });
  return sortedDependencies;
};

export const makeGetSortedDependencies = () => createSelector(
  [getSortedDependencies],
  (dependencies) => dependencies
);

const getSortedBlueprints = (state) => {
  const sortedBlueprints = state.blueprints;
  const key = state.sort.blueprints.key;
  const value = state.sort.blueprints.value;
  sortedBlueprints.sort((a, b) => {
    if (a.present[key] > b.present[key]) return value === 'DESC' ? 1 : -1;
    if (b.present[key] > a.present[key]) return value === 'DESC' ? -1 : 1;
    return 0;
  });
  return sortedBlueprints;
};

export const makeGetSortedBlueprints = () => createSelector(
  [getSortedBlueprints],
  (blueprints) => blueprints
);
