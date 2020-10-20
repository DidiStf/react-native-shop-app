import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import Product from '../../models/product';
import { deleteProductFromCartAction } from '../actions/cart';

const ACTION_KEY = 'products';
const API_PATH = 'https://shop-app-didistf.firebaseio.com';

export const CREATE_PRODUCT = `${ACTION_KEY}/createProduct`;
export const DELETE_PRODUCT = `${ACTION_KEY}/deleteProduct`;
export const GET_ALL_PRODUCTS = `${ACTION_KEY}/getAllProducts`;
export const UPDATE_PRODUCT = `${ACTION_KEY}/updateProduct`;

export const fetchAllProductsAction = () => async (dispatch, getState) => {
  const { userId } = getState().user;
  try {
    const result = await fetch(`${API_PATH}/${ACTION_KEY}.json`);

    if (!result.ok) {
      // handling errors 400 and 500 is something proper to firebase
      throw new Error('Something went wrong!');
    }

    const resData = await result.json();
    const loadedProducts = [];
    for (const key in resData) {
      const {
        title,
        imageUrl,
        description,
        price,
        ownerId,
        ownerPushToken,
      } = resData[key];
      loadedProducts.push(
        new Product(
          key,
          ownerId,
          ownerPushToken,
          title,
          imageUrl,
          description,
          price
        )
      );
    }
    const userProducts = loadedProducts.filter(
      (product) => product.ownerId === userId
    );
    return dispatch({
      type: GET_ALL_PRODUCTS,
      payload: { products: loadedProducts, userProducts: userProducts },
    });
  } catch (error) {
    throw error;
  }
};

export const createProductAction = (productData) => async (
  dispatch,
  getState
) => {
  let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let pushToken;

  if (statusObj.status !== 'granted') {
    statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  }
  if (statusObj.status !== 'granted') {
    pushToken = null;
  } else {
    pushToken = (await Notifications.getExpoPushTokenAsync()).data;
  }

  const { token, userId } = getState().user;
  const result = await fetch(`${API_PATH}/${ACTION_KEY}.json?auth=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...productData,
      ownerId: userId,
      ownerPushToken: pushToken,
    }),
  });
  const resData = await result.json();

  if (!result.ok) {
    // handling errors 400 and 500 is something proper to firebase
    throw new Error('Something went wrong!');
  }

  return dispatch({
    type: CREATE_PRODUCT,
    payload: {
      productData: {
        ...productData,
        id: resData.name,
        ownerId: userId,
        pushToken,
      },
    },
  });
};

export const deleteProductAction = (id) => async (dispatch, getState) => {
  const { token } = getState().user;
  const result = await fetch(
    `${API_PATH}/${ACTION_KEY}/${id}.json?auth=${token}`,
    {
      method: 'DELETE',
    }
  );

  if (!result.ok) {
    // handling errors 400 and 500 is something proper to firebase
    throw new Error('Something went wrong!');
  }

  dispatch(deleteProductFromCartAction(id));
  return dispatch({
    type: DELETE_PRODUCT,
    payload: id,
  });
};

export const updateProductAction = (id, productData) => async (
  dispatch,
  getState
) => {
  const { token } = getState().user;
  const result = await fetch(
    `${API_PATH}/${ACTION_KEY}/${id}.json?auth=${token}`,
    {
      /* PUT will fully override the ressource with thee new data and
    PATCH will only update it in the places the we tell it to update it */
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    }
  );

  if (!result.ok) {
    // handling errors 400 and 500 is something proper to firebase
    throw new Error('Something went wrong!');
  }

  return dispatch({
    type: UPDATE_PRODUCT,
    payload: { id, productData },
  });
};
