const ACTION_KEY = 'cart';

export const ADD_TO_CART = `${ACTION_KEY}/addToCart`;
export const CLEAR_CART = `${ACTION_KEY}/clearCart`;
export const DELETE_PRODUCT_FROM_CART = `${ACTION_KEY}/deleteProductFromCart`;
export const REMOVE_FROM_CART = `${ACTION_KEY}/removeFromCart`;

export const addItemToCartAction = (product) => {
  return {
    type: ADD_TO_CART,
    payload: { product },
  };
};

export const removeItemFromCartAction = (id) => {
  return {
    type: REMOVE_FROM_CART,
    payload: id,
  };
};

export const clearCartAction = () => {
  return {
    type: CLEAR_CART,
  };
};

export const deleteProductFromCartAction = (id) => {
  return {
    type: DELETE_PRODUCT_FROM_CART,
    payload: id,
  };
};
