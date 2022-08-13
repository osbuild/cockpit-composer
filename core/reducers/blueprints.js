import { combineReducers } from "redux";
import {
  CREATING_BLUEPRINT_SUCCEEDED,
  FETCHING_BLUEPRINTS,
  FETCHING_BLUEPRINTS_SUCCEEDED,
  FETCHING_BLUEPRINT_NAMES_SUCCEEDED,
  FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED,
  UPDATE_BLUEPRINT_COMPONENTS,
  SET_BLUEPRINT,
  SET_BLUEPRINT_USERS,
  SET_BLUEPRINT_USERS_SUCCEEDED,
  SET_BLUEPRINT_HOSTNAME,
  SET_BLUEPRINT_HOSTNAME_SUCCEEDED,
  SET_BLUEPRINT_DESCRIPTION,
  SET_BLUEPRINT_DESCRIPTION_SUCCEEDED,
  DELETING_BLUEPRINT_SUCCEEDED,
  BLUEPRINTS_FAILURE,
  BLUEPRINT_CONTENTS_FAILURE,
  RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED,
  SET_COMP_DEPS,
  BLUEPRINTS_UPDATED,
  BLUEPRINTS_ADDED,
  BLUEPRINTS_FETCHED,
} from "../actions/blueprints";

import { MODAL_MANAGE_SOURCES_FAILURE } from "../actions/modals";

const fetchingBlueprints = (state = false, action) => {
  switch (action.type) {
    case BLUEPRINTS_FETCHED:
      return false;
    case FETCHING_BLUEPRINTS:
      return true;
    case FETCHING_BLUEPRINT_NAMES_SUCCEEDED:
      // if 1 or more blueprints, fetching is true because we're still waiting on the contents)
      return action.payload.blueprints.length > 0;
    case FETCHING_BLUEPRINTS_SUCCEEDED:
    case MODAL_MANAGE_SOURCES_FAILURE:
    case BLUEPRINTS_FAILURE:
      return false;
    default:
      return state;
  }
};

const errorState = (state = null, action) => {
  switch (action.type) {
    case FETCHING_BLUEPRINTS:
    case FETCHING_BLUEPRINTS_SUCCEEDED:
      return null;
    case MODAL_MANAGE_SOURCES_FAILURE:
    case BLUEPRINTS_FAILURE:
      return action.payload.error;
    default:
      return state;
  }
};

