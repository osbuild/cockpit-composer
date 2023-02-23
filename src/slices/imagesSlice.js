import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import * as api from "../api";

export const imagesAdapter = createEntityAdapter({});

const initialState = imagesAdapter.getInitialState({
  types: [],
});

export const fetchImageTypes = createAsyncThunk(
  "images/fetchTypes",
  async () => {
    const imageTypes = await api.getImageTypes();
    return imageTypes.map((imageType) => imageType.name);
  }
);

export const fetchImage = createAsyncThunk("images/fetch", async (imageId) => {
  return await api.getImageStatus(imageId);
});

export const fetchAllImages = createAsyncThunk("images/fetchAll", async () => {
  return await api.getAllImageStatus();
});

export const createImage = createAsyncThunk(
  "images/create",
  async (args, { dispatch, rejectWithValue }) => {
    const { blueprintName, type, size, ostree, upload } = args;
    const sizeBytes = size * 1024 * 1024 * 1024;
    try {
      const response = await api.createImage(
        blueprintName,
        type,
        sizeBytes,
        ostree,
        upload
      );
      const imageId = response.build_id;
      dispatch(fetchImage(imageId));
      return blueprintName;
    } catch (error) {
      const msg = error?.body?.errors[0]?.msg;
      return rejectWithValue(msg);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "images/delete",
  async (imageId) => {
    await api.deleteImage(imageId);
    return imageId;
  }
);

export const stopImageBuild = createAsyncThunk(
  "images/stopBuild",
  async (imageId, { dispatch }) => {
    await api.cancelImage(imageId);
    dispatch(fetchImage(imageId));
    return;
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchImageTypes.fulfilled, (state, action) => {
      state.types = action.payload;
    });
    builder.addCase(fetchAllImages.fulfilled, imagesAdapter.upsertMany);
    builder.addCase(deleteImage.fulfilled, imagesAdapter.removeOne);
    builder.addCase(fetchImage.fulfilled, imagesAdapter.upsertOne);
  },
});

export default imagesSlice.reducer;

export const selectAllImageTypes = (state) => state.images.types;

// Can create a set of memoized selectors based on the location of this entity state
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllImages,
  selectById: selectImageById,
  selectIds: selectAllImageIds,
} = imagesAdapter.getSelectors((state) => state.images);

const filterImages = (images, { key, value }) =>
  images.filter((image) => image[key] === value);

const sortImages = (images, { sortBy, isSortAscending }) =>
  images.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return isSortAscending ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return isSortAscending ? 1 : -1;
    }
    return 0;
  });

export const selectImagesFiltered = createSelector(
  selectAllImages,
  (_, args) => args,
  filterImages
);

export const selectImagesFilteredAndSorted = createSelector(
  selectImagesFiltered,
  (_, args) => args,
  sortImages
);
