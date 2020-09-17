import React from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import StartupScreen from '../screens/Startup';
import CartScreen, { cartScreenOptions } from '../screens/shop/Cart';
import EditProductScreen, {
  editProductScreenOptions,
} from '../screens/user/EditProduct';
import AuthenticationScreen, {
  authenticationScreenOptions,
} from '../screens/user/Authentication';
import OrdersScreen, { ordersScreenOptions } from '../screens/shop/Orders';
import ProductDetailScreen, {
  productDetailScreenOptions,
} from '../screens/shop/ProductDetail';
import ProductsOverviewScreen, {
  productsOverviewScreenOptions,
} from '../screens/shop/ProductsOverview';
import UserProductsScreen, {
  userProductsScreenOptions,
} from '../screens/user/UserProducts';

import { logoutUserAction } from '../store/actions/user';

import colors from '../constants/colors';
import { isAndroid } from '../helpers/platform';

// TODO: create separate components and import them

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

const ProductsStack = createStackNavigator();
export const ProductsNavigator = () => (
  <ProductsStack.Navigator screenOptions={defaultNavigationOptions}>
    <ProductsStack.Screen
      name='ProductsOverview'
      component={ProductsOverviewScreen}
      options={productsOverviewScreenOptions}
    />
    <ProductsStack.Screen
      name='ProductDetail'
      component={ProductDetailScreen}
      options={productDetailScreenOptions}
    />
    <ProductsStack.Screen
      name='Cart'
      component={CartScreen}
      options={cartScreenOptions}
    />
  </ProductsStack.Navigator>
);

const OrdersStack = createStackNavigator();
export const OrdersNavigator = () => (
  <OrdersStack.Navigator screenOptions={defaultNavigationOptions}>
    <OrdersStack.Screen
      name='Orders'
      component={OrdersScreen}
      options={ordersScreenOptions}
    />
  </OrdersStack.Navigator>
);

const AdminStack = createStackNavigator();
export const AdminNavigator = () => (
  <AdminStack.Navigator screenOptions={defaultNavigationOptions}>
    <AdminStack.Screen
      name='UserProducts'
      component={UserProductsScreen}
      options={userProductsScreenOptions}
    />
    <AdminStack.Screen
      name='EditProduct'
      component={EditProductScreen}
      options={editProductScreenOptions}
    />
  </AdminStack.Navigator>
);

const ShopDrawer = createDrawerNavigator();
export const ShopNavigator = () => {
  const dispatch = useDispatch();
  return (
    <ShopDrawer.Navigator
      drawerContent={({ ...props }) => {
        const handleTapLogout = () => {
          dispatch(logoutUserAction());
        };
        return (
          <View style={{ flex: 1, paddingVertical: 25 }}>
            <SafeAreaView forceIncet={{ top: 'always', horizontal: 'never' }}>
              <DrawerItemList {...props} />
              <Button
                title='Logout'
                color={colors.primary}
                onPress={handleTapLogout}
              />
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: colors.primary,
      }}>
      <ShopDrawer.Screen
        name='Products'
        component={ProductsNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name={isAndroid ? 'md-cart' : 'ios-cart'}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <ShopDrawer.Screen
        name='Orders'
        component={OrdersNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name={isAndroid ? 'md-list' : 'ios-list'}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <ShopDrawer.Screen
        name='Admin'
        component={AdminNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name={isAndroid ? 'md-create' : 'ios-create'}
              size={23}
              color={color}
            />
          ),
        }}
      />
    </ShopDrawer.Navigator>
  );
};

const AuthenticationStack = createStackNavigator();
export const AuthenticationNavigator = () => (
  <AuthenticationStack.Navigator screenOptions={defaultNavigationOptions}>
    <AuthenticationStack.Screen
      name='Authentication'
      component={AuthenticationScreen}
      options={authenticationScreenOptions}
    />
  </AuthenticationStack.Navigator>
);

// const ProductsNavigator = createStackNavigator(
//   {
//     ProductsOverview: ProductsOverviewScreen,
//     ProductDetail: ProductDetailScreen,
//     Cart: CartScreen,
//   },
//   {
//     navigationOptions: {
//       drawerIcon: (drawerConfig) => (
//         <Ionicons
//           name={isAndroid ? 'md-cart' : 'ios-cart'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       ),
//     },
//     defaultNavigationOptions,
//   }
// );

// const OrdersNavigator = createStackNavigator(
//   {
//     Orders: OrdersScreen,
//   },
//   {
//     navigationOptions: {
//       drawerIcon: (drawerConfig) => (
//         <Ionicons
//           name={isAndroid ? 'md-list' : 'ios-list'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       ),
//     },
//     defaultNavigationOptions,
//   }
// );

// const AdminNavigator = createStackNavigator(
//   {
//     UserProducts: UserProductsScreen,
//     EditProduct: EditProductScreen,
//   },
//   {
//     navigationOptions: {
//       drawerIcon: (drawerConfig) => (
//         <Ionicons
//           name={isAndroid ? 'md-create' : 'ios-create'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       ),
//     },
//     defaultNavigationOptions,
//   }
// );

// const ShopNavigator = createDrawerNavigator(
//   {
//     Products: ProductsNavigator,
//     Orders: OrdersNavigator,
//     Admin: AdminNavigator,
//   },
//   {
//     contentOptions: {
//       activeTintColor: colors.primary,
//     },
//     contentComponent: ({ navigation, ...props }) => {
//       const dispatch = useDispatch();
//       const handleTapLogout = () => {
//         dispatch(logoutUserAction());
//       };
//       return (
//         <View style={{ flex: 1, paddingVertical: 25 }}>
//           <SafeAreaView forceIncet={{ top: 'always', horizontal: 'never' }}>
//             <DrawerItems {...props} />
//             <Button
//               title='Logout'
//               color={colors.primary}
//               onPress={handleTapLogout}
//             />
//           </SafeAreaView>
//         </View>
//       );
//     },
//   }
// );

// const AuthenticationNavigator = createStackNavigator(
//   {
//     Authentication: AuthenticationScreen,
//   },
//   {
//     defaultNavigationOptions,
//   }
// );

// const MainNavigator = createSwitchNavigator({
//   Startup: StartupScreen,
//   Authentication: AuthenticationNavigator,
//   Shop: ShopNavigator,
// });

// export default createAppContainer(MainNavigator);
