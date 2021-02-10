import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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
    const tokenExpirationDate = new Date(transformedData?.expiryDate);

    if (
      tokenExpirationDate <= new Date() ||
      !transformedData?.token ||
      !transformedData?.userId
    ) {
      dispatch(attemptAutologinUser());
    }

    const expiryTimeInMiliseconds =
      tokenExpirationDate.getTime() - new Date().getTime();

    dispatch(
      authenticateUserAction(
        transformedData?.userId,
        transformedData?.token,
        expiryTimeInMiliseconds
      )
    );
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
