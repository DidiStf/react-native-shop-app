import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { AuthenticationNavigator, ShopNavigator } from './ShopNavigator';
import StartupScreen from '../screens/Startup';

import { select as selectUser } from '../store/selectors/user';

const AppNavigator = () => {
  const isAuthenticated = !!useSelector(selectUser).token;
  const { attemptedAutologin } = useSelector(selectUser);

  return (
    <NavigationContainer>
      {!isAuthenticated && !attemptedAutologin && <StartupScreen />}
      {!isAuthenticated && attemptedAutologin && <AuthenticationNavigator />}
      {isAuthenticated && <ShopNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
