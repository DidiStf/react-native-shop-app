import React, { useEffect } from 'react';
import { ActivityIndicator, AsyncStorage } from 'react-native';
import { useDispatch } from 'react-redux';

import Centered from '../components/ui/Centered';

import {
  attemptAutologinUser,
  authenticateUserAction,
} from '../store/actions/user';

import colors from '../constants/colors';

const StartupScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const tryLogIn = async () => {
    const userData = await AsyncStorage.getItem('userData');

    if (!userData) {
      dispatch(attemptAutologinUser());
    }

    const transformedData = JSON.parse(userData);
    const { token, userId, expiryDate } = transformedData;
    const tokenExpirationDate = new Date(expiryDate);

    if (tokenExpirationDate <= new Date() || !token || !userId) {
      dispatch(attemptAutologinUser());
    }

    const expiryTimeInMiliseconds =
      tokenExpirationDate.getTime() - new Date().getTime();

    dispatch(authenticateUserAction(userId, token, expiryTimeInMiliseconds));
  };

  useEffect(() => {
    tryLogIn();
  }, [dispatch]);

  return (
    <Centered>
      <ActivityIndicator size='large' color={colors.primary} />
    </Centered>
  );
};

export default StartupScreen;
