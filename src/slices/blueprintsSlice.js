import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import * as api from "../api";

export const blueprintsAdapter = createEntityAdapter({
  // the id for each blueprint is the blueprint name
  selectId: (blueprint) => blueprint.name,
});

const initialState = blueprintsAdapter.getInitialState({});

export const createBlueprint = createAsyncThunk(
  "blueprints/create",
  async (blueprint) => {
    await api.createBlueprint(blueprint);
    return blueprint;
  }
);

export const createBlueprintTOML = createAsyncThunk(
  "blueprints/createTOML",
  async (blueprint, { dispatch }) => {
    await api.createBlueprintTOML(blueprint);
    dispatch(fetchBlueprints());
  }
);

export const updateBlueprint = createAsyncThunk(
  "blueprints/update",
  async (blueprint) => {
    await api.createBlueprint(blueprint);
    return blueprint;
  }
);

export const fetchBlueprints = createAsyncThunk(
  "blueprints/fetchAll",
  async () => {
    const names = await api.getBlueprintsNames();
    const blueprints = await api.getBlueprintsInfo(names);
    return blueprints;
  }
);

export const depsolveBlueprint = createAsyncThunk(
  "blueprints/depsolve",
  async (blueprintName) => {
    const response = await api.depsolveBlueprint(blueprintName);
    const blueprint = response.blueprints[0].blueprint;
    const dependencies = response.blueprints[0].dependencies;
    const packages = blueprint.packages.map((pkg) =>
      response.blueprints[0].dependencies.find((dep) => dep.name === pkg.name)
    );
    blueprint.packages = packages;
    blueprint.dependencies = dependencies;
    return blueprint;
  }
);

export const deleteBlueprint = createAsyncThunk(
  "blueprints/delete",
  async (blueprintName) => {
    await api.deleteBlueprint(blueprintName);
    return blueprintName;
  }
);

const blueprintsSlice = createSlice({
  name: "blueprints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createBlueprint.fulfilled, blueprintsAdapter.addOne);
    builder.addCase(fetchBlueprints.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(fetchBlueprints.fulfilled, (state, action) => {
      state.fetching = false;
      blueprintsAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(updateBlueprint.fulfilled, blueprintsAdapter.upsertOne);
    builder.addCase(depsolveBlueprint.fulfilled, blueprintsAdapter.upsertOne);
    builder.addCase(deleteBlueprint.fulfilled, blueprintsAdapter.removeOne);
  },
});

export default blueprintsSlice.reducer;

// Can create a set of memoized selectors based on the location of this entity state
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllBlueprints,
  selectById: selectBlueprintByName,
  selectIds: selectAllBlueprintNames,
} = blueprintsAdapter.getSelectors((state) => state.blueprints);

const filterBlueprints = (blueprints, { key, value }) =>
  blueprints.filter((blueprint) => blueprint[key].includes(value));

const sortBlueprints = (blueprints, { sortBy, isSortAscending }) =>
  blueprints.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return isSortAscending ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return isSortAscending ? 1 : -1;
    }
    return 0;
  });

export const selectBlueprintsFiltered = createSelector(
  selectAllBlueprints,
  (_, args) => args,
  filterBlueprints
);

export const selectBlueprintsFilteredAndSorted = createSelector(
  selectBlueprintsFiltered,
  (_, args) => args,
  sortBlueprints
);
