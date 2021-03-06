import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllOrdersAction } from '../../store/actions/orders';
import { select as selectOrders } from '../../store/selectors/orders';

import Centered from '../../components/ui/Centered';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';

import colors from '../../constants/colors';
import { isAndroid } from '../../utils/platform';

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(selectOrders);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchAllOrdersAction()).then(() => {
      setIsLoading(false);
    });

    return () => {};
  }, [dispatch]);

  if (isLoading) {
    return (
      <Centered>
        <ActivityIndicator size='large' color={colors.primary} />
      </Centered>
    );
  }

  return orders.length ? (
    <FlatList
      data={orders}
      keyExtractor={({ id }) => id}
      style={styles.screen}
      renderItem={({ item: { amount, readableDate, items } }) => (
        <OrderItem amount={amount} date={readableDate} items={items} />
      )}
    />
  ) : (
    <Centered>
      <Text>There are no orders to show. Make your first order.</Text>
    </Centered>
  );
};

export const ordersScreenOptions = ({ navigation }) => {
  const menuIcon = isAndroid ? 'md-menu' : 'ios-menu';

  const handleOnPressMenu = () => {
    navigation.toggleDrawer();
  };

  return {
    headerTitle: 'Your Orders',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title='Menu' iconName={menuIcon} onPress={handleOnPressMenu} />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#e5b59f',
    height: '100%',
  },
});

export default OrdersScreen;
