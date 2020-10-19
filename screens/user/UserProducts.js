import React, { useState } from 'react';
import { Alert, ActivityIndicator, Button, FlatList, Text } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';

import Centered from '../../components/ui/Centered';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';

import { deleteProductAction } from '../../store/actions/products';
import { select as selectProducts } from '../../store/selectors/products';

import colors from '../../constants/colors';
import { isAndroid } from '../../helpers/platform';

const UserProductsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { userProducts } = useSelector(selectProducts);

  const handleDelete = async (id) => {
    setIsLoading(true);
    await dispatch(deleteProductAction(id));
    setIsLoading(false);
  };

  const handleTapDelete = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => handleDelete(id),
      },
    ]);
  };

  const handleTapEdit = (id) => {
    navigation.navigate('EditProduct', {
      productId: id,
    });
  };

  if (isLoading) {
    return (
      <Centered>
        <ActivityIndicator size='large' color={colors.primary} />
      </Centered>
    );
  }

  return userProducts.length ? (
    <FlatList
      data={userProducts}
      keyExtractor={({ id }) => id}
      renderItem={({ item: { id, imageUrl, price, title } }) => (
        <ProductItem
          imageUrl={imageUrl}
          onSelect={() => handleTapEdit(id)}
          price={price}
          title={title}>
          <Button
            color={colors.primary}
            onPress={() => handleTapEdit(id)}
            title='Edit'
          />
          <Button
            color={colors.primary}
            onPress={() => handleTapDelete(id)}
            title='Delete'
          />
        </ProductItem>
      )}
    />
  ) : (
    <Centered>
      <Text>There are no products to show. Add your first product.</Text>
    </Centered>
  );
};

export const userProductsScreenOptions = ({ navigation }) => {
  const menuIcon = isAndroid ? 'md-menu' : 'ios-menu';
  const addIcon = isAndroid ? 'md-create' : 'ios-create';

  const handleOnPressAdd = () => {
    navigation.navigate('EditProduct');
  };

  const handleOnPressMenu = () => {
    navigation.toggleDrawer();
  };

  return {
    headerTitle: 'Your Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title='Menu' iconName={menuIcon} onPress={handleOnPressMenu} />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title='Add' iconName={addIcon} onPress={handleOnPressAdd} />
      </HeaderButtons>
    ),
  };
};

export default UserProductsScreen;
