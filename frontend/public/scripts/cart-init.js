// src/scripts/cart-init.js
import { getCart, addToCart, setCart, countItems } from "../lib/cart.js";

// Exponer API en window para que cualquier botón pueda usarlo
window.ZG_CART = {
  getCart,
  addToCart,
  setCart,
  countItems,
};

// Helpers globales usados por componentes
window.openCart = () => {
  window.dispatchEvent(new CustomEvent("cart:open"));
};

window.closeCart = () => {
  window.dispatchEvent(new CustomEvent("cart:close"));
};

// Fuerza un update inicial del badge al cargar
window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: getCart() } }));