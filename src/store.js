import { configureStore } from "@reduxjs/toolkit";
import alertsReducer from "./slices/alertsSlice";
import blueprintsReducer from "./slices/blueprintsSlice";
import imagesReducer from "./slices/imagesSlice";
import sourcesReducer from "./slices/sourcesSlice";

export default configureStore({
  reducer: {
    alerts: alertsReducer,
    blueprints: blueprintsReducer,
    images: imagesReducer,
    sources: sourcesReducer,
  },
});
