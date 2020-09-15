import { AUTHENTICATE_USER, LOGOUT_USER } from '../actions/user';

const initialState = {
  token: null,
  userId: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE_USER: {
      const { token, userId } = action.payload;
      return {
        token,
        userId,
      };
    }
    case LOGOUT_USER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default userReducer;
