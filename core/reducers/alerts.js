import { ALERT_ADD, ALERT_DELETE } from "../actions/alerts";

const alerts = (state = [], action) => {
  switch (action.type) {
    case ALERT_ADD:
      return [
        ...state,
        {
          id: action.payload.id,
          type: action.payload.type,
          blueprintName: action.payload.blueprintName,
        },
      ];
    case ALERT_DELETE:
      return [...state.filter((alert) => alert.id !== action.payload.id)];
    default:
      return state;
  }
};

export default alerts;
