import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  GET_ALL_PRODUCTS,
  UPDATE_PRODUCT,
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
  allProducts: [],
  userProducts: [],
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS: {
      const { products, userProducts } = action.payload;
      return {
        allProducts: products,
        userProducts: userProducts,
      };
    }
    case CREATE_PRODUCT: {
      const {
        id,
        ownerId,
        title,
        imageUrl,
        description,
        price,
      } = action.payload.productData;
      const newProduct = new Product(
        id,
        ownerId,
        title,
        imageUrl,
        description,
        price
      );
      const { allProducts, userProducts } = state;
      return {
        ...state,
        allProducts: allProducts.concat(newProduct),
        userProducts: userProducts.concat(newProduct),
      };
    }
    case DELETE_PRODUCT: {
      const id = action.payload;
      const { allProducts, userProducts } = state;
      return {
        ...state,
        userProducts: userProducts.filter((product) => product.id !== id),
        allProducts: allProducts.filter((product) => product.id !== id),
      };
    }
    case UPDATE_PRODUCT: {
      const { title, imageUrl, description } = action.payload.productData;
      const { id } = action.payload;
      const { allProducts, userProducts } = state;
      const userProductIndex = userProducts.findIndex(
        (product) => product.id === id
      );
      const productIndex = allProducts.findIndex(
        (product) => product.id === id
      );
      const product = userProducts[userProductIndex];
      const updatedProduct = new Product(
        id,
        product.ownerId,
        title,
        imageUrl,
        description,
        product.price
      );
      const updatedUserProducts = [...userProducts];
      updatedUserProducts[userProductIndex] = updatedProduct;
      const updatedAllProducts = [...allProducts];
      updatedAllProducts[productIndex] = updatedProduct;
      return {
        ...state,
        allProducts: updatedAllProducts,
        userProducts: updatedUserProducts,
      };
    }
  }
  return state;
};

export default productsReducer;
