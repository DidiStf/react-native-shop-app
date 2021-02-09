import React from 'react';
import {
  Button,
  Image,
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { addItemToCartAction } from '../../store/actions/cart';
import { selectProductById } from '../../store/selectors/products';

import colors from '../../constants/colors';

const ProductDetailScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { productId } = route.params || {};
  const selectedProduct = useSelector((state) =>
    selectProductById(state, productId)
  );

  const { description, imageUrl, price } = selectedProduct;

  const handleAddToCart = () => {
    dispatch(addItemToCartAction(selectedProduct));
  };

  return (
    <ScrollView style={styles.screen}>
      <Image style={styles.image} source={{ uri: imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={colors.primary}
          title='Add To Cart'
          onPress={handleAddToCart}
        />
      </View>
      <Text style={styles.price}>{price.toFixed(2)}€</Text>
      <Text style={styles.description}>{description}</Text>
    </ScrollView>
  );
};

export const productDetailScreenOptions = ({ route }) => {
  return {
    headerTitle: route.params?.productTitle,
  };
};

const styles = StyleSheet.create({
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  price: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  screen: {
    backgroundColor: '#e5b59f',
    height: '100%',
  },
});

export default ProductDetailScreen;
