import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import ShopNavigator from './ShopNavigator';

import { select as selectUser } from '../store/selectors/user';

const NavigationContainer = () => {
  const isAuthenticated = !!useSelector(selectUser).token;
  const navigationRef = useRef();

  useEffect(() => {
    if (!isAuthenticated) {
      navigationRef.current.dispatch(
        NavigationActions.navigate({ routeName: 'Authentication' })
      );
    }
  }, [isAuthenticated]);

  return <ShopNavigator ref={navigationRef} />;
};

export default NavigationContainer;
