import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import * as api from "../api";

export const sourcesAdapter = createEntityAdapter({
  // the id for each source is the source name
  selectId: (source) => source.name,
});

const initialState = sourcesAdapter.getInitialState({});

export const fetchSources = createAsyncThunk("sources/fetchAll", async () => {
  return await api.getAllSources();
});

export const createSource = createAsyncThunk(
  "sources/create",
  async (source) => {
    await api.createSource(source);
    return source;
  }
);

export const deleteSource = createAsyncThunk(
  "sources/delete",
  async (sourceName) => {
    await api.deleteSource(sourceName);
    return sourceName;
  }
);

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSources.fulfilled, sourcesAdapter.upsertMany);
    builder.addCase(createSource.fulfilled, sourcesAdapter.upsertOne);
    builder.addCase(deleteSource.fulfilled, sourcesAdapter.removeOne);
  },
});

export default sourcesSlice.reducer;

// Can create a set of memoized selectors based on the location of this entity state
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllSources,
  selectIds: selectAllSourceNames,
  selectById: selectSourceByName,
} = sourcesAdapter.getSelectors((state) => state.sources);
