export const FETCHING_UPLOAD_PROVIDERS = "FETCHING_UPLOAD_PROVIDERS";
export const fetchingUploadProviders = () => ({
  type: FETCHING_UPLOAD_PROVIDERS,
});

export const FETCHING_UPLOAD_PROVIDERS_SUCCEEDED =
  "FETCHING_UPLOAD_PROVIDERS_SUCCEEDED";
export const fetchingUploadProvidersSucceeded = (providerSettings) => ({
  type: FETCHING_UPLOAD_PROVIDERS_SUCCEEDED,
  payload: {
    providerSettings,
  },
});
