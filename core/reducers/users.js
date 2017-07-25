import {
  FETCHING_USERS_SUCCEEDED,
} from '../actions/users';

const users = (state = [], action) => {
  switch (action.type) {
    case FETCHING_USERS_SUCCEEDED:
      return [
        ...action.payload.users,
      ];
    default:
      return state;
  }
};

export default users;
