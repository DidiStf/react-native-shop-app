import Order from '../../models/order';
import {
  clearCartAction
} from '../actions/cart';

const ACTION_KEY = 'orders';
const API_PATH = 'https://shop-app-didistf.firebaseio.com';

export const ADD_ORDER = `${ACTION_KEY}/addOrder`;
export const GET_ALL_ORDERS = `${ACTION_KEY}/getAllOrders`;

export const fetchAllOrdersAction = () => async (dispatch, getState) => {
  const {
    userId
  } = getState().user;
  try {
    const result = await fetch(`${API_PATH}/orders/${userId}.json`);

    if (!result.ok) {
      // handling errors 400 and 500 is something proper to firebase
      throw new Error('Something went wrong!');
    }

    const resData = await result.json();
    const loadedOrders = [];
    for (const key in resData) {
      const {
        items,
        amount,
        date
      } = resData[key];
      loadedOrders.push(new Order(key, items, amount, new Date(date)));
    }
    return dispatch({
      type: GET_ALL_ORDERS,
      payload: {
        orders: loadedOrders
      },
    });
  } catch (error) {
    throw error;
  }
};

export const addOrderAction = (items, amount) => async (dispatch, getState) => {
  const {
    token,
    userId
  } = getState().user;
  const date = new Date();
  const result = await fetch(
    `${API_PATH}/orders/${userId}.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        amount,
        date: date.toISOString(),
      }),
    }
  );

  if (!result.ok) {
    // handling errors 400 and 500 is something proper to firebase
    throw new Error('Something went wrong!');
  }

  const resData = await result.json();
  dispatch(clearCartAction());
  dispatch({
    type: ADD_ORDER,
    payload: {
      id: resData.name,
      items,
      amount,
      date,
    },
  });

  items.forEach(({
    title,
    pushToken
  }) => {

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: pushToken,
        title: 'Order was placed!',
        body: title,
      }),
    });
  });
};