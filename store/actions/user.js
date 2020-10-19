// A react-native api that uses a key-value storage on the device which is available on both ios and android
// where we can store data that persists across app relaunches
import { AsyncStorage } from 'react-native';

const ACTION_KEY = 'user';
const API_KEY = 'AIzaSyDupvjDBEYHapBO1jdPpcdmf1xj92aKW4k';
const API_SIGNUP_PATH = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
const API_LOGIN_PATH = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

export const AUTHENTICATE_USER = `${ACTION_KEY}/authenticate`;
export const LOGOUT_USER = `${ACTION_KEY}/logout`;
export const ATTEMPT_AUTOLOGIN_USER = `${ACTION_KEY}/attemptAutologinUser`;

let timer;

const saveDataToStorage = (token, userId, tokenExpirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token,
      userId,
      expiryDate: tokenExpirationDate.toISOString(),
    })
  );
};

const setLogoutTimer = (expirationTime) => (dispatch) => {
  timer = setTimeout(() => {
    dispatch(logoutUserAction());
  }, expirationTime);
};

const clearLogoutTimer = () => {
  if (timer) clearTimeout(timer);
};

export const authenticateUserAction = (userId, token, expiryTime) => (
  dispatch
) => {
  dispatch(setLogoutTimer(expiryTime));
  dispatch({
    type: AUTHENTICATE_USER,
    payload: { userId, token },
  });
};

export const signupUserAction = (email, password) => async (dispatch) => {
  const result = await fetch(API_SIGNUP_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  if (!result.ok) {
    const errorResponseData = await result.json();
    const errorMessage = errorResponseData.error.message;
    let customMessage = 'Something went wrong!';

    if (errorMessage === 'EMAIL_EXISTS') {
      customMessage = 'There is already an account with this email.';
    }
    throw new Error(customMessage);
  }

  const resData = await result.json();
  const { localId, idToken, expiresIn } = resData;
  const expiryTimeInMiliseconds = parseInt(expiresIn) * 1000;
  dispatch(authenticateUserAction(localId, idToken, expiryTimeInMiliseconds));
  const tokenExpirationDate = new Date(
    new Date().getTime() + expiryTimeInMiliseconds
  );
  saveDataToStorage(idToken, localId, tokenExpirationDate);
};

export const loginUserAction = (email, password) => async (dispatch) => {
  const result = await fetch(API_LOGIN_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  if (!result.ok) {
    const errorResponseData = await result.json();
    const errorMessage = errorResponseData.error.message;
    let customMessage = 'Something went wrong!';

    if (errorMessage === 'EMAIL_NOT_FOUND') {
      customMessage = 'There is no account with this email.';
    } else if (errorMessage === 'INVALID_PASSWORD') {
      customMessage = 'The password is not valid.';
    }
    throw new Error(customMessage);
  }

  const resData = await result.json();
  const { localId, idToken, expiresIn } = resData;
  const expiryTimeInMiliseconds = parseInt(expiresIn) * 1000;
  dispatch(authenticateUserAction(localId, idToken, expiryTimeInMiliseconds));
  const tokenExpirationDate = new Date(
    new Date().getTime() + expiryTimeInMiliseconds
  );
  saveDataToStorage(idToken, localId, tokenExpirationDate);
};

export const logoutUserAction = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return {
    type: LOGOUT_USER,
  };
};

export const attemptAutologinUser = () => ({
  type: ATTEMPT_AUTOLOGIN_USER,
});
