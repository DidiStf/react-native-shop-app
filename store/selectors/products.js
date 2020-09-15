const STATE_KEY = 'products';

export const select = (state) => state[STATE_KEY];

export const selectProductById = (state, productId) => {
  const { allProducts } = select(state);
  return allProducts.find(({ id }) => id === productId);
};
