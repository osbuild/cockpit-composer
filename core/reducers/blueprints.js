import {
  UNDO, REDO, DELETE_HISTORY,
  CREATING_BLUEPRINT_SUCCEEDED,
  FETCHING_BLUEPRINTS_SUCCEEDED,
  FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED,
  ADD_BLUEPRINT_COMPONENT_SUCCEEDED, REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED,
  SET_BLUEPRINT, SET_BLUEPRINT_DESCRIPTION, SET_BLUEPRINT_COMMENT,
  DELETING_BLUEPRINT_SUCCEEDED,
} from '../actions/blueprints';

const blueprints = (state = [], action) => {
  switch (action.type) {
    case CREATING_BLUEPRINT_SUCCEEDED:
      return [
        ...state.filter(blueprint => blueprint.present.id !== action.payload.blueprint.id), {
          past: [],
          present: Object.assign({}, action.payload.blueprint,  {
            localPendingChanges: [],
            workspacePendingChanges: {addedChanges: [], deletedChanges: []}
          }),
          future: [],
        }
      ];
    // The following reducers filter the blueprint out of the state and add the new version if
    // the blueprint contains component data or is not found in the state
    case FETCHING_BLUEPRINTS_SUCCEEDED:
      return action.payload.blueprint.components !== undefined
      || !state.some(blueprint => blueprint.present.id === action.payload.blueprint.id)
      ? [...state.filter(blueprint => blueprint.present.id !== action.payload.blueprint.id), {
          past: [],
          present: Object.assign({}, action.payload.blueprint, {
            localPendingChanges: [],
            workspacePendingChanges: {addedChanges: [], deletedChanges: []}
          }),
          future: [],
        }]
      : state;
    case FETCHING_BLUEPRINT_CONTENTS_SUCCEEDED:
      return [
        ...state.filter(blueprint => blueprint.present.id !== action.payload.blueprintPresent.id), {
          past: action.payload.blueprintPast,
          present: action.payload.blueprintPresent,
          future: [],
        }
      ];
    case ADD_BLUEPRINT_COMPONENT_SUCCEEDED:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign(
              {}, blueprint, {
              past: blueprint.past.concat([blueprint.present]),
              present: Object.assign({}, blueprint.present, {
                components: action.payload.components,
                packages: action.payload.packages,
                localPendingChanges: blueprint.present.localPendingChanges.some((component) => {
                  return (component.componentNew === action.payload.pendingChange.componentOld && component.componentNew !== null)
                  || (component.componentOld === action.payload.pendingChange.componentNew && component.componentOld !== null)
                }) ? blueprint.present.localPendingChanges.filter((component) => {
                  return component.componentNew != action.payload.pendingChange.componentOld
                  || component.componentOld != action.payload.pendingChange.componentNew
                }) : [action.payload.pendingChange].concat(blueprint.present.localPendingChanges),
              }),
            });
          }
          return blueprint;
        }),
      ];
    case REMOVE_BLUEPRINT_COMPONENT_SUCCEEDED:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign(
              {}, blueprint, {
              past: blueprint.past.concat([blueprint.present]),
              present: Object.assign({}, blueprint.present, {
                components: action.payload.components,
                packages: action.payload.packages,
                localPendingChanges: blueprint.present.localPendingChanges.some((component) => {
                  return (component.componentNew === action.payload.pendingChange.componentOld && component.componentNew !== null)
                   || (component.componentOld === action.payload.pendingChange.componentNew && component.componentOld !== null)
                }) ? blueprint.present.localPendingChanges.filter((component) => {
                  return component.componentNew != action.payload.pendingChange.componentOld
                  || component.componentOld != action.payload.pendingChange.componentNew
                }) : [action.payload.pendingChange].concat(blueprint.present.localPendingChanges),
              }),
            });
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign(
              {}, blueprint, {
              past: [],
              present: Object.assign({}, action.payload.blueprint, {
                localPendingChanges: [],
                workspacePendingChanges: {addedChanges: [], deletedChanges: []}
              }),
              future: [],
            });
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT_COMMENT:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign(
              {}, blueprint, {
              present: Object.assign({}, blueprint.present, { comment: action.payload.comment }),
            });
          }
          return blueprint;
        }),
      ];
    case SET_BLUEPRINT_DESCRIPTION:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprint.id) {
            return Object.assign(
              {}, blueprint, {
              past: blueprint.past.concat([blueprint.present]),
              present: Object.assign({}, blueprint.present, { description: action.payload.description }),
            });
          }
          return blueprint;
        }),
      ];
    case DELETING_BLUEPRINT_SUCCEEDED:
      return state.filter(blueprint => blueprint.present.id !== action.payload.blueprintId);
    case UNDO:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign(
              {}, blueprint, {
              future: blueprint.future.concat([blueprint.present]),
              present: blueprint.past.pop(),
            });
          }
          return blueprint;
        }),
      ];
    case REDO:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign(
              {}, blueprint, {
              past: blueprint.past.concat([blueprint.present]),
              present: blueprint.future.pop(),
            });
          }
          return blueprint;
        }),
      ];
    case DELETE_HISTORY:
      return [
        ...state.map(blueprint => {
          if (blueprint.present.id === action.payload.blueprintId) {
            return Object.assign(
              {}, blueprint, {
              present: Object.assign({}, blueprint.past.shift(),  {
                localPendingChanges: [],
                workspacePendingChanges: {addedChanges: [], deletedChanges: []}
              }),
              past: [],
              future: [],
            });
          }
          return blueprint;
        }),
      ];
    default:
      return state;
  }
};

export default blueprints;
