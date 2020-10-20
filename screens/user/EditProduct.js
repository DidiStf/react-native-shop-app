import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';

import Centered from '../../components/ui/Centered';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import InputWithValidation from '../../components/shop/InputWithValidation';

import {
  createProductAction,
  updateProductAction,
} from '../../store/actions/products';
import { selectProductById } from '../../store/selectors/products';

import colors from '../../constants/colors';
import { isAndroid } from '../../utils/platform';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  const { input, isFieldValid, value } = action;
  const { inputValidation, inputValues } = state;
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...inputValues,
      [input]: value,
    };
    const updatedValidation = {
      ...inputValidation,
      [input]: isFieldValid,
    };
    const updatedIsFormValid = !Object.values(updatedValidation).some(
      (value) => value === false
    );
    return {
      ...state,
      inputValidation: updatedValidation,
      inputValues: updatedValues,
      isFormValid: updatedIsFormValid,
    };
  }
  return state;
};

const setInitialState = (initialValue) => ({
  title: initialValue.title || '',
  imageUrl: initialValue.imageUrl || '',
  price: initialValue.price?.toString() || '',
  description: initialValue.description || '',
});

const EditProductScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const { productId } = route.params || {};
  const product = productId
    ? useSelector((state) => selectProductById(state, productId))
    : {};
  const isInitiallyValid = productId ? true : false;

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: setInitialState(product),
    inputValidation: {
      title: isInitiallyValid,
      imageUrl: isInitiallyValid,
      price: isInitiallyValid,
      description: isInitiallyValid,
    },
    isFormValid: isInitiallyValid,
  });

  const handleOnChange = useCallback(
    (input, value, isFieldValid) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value,
        input,
        isFieldValid,
      });
    },
    [dispatchFormState]
  );

  const handleSubmit = useCallback(async () => {
    const { inputValues, isFormValid } = formState;

    if (!isFormValid)
      return Alert.alert(
        'Wrong Input!',
        'Please check if all the form fields are filled correctly.',
        [{ text: 'Okay' }]
      );
    setIsLoading(true);
    setError(null);
    try {
      if (productId) {
        delete inputValues.price;
        await dispatch(updateProductAction(productId, inputValues));
        return navigation.goBack();
      }
      await dispatch(
        createProductAction({
          ...inputValues,
          price: parseFloat(inputValues.price, 10),
        })
      );
      return navigation.goBack();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [dispatch, productId, formState]);

  useEffect(() => {
    const saveIcon = isAndroid ? 'md-checkmark' : 'ios-checkmark';
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title='Save' iconName={saveIcon} onPress={handleSubmit} />
        </HeaderButtons>
      ),
    });
  }, [handleSubmit]);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error[{ text: 'Okay' }]);
    }
  }, [error]);

  if (isLoading) {
    return (
      <Centered>
        <ActivityIndicator size='large' color={colors.primary} />
      </Centered>
    );
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView style={styles.screen} s>
        <View style={styles.form}>
          <InputWithValidation
            id='title'
            label='Title'
            editable
            errorMessage='Please enter a valid title.'
            initialValue={formState.inputValues.title}
            initiallyValid={!!productId}
            onInputChange={handleOnChange}
            required
            autoCapitalize='sentences'
            autoCorrect
            keyboardType='default'
            returnKeyType='next'
          />
          <InputWithValidation
            id='imageUrl'
            label='Image URL'
            errorMessage='Please enter a valid image URL.'
            editable
            initialValue={formState.inputValues.imageUrl}
            initiallyValid={!!productId}
            onInputChange={handleOnChange}
            required
            keyboardType='default'
            returnKeyType='next'
          />
          <InputWithValidation
            id='price'
            editable={!productId}
            label='Price'
            errorMessage='Please enter a valid price.'
            initialValue={formState.inputValues.price}
            initiallyValid={!!productId}
            onInputChange={handleOnChange}
            required
            min={0.1}
            keyboardType='decimal-pad'
            returnKeyType='next'
          />
          <InputWithValidation
            id='description'
            label='Description'
            editable
            errorMessage='Please enter a valid description.'
            initialValue={formState.inputValues.description}
            initiallyValid={!!productId}
            onInputChange={handleOnChange}
            required
            minLength={10}
            autoCapitalize='sentences'
            autoCorrect
            keyboardType='default'
            multiline
            numberOfLines={3}
            returnKeyType='next'
          />
          <Text style={styles.message}>
            All the fields marked with * are required.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const editProductScreenOptions = ({ route }) => {
  const { params } = route;
  const isCreation = !params?.productId;

  return {
    headerTitle: isCreation ? 'Add Product' : 'Edit Product',
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  message: {
    color: '#888',
  },
  screen: {
    backgroundColor: '#e5b59f',
    height: '100%',
  },
});

export default EditProductScreen;
