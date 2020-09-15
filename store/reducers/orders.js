import { ADD_ORDER, GET_ALL_ORDERS } from '../actions/orders';

import Order from '../../models/order';

const initialState = {
  orders: [],
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDERS: {
      const { orders } = action.payload;
      return {
        orders,
      };
    }
    case ADD_ORDER:
      const { amount, date, id, items } = action.payload;
      const newOrder = new Order(id, items, amount, date);
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };
  }
  return state;
};

export default ordersReducer;
