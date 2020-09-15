import {
  ADD_TO_CART,
  CLEAR_CART,
  REMOVE_FROM_CART,
  DELETE_PRODUCT_FROM_CART,
} from '../actions/cart';

import CartItem from '../../models/cart-item';

const initialState = {
  items: {},
  totalAmount: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { items, totalAmount } = state;
      const { id, price, title } = action.payload.product;
      let item = items[id];

      if (item) {
        // this item is already in the cart so we need to modify it
        item = new CartItem(
          items[id].quantity + 1,
          price,
          title,
          items[id].sum + price
        );
      } else {
        // this item is not in the cart so we need to add it
        item = new CartItem(1, price, title, price);
      }
      return {
        ...state,
        items: {
          ...items,
          [id]: item,
        },
        totalAmount: totalAmount + price,
      };
    case REMOVE_FROM_CART: {
      const { items, totalAmount } = state;
      const id = action.payload;
      const selectedCartItem = items[id];
      const { price, title, quantity, sum } = selectedCartItem;
      let updatedCartItems;
      if (quantity > 1) {
        // we need to reduce it, but not delete it
        const updatedCartItem = new CartItem(
          quantity - 1,
          price,
          title,
          sum - price
        );
        updatedCartItems = { ...items, [id]: updatedCartItem };
      } else {
        // we need to delete it
        updatedCartItems = { ...items };
        delete updatedCartItems[id];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: totalAmount - price,
      };
    }
    case DELETE_PRODUCT_FROM_CART: {
      const id = action.payload;
      const { items, totalAmount } = state;

      if (!items[id]) return state;

      const updatedItems = { ...items };
      const itemTotal = items[id].sum;
      delete updatedItems[id];
      return {
        ...state,
        items: updatedItems,
        totalAmount: totalAmount - itemTotal,
      };
    }
    case CLEAR_CART: {
      return initialState;
    }
  }
  return state;
};

export default cartReducer;
