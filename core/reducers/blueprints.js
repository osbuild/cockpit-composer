import { combineReducers } from "redux";
import {
  UNDO,
  REDO,
  DELETE_HISTORY,
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
  SET_BLUEPRINT_COMMENT,
  DELETING_BLUEPRINT_SUCCEEDED,
  BLUEPRINTS_FAILURE,
  BLUEPRINT_CONTENTS_FAILURE,
  RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED,
  SET_COMP_DEPS
} from "../actions/blueprints";

const fetchingBlueprints = (state = false, action) => {
  switch (action.type) {
    case FETCHING_BLUEPRINTS:
      return true;
    case FETCHING_BLUEPRINT_NAMES_SUCCEEDED:
      // if 1 or more blueprints, fetching is true because we're still waiting on the contents)
      return action.payload.blueprints.length > 0;
    case FETCHING_BLUEPRINTS_SUCCEEDED:
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
    case BLUEPRINTS_FAILURE:
      return action.payload.error;
    default:
      return state;
  }
};

const blueprintList = (state = [], action) => {
  switch (action.type) {
    case CREATING_BLUEPRINT_SUCCEEDED:
      return [
        ...state.filter(blueprint => blueprint.present.id !== action.payload.blueprint.id),
        {
          past: [],
          present: Object.assign({}, action.payload.blueprint, {
            localPendingChanges: [],
            workspacePendingChanges: []
          }),
          future: []
        }
      ];
    // The following reducers filter the blueprint out of the state and add the new version if
    // the blueprint contains component data or is not found in the state
    case FETCHING_BLUEPRINTS_SUCCEEDED:
      return action.payload.blueprint.components !== undefined ||
        !state.some(blueprint => blueprint.present.id === action.payload.blueprint.id)
        ? [
            ...state.filter(blueprint => blueprint.present.id !== action.payload.blueprint.id),
            {
              past: [],
              present: Object.assign({}, action.payload.blueprint, {
                localPendingChanges: [],
                workspacePendingChanges: []
              }),
              future: []
            }
          ]
        : state;
    case FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED:
      return [
        ...state.filter(blueprint => blueprint.present.id !== action.payload.blueprint.id),
        {
          past: action.payload.pastBlueprint,
          present: action.payload.blueprint,
          future: []
        }
      ];
    case BLUEPRINT_CONTENTS_FAILURE:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign({}, blueprint, {
              present: Object.assign({}, blueprint.present, {
                errorState: action.payload.error
              })
            });
          }
          return blueprint;
        })
      ];
    case UPDATE_BLUEPRINT_COMPONENTS:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign({}, blueprint, {
              past: blueprint.past.concat([blueprint.present]),
              present: Object.assign({}, blueprint.present, {
                components: action.payload.components,
                packages: action.payload.packages,
                modules: action.payload.modules,
                localPendingChanges: action.payload.pendingChange,
                errorState: {}
              }),
              future: []
            });
          }
          return blueprint;
        })
      ];
    case RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign({}, blueprint, {
              present: Object.assign({}, blueprint.present, {
                components: action.payload.blueprint.components,
                packages: action.payload.blueprint.packages,
                modules: action.payload.blueprint.modules,
                errorState: action.payload.blueprint.errorState
              })
            });
          }
          return blueprint;
        })
      ];
    case SET_BLUEPRINT:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign({}, blueprint, {
              past: [],
              present: Object.assign({}, action.payload.blueprint, {
                localPendingChanges: [],
                workspacePendingChanges: []
              }),
              future: []
            });
          }
          return blueprint;
        })
      ];
    case SET_BLUEPRINT_COMMENT:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign({}, blueprint, {
              present: Object.assign({}, blueprint.present, { comment: action.payload.comment })
            });
          }
          return blueprint;
        })
      ];
    case SET_BLUEPRINT_USERS:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign({}, blueprint, {
              present: Object.assign({}, blueprint.present, {
                customizations: Object.assign({}, blueprint.present.customizations, {
                  user: action.payload.users
                })
              })
            });
          }
          return blueprint;
        })
      ];
    case SET_BLUEPRINT_USERS_SUCCEEDED:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign({}, blueprint, {
              past: blueprint.past.map(pastBlueprint => {
                return Object.assign({}, pastBlueprint, {
                  version: action.payload.blueprint.version,
                  customizations: Object.assign({}, pastBlueprint.customizations, {
                    user: action.payload.blueprint.customizations.user
                  })
                });
              }),
              present: Object.assign({}, blueprint.present, {
                version: action.payload.blueprint.version,
                customizations: Object.assign({}, blueprint.present.customizations, {
                  user: action.payload.blueprint.customizations.user
                })
              }),
              future: blueprint.future.map(futureBlueprint => {
                return Object.assign({}, futureBlueprint, {
                  version: action.payload.blueprint.version,
                  customizations: Object.assign({}, futureBlueprint.customizations, {
                    user: action.payload.blueprint.customizations.user
                  })
                });
              })
            });
          }
          return blueprint;
        })
      ];
    case SET_BLUEPRINT_HOSTNAME:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign({}, blueprint, {
              present: Object.assign({}, blueprint.present, {
                customizations: Object.assign({}, blueprint.present.customizations, {
                  hostname: action.payload.hostname
                })
              })
            });
          }
          return blueprint;
        })
      ];
    case SET_BLUEPRINT_HOSTNAME_SUCCEEDED:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign({}, blueprint, {
              past: blueprint.past.map(pastBlueprint => {
                return Object.assign({}, pastBlueprint, {
                  version: action.payload.blueprint.version,
                  customizations: Object.assign({}, pastBlueprint.customizations, {
                    hostname: action.payload.blueprint.customizations.hostname
                  })
                });
              }),
              present: Object.assign({}, blueprint.present, {
                version: action.payload.blueprint.version,
                customizations: Object.assign({}, blueprint.present.customizations, {
                  hostname: action.payload.blueprint.customizations.hostname
                })
              }),
              future: blueprint.future.map(futureBlueprint => {
                return Object.assign({}, futureBlueprint, {
                  version: action.payload.blueprint.version,
                  customizations: Object.assign({}, futureBlueprint.customizations, {
                    hostname: action.payload.blueprint.customizations.hostname
                  })
                });
              })
            });
          }
          return blueprint;
        })
      ];
    case SET_BLUEPRINT_DESCRIPTION:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign({}, blueprint, {
              present: Object.assign({}, blueprint.present, {
                description: action.payload.description
              })
            });
          }
          return blueprint;
        })
      ];
    case SET_BLUEPRINT_DESCRIPTION_SUCCEEDED:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign({}, blueprint, {
              past: blueprint.past.map(pastBlueprint => {
                return Object.assign({}, pastBlueprint, {
                  version: action.payload.blueprint.version,
                  description: action.payload.blueprint.description
                });
              }),
              present: Object.assign({}, blueprint.present, {
                version: action.payload.blueprint.version,
                description: action.payload.blueprint.description
              }),
              future: blueprint.future.map(futureBlueprint => {
                return Object.assign({}, futureBlueprint, {
                  version: action.payload.blueprint.version,
                  description: action.payload.blueprint.description
                });
              })
            });
          }
          return blueprint;
        })
      ];
    case DELETING_BLUEPRINT_SUCCEEDED:
      return state.filter(blueprint => blueprint.present.id !== action.payload.blueprintId);
    case UNDO:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign({}, blueprint, {
              future: blueprint.future.concat([blueprint.present]),
              present: blueprint.past.pop()
            });
          }
          return blueprint;
        })
      ];
    case REDO:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign({}, blueprint, {
              past: blueprint.past.concat([blueprint.present]),
              present: blueprint.future.pop()
            });
          }
          return blueprint;
        })
      ];
    case DELETE_HISTORY:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign({}, blueprint, {
              present: Object.assign({}, blueprint.past.shift(), {
                localPendingChanges: [],
                workspacePendingChanges: []
              }),
              past: [],
              future: blueprint.future.concat([blueprint.present]).concat(blueprint.past.reverse())
            });
          }
          return blueprint;
        })
      ];
    case SET_COMP_DEPS:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign({}, blueprint, {
              present: Object.assign({}, blueprint.present, {
                components: [
                  ...blueprint.present.components.map(component => {
                    if (component.name === action.payload.component.name) {
                      return Object.assign({}, component, {
                        dependencies: action.payload.component.dependencies
                      });
                    }
                    return component;
                  })
                ]
              })
            });
          }
          return blueprint;
        })
      ];
    default:
      return state;
  }
};

const blueprints = combineReducers({
  fetchingBlueprints,
  errorState,
  blueprintList
});

export default blueprints;
