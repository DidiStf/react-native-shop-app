import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import CartItem from './CartItem';
import Card from '../../components/ui/Card';

import colors from '../../constants/colors';

const OrderItem = ({ amount, date, items }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.amount}>{amount.toFixed(2)}€</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Button
        color={colors.primary}
        title={showDetails ? 'Hide Details' : 'Show Details'}
        onPress={handleToggleDetails}
      />
      {showDetails && (
        <View style={styles.detailItems}>
          {items.map(({ id, quantity, title, sum }) => (
            <CartItem amount={sum} key={id} quantity={quantity} title={title} />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  amount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
  },
  date: {
    fontFamily: 'open-sans',
    fontSize: 16,
    color: '#888',
  },
  detailItems: {
    width: '100%',
  },
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f7dfd4',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
});

export default OrderItem;
