import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { addItemToCartAction } from '../../store/actions/cart';
import { fetchAllProductsAction } from '../../store/actions/products';
import { select as selectProducts } from '../../store/selectors/products';

import Centered from '../../components/ui/Centered';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';

import colors from '../../constants/colors';
import { isAndroid } from '../../utils/platform';

const ProductsOverviewScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(undefined);
  const { allProducts } = useSelector(selectProducts);
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addItemToCartAction(item));
  };

  const handleViewDetail = (id, title) => {
    navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title,
    });
  };

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(fetchAllProductsAction());
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  //refetch whenever we reach this page when the transition begins
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => loadProducts());

    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  // fetch products initially
  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => setIsLoading(false));

    return () => {};
  }, [dispatch, loadProducts]);

  if (error) {
    return (
      <Centered>
        <Text>An error occurred!</Text>
        <Button
          title='Try Again'
          onPress={loadProducts}
          color={colors.primary}
        />
      </Centered>
    );
  }

  return isLoading ? (
    <Centered>
      <ActivityIndicator size='large' color={colors.primary} />
    </Centered>
  ) : allProducts.length ? (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={allProducts}
      keyExtractor={({ id }) => id}
      style={styles.screen}
      renderItem={({ item }) => {
        const { id, imageUrl, price, title } = item;
        return (
          <ProductItem
            imageUrl={imageUrl}
            onSelect={() => handleViewDetail(id, title)}
            price={price}
            title={title}>
            <Button
              color={colors.accent}
              onPress={() => handleViewDetail(id, title)}
              title='View Details'
            />
            <Button
              color={colors.primary}
              onPress={() => handleAddToCart(item)}
              title='To Cart'
            />
          </ProductItem>
        );
      }}
    />
  ) : (
    <Centered>
      <Text>No products found. You can start adding some!</Text>
    </Centered>
  );
};

export const productsOverviewScreenOptions = ({ navigation }) => {
  const menuIcon = isAndroid ? 'md-menu' : 'ios-menu';
  const cartIcon = isAndroid ? 'md-cart' : 'ios-cart';

  const handleOnPressCart = () => {
    navigation.navigate('Cart');
  };

  const handleOnPressMenu = () => {
    navigation.toggleDrawer();
  };

  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title='Menu' iconName={menuIcon} onPress={handleOnPressMenu} />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title='Cart' iconName={cartIcon} onPress={handleOnPressCart} />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#e5b59f',
  },
});

export default ProductsOverviewScreen;
