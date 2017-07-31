import { REHYDRATE } from 'redux-persist/constants';

const rehydrated = (state = [], action) => {
  switch (action.type) {
    case REHYDRATE:
      return true;
    default:
      return state;
  }
};

export default rehydrated;
