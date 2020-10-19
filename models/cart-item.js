class CartItem {
  constructor(quantity, price, title, pushToken, sum) {
    this.quantity = quantity;
    this.price = price;
    this.title = title;
    this.pushToken = pushToken;
    this.sum = sum;
  }
}

export default CartItem;
