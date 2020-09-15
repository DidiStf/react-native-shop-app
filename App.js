import React, { useState } from 'react';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
//import { composeWithDevTools } from 'redux-devtools-extension';

import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';
import productsReducer from './store/reducers/products';
import userReducer from './store/reducers/user';
import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  user: userReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });
};

export default function App() {
  YellowBox.ignoreWarnings(['Setting a timer']);

  const [fontLoaded, setFontLoaded] = useState(false);

  return fontLoaded ? (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  ) : (
    <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)} />
  );
}