const blueprintList = (state = [], action) => {
  switch (action.type) {
    case BLUEPRINTS_ADDED:
      // this logic can be removed once FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED is unneeded
      return state.some((blueprint) => blueprint.name === action.payload.blueprint.name)
        ? state
        : [...state, action.payload.blueprint];
    case BLUEPRINTS_UPDATED:
      return state.map((blueprint) => {
        if (blueprint.name === action.payload.blueprint.name) {
          return {
            ...blueprint,
            ...action.payload.blueprint,
          };
        }
        return blueprint;
      });
    // Above are useful for unified and should be kept post-cleanup
    // below is a temp workaround until sagas are removed
    case FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED:
      return state.some((blueprint) => blueprint.name === action.payload.blueprint.name)
        ? state.map((blueprint) => {
            if (blueprint.name === action.payload.blueprint.name) {
              return {
                ...blueprint,
                ...action.payload.blueprint,
              };
            }
            return blueprint;
          })
        : [...state, action.payload.blueprint];
    case CREATING_BLUEPRINT_SUCCEEDED:
      return [...state, action.payload.blueprint];
    // The following reducers filter the blueprint out of the state and add the new version if
    // the blueprint contains component data or is not found in the state
    case FETCHING_BLUEPRINTS_SUCCEEDED:
      return action.payload.blueprint.components !== undefined ||
        !state.some((blueprint) => blueprint.name === action.payload.blueprint.name)
        ? [...state.filter((blueprint) => blueprint.name !== action.payload.blueprint.name), action.payload.blueprint]
        : state;
    case BLUEPRINT_CONTENTS_FAILURE:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprintName) {
            return {
              ...blueprint,
              errorState: action.payload.error,
            };
          }
          return blueprint;
        }),
      ];
    case UPDATE_BLUEPRINT_COMPONENTS:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprintName) {
            return {
              ...blueprint,
              components: action.payload.components,
              packages: action.payload.packages,
              modules: action.payload.modules,
              localPendingChanges: action.payload.pendingChange,
              errorState: {},
            };
          }
          return blueprint;
        }),
      ];
    case RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprint.name) {
            return {
              ...blueprint,
              components: action.payload.blueprint.components,
              packages: action.payload.blueprint.packages,
              modules: action.payload.blueprint.modules,
              errorState: action.payload.blueprint.errorState,
            };
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprint.name) {
            return action.payload.blueprint;
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT_USERS:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprintName) {
            return {
              ...blueprint,
              customizations: { ...blueprint.customizations, user: action.payload.users },
            };
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT_USERS_SUCCEEDED:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprint.name) {
            return {
              ...blueprint,
              past: blueprint.past.map((pastBlueprint) => {
                return {
                  ...pastBlueprint,
                  version: action.payload.blueprint.version,
                  customizations: {
                    ...pastBlueprint.customizations,
                    user: action.payload.blueprint.customizations.user,
                  },
                };
              }),
              present: {
                ...blueprint.present,
                version: action.payload.blueprint.version,
                customizations: {
                  ...blueprint.present.customizations,
                  user: action.payload.blueprint.customizations.user,
                },
              },
              future: blueprint.future.map((futureBlueprint) => {
                return {
                  ...futureBlueprint,
                  version: action.payload.blueprint.version,
                  customizations: {
                    ...futureBlueprint.customizations,
                    user: action.payload.blueprint.customizations.user,
                  },
                };
              }),
            };
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT_HOSTNAME:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprint.name) {
            return {
              ...blueprint,
              customizations: { ...blueprint.customizations, hostname: action.payload.hostname },
            };
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT_HOSTNAME_SUCCEEDED:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprint.name) {
            return {
              ...blueprint,
              customizations: {
                ...blueprint.customizations,
                hostname: action.payload.blueprint.customizations.hostname,
              },
            };
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT_DESCRIPTION:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprint.name) {
            return {
              ...blueprint,
              description: action.payload.description,
            };
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT_DESCRIPTION_SUCCEEDED:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprint.name) {
            return {
              ...blueprint,
              past: blueprint.past.map((pastBlueprint) => {
                return {
                  ...pastBlueprint,
                  version: action.payload.blueprint.version,
                  description: action.payload.blueprint.description,
                };
              }),
              present: {
                ...blueprint.present,
                version: action.payload.blueprint.version,
                description: action.payload.blueprint.description,
              },
              future: blueprint.future.map((futureBlueprint) => {
                return {
                  ...futureBlueprint,
                  version: action.payload.blueprint.version,
                  description: action.payload.blueprint.description,
                };
              }),
            };
          }
          return blueprint;
        }),
      ];
    case DELETING_BLUEPRINT_SUCCEEDED:
      return state.filter((blueprint) => blueprint.name !== action.payload.blueprintName);
    case SET_COMP_DEPS:
      return [
        ...state.map((blueprint) => {
          if (blueprint.name === action.payload.blueprintName) {
            return {
              ...blueprint,
              components: [
                ...blueprint.components.map((component) => {
                  if (component.name === action.payload.component.name) {
                    return { ...component, dependencies: action.payload.component.dependencies };
                  }
                  return component;
                }),
              ],
            };
          }
          return blueprint;
        }),
      ];
    default:
      return state;
  }
};

const blueprints = combineReducers({
  fetchingBlueprints,
  errorState,
  blueprintList,
});

export default blueprints;
