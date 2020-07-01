import { createSelector } from "reselect";

const getPastLength = (blueprint) => {
  const pastLength = blueprint.past.length;
  return pastLength;
};

export const makeGetPastLength = () => createSelector([getPastLength], (pastLength) => pastLength);

const getFutureLength = (blueprint) => {
  const futureLength = blueprint.future.length;
  return futureLength;
};

export const makeGetFutureLength = () => createSelector([getFutureLength], (futureLength) => futureLength);

const getBlueprintById = (state, blueprintId) => {
  const blueprintById = state.blueprints.blueprintList.find((blueprint) => blueprint.present.id === blueprintId);
  return blueprintById;
};

export const makeGetBlueprintById = () => createSelector([getBlueprintById], (blueprint) => blueprint);

const getSortedSelectedComponents = (state, blueprint) => {
  const { components } = blueprint;
  if (components === undefined) {
    return [];
  }
  const sortedSelectedComponents = components.filter((component) => component.userSelected === true);
  const { key } = state.sort.components;
  const { value } = state.sort.components;
  sortedSelectedComponents.sort((a, b) => {
    if (a[key] > b[key]) return value === "DESC" ? 1 : -1;
    if (b[key] > a[key]) return value === "DESC" ? -1 : 1;
    return 0;
  });
  return sortedSelectedComponents;
};

export const makeGetSortedSelectedComponents = () =>
  createSelector([getSortedSelectedComponents], (selectedComponents) => selectedComponents);

const getSortedDependencies = (state, blueprint) => {
  const dependencies = blueprint.components;
  if (dependencies === undefined) {
    return [];
  }
  const sortedDependencies = dependencies.filter((dependency) => dependency.userSelected !== true);
  const { key } = state.sort.dependencies;
  const { value } = state.sort.dependencies;
  sortedDependencies.sort((a, b) => {
    if (a[key] > b[key]) return value === "DESC" ? 1 : -1;
    if (b[key] > a[key]) return value === "DESC" ? -1 : 1;
    return 0;
  });
  return sortedDependencies;
};

export const makeGetSortedDependencies = () => createSelector([getSortedDependencies], (dependencies) => dependencies);

const getFilteredComponents = (state, components) => {
  let filteredComponents = [];
  const filters = state.filter.components.filterValues;
  if (filters && filters.length !== 0) {
    filteredComponents = components.filter((component) => {
      return (
        filters.filter((filter) => {
          return !component[filter.key].includes(filter.value);
        }).length === 0
      );
    });
  } else {
    filteredComponents = components;
  }
  return filteredComponents;
};

export const makeGetFilteredComponents = () =>
  createSelector([getFilteredComponents], (filteredComponents) => filteredComponents);

const getSortedBlueprints = (state) => {
  const sortedBlueprints = state.blueprints.blueprintList;
  const { key } = state.sort.blueprints;
  const { value } = state.sort.blueprints;
  sortedBlueprints.sort((a, b) => {
    if (a.present[key] > b.present[key]) return value === "DESC" ? 1 : -1;
    if (b.present[key] > a.present[key]) return value === "DESC" ? -1 : 1;
    return 0;
  });
  return sortedBlueprints;
};

export const makeGetSortedBlueprints = () => createSelector([getSortedBlueprints], (blueprints) => blueprints);

const getFilteredBlueprints = (state, blueprints) => {
  let filteredBlueprints = [];
  const filters = state.filter.blueprints.filterValues;
  if (filters && filters.length !== 0) {
    filteredBlueprints = blueprints.filter((blueprint) => {
      return (
        filters.filter((filter) => {
          return !blueprint.present[filter.key].includes(filter.value);
        }).length === 0
      );
    });
  } else {
    filteredBlueprints = blueprints;
  }
  return filteredBlueprints;
};

export const makeGetFilteredBlueprints = () =>
  createSelector([getFilteredBlueprints], (filteredBlueprints) => filteredBlueprints);

const getBlueprintComposes = (state, blueprint) => {
  const composes = state.composes.composeList.filter((compose) => compose.blueprint === blueprint.name);
  composes.sort((a, b) => {
    return a.timestamp < b.timestamp ? 1 : -1;
  });

  return composes;
};

export const makeGetBlueprintComposes = () => createSelector([getBlueprintComposes], (composes) => composes);

const getSelectedInputs = (state, components) => {
  const { inputComponents } = state.inputs;
  const selectedComponent = state.inputs.selectedInput.component;
  if (components !== undefined && inputComponents !== undefined && inputComponents.length > 0) {
    inputComponents.forEach((input) => {
      input.inBlueprint = false; // eslint-disable-line no-param-reassign
      input.userSelected = false; // eslint-disable-line no-param-reassign
      input.active = false; // eslint-disable-line no-param-reassign
      if (selectedComponent.name !== undefined && input.name === selectedComponent.name) {
        input.active = true; // eslint-disable-line no-param-reassign
      }
      if (components.length > 0) {
        components.map((component) => {
          if (component.name === input.name) {
            input.inBlueprint = component.inBlueprint; // eslint-disable-line no-param-reassign
            input.userSelected = component.userSelected; // eslint-disable-line no-param-reassign
          }
        });
      }
    });
  }
  return inputComponents;
};

export const makeGetSelectedInputs = () => createSelector([getSelectedInputs], (inputComponents) => inputComponents);

const getSelectedDeps = (state, dependencies, components) => {
  if (components !== undefined && dependencies !== undefined && dependencies.length > 0) {
    dependencies.forEach((dep) => {
      dep.inBlueprint = false; // eslint-disable-line no-param-reassign
      dep.userSelected = false; // eslint-disable-line no-param-reassign
      if (components.length > 0) {
        components.map((component) => {
          if (component.name === dep.name) {
            dep.inBlueprint = component.inBlueprint; // eslint-disable-line no-param-reassign
            dep.userSelected = component.userSelected; // eslint-disable-line no-param-reassign
          }
        });
      }
    });
  }
  return dependencies;
};

export const makeGetSelectedDeps = () => createSelector([getSelectedDeps], (dependencies) => dependencies);
