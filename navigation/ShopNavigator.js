import React from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';

import StartupScreen from '../screens/Startup';
import CartScreen from '../screens/shop/Cart';
import EditProductScreen from '../screens/user/EditProduct';
import AuthenticationScreen from '../screens/user/Authentication';
import OrdersScreen from '../screens/shop/Orders';
import ProductDetailScreen from '../screens/shop/ProductDetail';
import ProductsOverviewScreen from '../screens/shop/ProductsOverview';
import UserProductsScreen from '../screens/user/UserProducts';

import { logoutUserAction } from '../store/actions/user';

import colors from '../constants/colors';
import { isAndroid } from '../helpers/platform';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: isAndroid ? colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: isAndroid ? 'white' : colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={isAndroid ? 'md-cart' : 'ios-cart'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={isAndroid ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={isAndroid ? 'md-create' : 'ios-create'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: colors.primary,
    },
    contentComponent: ({ navigation, ...props }) => {
      const dispatch = useDispatch();
      const handleTapLogout = () => {
        dispatch(logoutUserAction());
      };
      return (
        <View style={{ flex: 1, paddingVertical: 25 }}>
          <SafeAreaView forceIncet={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <Button
              title='Logout'
              color={colors.primary}
              onPress={handleTapLogout}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthenticationNavigator = createStackNavigator(
  {
    Authentication: AuthenticationScreen,
  },
  {
    defaultNavigationOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Authentication: AuthenticationNavigator,
  Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator);
