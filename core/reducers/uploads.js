import { FETCHING_UPLOAD_PROVIDERS_SUCCEEDED } from "../actions/uploads";

const uploads = (state = [], action) => {
  switch (action.type) {
    case FETCHING_UPLOAD_PROVIDERS_SUCCEEDED:
      return Object.assign({}, state, {
        providerSettings: action.payload.providerSettings
      });
    default:
      return state;
  }
};

export default uploads;
