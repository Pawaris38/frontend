import { reactive } from "vue";

const state = reactive({
  cartItems: [],
});

const addToCart = (product) => {
  const existingProduct = state.cartItems.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    state.cartItems.push({ ...product, quantity: 1 });
  }
};

const removeFromCart = (productId, quantity = 1) => {
    const existingProduct = state.cartItems.find((item) => item.id === productId);
    if (existingProduct) {
      existingProduct.quantity -= quantity;
      if (existingProduct.quantity <= 0) {
        state.cartItems = state.cartItems.filter((item) => item.id !== productId);
      }
    }
  };
  

const clearCart = () => {
  state.cartItems = [];
};

const getCartItemCount = () => {
    return state.cartItems.length;
};

export default {
  state,
  addToCart,
  removeFromCart,
  clearCart,
  getCartItemCount,
};
