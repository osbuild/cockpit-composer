import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export const alertsAdapter = createEntityAdapter({});

const initialState = alertsAdapter.getInitialState({});

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert: alertsAdapter.addOne,
    removeAlert: alertsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase("images/create/fulfilled", (state, action) => {
      alertsAdapter.addOne(state, {
        id: uuidv4(),
        type: "composeQueued",
        blueprintName: action.payload,
      });
    });
    builder.addCase("images/create/rejected", (state, action) => {
      alertsAdapter.addOne(state, {
        id: uuidv4(),
        type: "composeFailed",
        error: action.payload,
      });
    });
  },
});

export const { removeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;

// Can create a set of memoized selectors based on the location of this entity state
// Export the customized selectors for this adapter using `getSelectors`
export const { selectAll: selectAllAlerts, selectById: selectAlertByName } =
  alertsAdapter.getSelectors((state) => state.alerts);
