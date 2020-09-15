const STATE_KEY = 'cart';

export const select = (state) => state[STATE_KEY];

export const selectTransformedCartItems = (state) => {
  const transformedCartItems = [];
  const { items } = select(state);
  for (const key in items) {
    const { quantity, price, title, sum } = items[key];
    transformedCartItems.push({
      id: key,
      quantity,
      price,
      title,
      sum,
    });
  }
  return transformedCartItems;
};
