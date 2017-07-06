export const FETCHING_USERS = 'FETCHING_USERS';
export const fetchingUsers = () => ({
  type: FETCHING_USERS,
});

export const FETCHING_USERS_SUCCEEDED = 'FETCHING_USERS_SUCCEEDED';
export const fetchingUsersSucceeded = (users) => ({
  type: FETCHING_USERS_SUCCEEDED,
  payload: {
    users,
  },
});

export const FETCHING_USERS_FAILED = 'FETCHING_USERS_FAILED';
export const fetchingUsersFailed = (error) => ({
  type: FETCHING_USERS_FAILED,
  payload: {
    error,
  },
});
