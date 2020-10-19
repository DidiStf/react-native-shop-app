import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Card from '../../components/ui/Card';
import CartItem from '../../components/shop/CartItem';

import { removeItemFromCartAction } from '../../store/actions/cart';
import { addOrderAction } from '../../store/actions/orders';
import {
  select as selectCart,
  selectTransformedCartItems,
} from '../../store/selectors/cart';
import colors from '../../constants/colors';

const CartScreen = () => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { totalAmount } = useSelector(selectCart);
  const cartItems = useSelector(selectTransformedCartItems);

  const handleOrderNow = async () => {
    setLoading(true);
    await dispatch(addOrderAction(cartItems, totalAmount));
    setLoading(false);
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCartAction(id));
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{' '}
          <Text style={styles.amount}>{Math.abs(totalAmount.toFixed(2))}$</Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size='small' color={colors.primary} />
        ) : (
          <Button
            color={colors.accent}
            disabled={cartItems.length === 0}
            onPress={handleOrderNow}
            title='Order now'
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={({ id }) => id}
        renderItem={({ item: { id, sum, quantity, title } }) => (
          <CartItem
            amount={sum}
            onRemove={() => handleRemoveItem(id)}
            quantity={quantity}
            removable
            title={title}
          />
        )}
      />
    </View>
  );
};

export const cartScreenOptions = {
  headerTitle: 'Your Cart',
};

const styles = StyleSheet.create({
  amount: {
    color: colors.primary,
  },
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
  },
});

export default CartScreen;
