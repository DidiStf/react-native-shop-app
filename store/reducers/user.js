import {
  ATTEMPT_AUTOLOGIN_USER,
  AUTHENTICATE_USER,
  LOGOUT_USER,
} from '../actions/user';

const initialState = {
  token: null,
  userId: null,
  attemptedAutologin: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ATTEMPT_AUTOLOGIN_USER: {
      return {
        ...state,
        attemptedAutologin: true,
      };
    }
    case AUTHENTICATE_USER: {
      const { token, userId } = action.payload;
      return {
        token,
        userId,
        attemptedAutologin: true,
      };
    }
    case LOGOUT_USER: {
      return {
        ...initialState,
        attemptedAutologin: true,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
