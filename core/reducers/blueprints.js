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

const blueprints = (state = [], action) => {
  switch (action.type) {
    case CREATING_BLUEPRINT_SUCCEEDED:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.filter(blueprint => blueprint.present.id !== action.payload.blueprint.id),
          {
            past: [],
            present: Object.assign({}, action.payload.blueprint, {
              localPendingChanges: [],
              workspacePendingChanges: []
            }),
            future: []
          }
        ]
      });
    case FETCHING_BLUEPRINTS:
      return Object.assign({}, state, {
        fetchingBlueprints: true,
        errorState: null
      });
    case FETCHING_BLUEPRINT_NAMES_SUCCEEDED:
      return Object.assign({}, state, {
        fetchingBlueprints: false,
        blueprintNames: action.payload.blueprints
      });
    // The following reducers filter the blueprint out of the state and add the new version if
    // the blueprint contains component data or is not found in the state
    case FETCHING_BLUEPRINTS_SUCCEEDED:
      return action.payload.blueprint.components !== undefined ||
        !state.blueprintList.some(blueprint => blueprint.present.id === action.payload.blueprint.id)
        ? Object.assign({}, state, {
            fetchingBlueprints: false,
            blueprintNames: [],
            blueprintList: [
              ...state.blueprintList.filter(blueprint => blueprint.present.id !== action.payload.blueprint.id),
              {
                past: [],
                present: Object.assign({}, action.payload.blueprint, {
                  localPendingChanges: [],
                  workspacePendingChanges: []
                }),
                future: []
              }
            ]
          })
        : state;
    case BLUEPRINTS_FAILURE:
      return Object.assign({}, state, {
        errorState: action.payload.error,
        fetchingBlueprints: false
      });
    case FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.filter(blueprint => blueprint.present.id !== action.payload.blueprint.id),
          {
            past: action.payload.pastBlueprint,
            present: action.payload.blueprint,
            future: []
          }
        ]
      });
    case BLUEPRINT_CONTENTS_FAILURE:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
            if (blueprint.present.id === action.payload.blueprintId) {
              return Object.assign({}, blueprint, {
                present: Object.assign({}, blueprint.present, {
                  errorState: action.payload.error
                })
              });
            }
            return blueprint;
          })
        ]
      });
    case UPDATE_BLUEPRINT_COMPONENTS:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
            if (blueprint.present.id === action.payload.blueprintId) {
              return Object.assign({}, blueprint, {
                past: blueprint.past.concat([blueprint.present]),
                present: Object.assign({}, blueprint.present, {
                  components: action.payload.components,
                  packages: action.payload.packages,
                  modules: action.payload.modules,
                  localPendingChanges: action.payload.pendingChange
                }),
                future: []
              });
            }
            return blueprint;
          })
        ]
      });
    case RELOADING_BLUEPRINT_CONTENTS_SUCCEEDED:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
            if (blueprint.present.id === action.payload.blueprint.id) {
              return Object.assign({}, blueprint, {
                present: Object.assign({}, blueprint.present, {
                  components: action.payload.blueprint.components,
                  packages: action.payload.blueprint.packages,
                  modules: action.payload.blueprint.modules
                })
              });
            }
            return blueprint;
          })
        ]
      });
    case SET_BLUEPRINT:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
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
        ]
      });
    case SET_BLUEPRINT_COMMENT:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
            if (blueprint.present.id === action.payload.blueprint.id) {
              return Object.assign({}, blueprint, {
                present: Object.assign({}, blueprint.present, { comment: action.payload.comment })
              });
            }
            return blueprint;
          })
        ]
      });
    case SET_BLUEPRINT_USERS:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
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
        ]
      });
    case SET_BLUEPRINT_USERS_SUCCEEDED:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
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
        ]
      });
    case SET_BLUEPRINT_HOSTNAME:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
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
        ]
      });
    case SET_BLUEPRINT_HOSTNAME_SUCCEEDED:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
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
        ]
      });
    case SET_BLUEPRINT_DESCRIPTION:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
            if (blueprint.present.id === action.payload.blueprint.id) {
              return Object.assign({}, blueprint, {
                present: Object.assign({}, blueprint.present, {
                  description: action.payload.description
                })
              });
            }
            return blueprint;
          })
        ]
      });
    case SET_BLUEPRINT_DESCRIPTION_SUCCEEDED:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
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
        ]
      });
    case DELETING_BLUEPRINT_SUCCEEDED:
      return Object.assign({}, state, {
        blueprintList: state.blueprintList.filter(blueprint => blueprint.present.id !== action.payload.blueprintId)
      });
    case UNDO:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
            if (blueprint.present.id === action.payload.blueprintId) {
              return Object.assign({}, blueprint, {
                future: blueprint.future.concat([blueprint.present]),
                present: blueprint.past.pop()
              });
            }
            return blueprint;
          })
        ]
      });
    case REDO:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
            if (blueprint.present.id === action.payload.blueprintId) {
              return Object.assign({}, blueprint, {
                past: blueprint.past.concat([blueprint.present]),
                present: blueprint.future.pop()
              });
            }
            return blueprint;
          })
        ]
      });
    case DELETE_HISTORY:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
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
        ]
      });
    case SET_COMP_DEPS:
      return Object.assign({}, state, {
        blueprintList: [
          ...state.blueprintList.map(blueprint => {
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
        ]
      });
    default:
      return state;
  }
};

export default blueprints;
