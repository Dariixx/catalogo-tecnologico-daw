const KEY = "zetagadget_cart_v1";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  // Payload estándar: { cart: [...] }
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: items } }));
}

export function cartCount(items = getCart()) {
  return items.reduce((acc, it) => acc + (it.qty || 1), 0);
}

export function addToCart(product) {
  const items = getCart();
  const idx = items.findIndex((i) => i.id === product.id);
  if (idx >= 0) items[idx].qty += 1;
  else items.push({ ...product, qty: 1 });
  saveCart(items);
}

export function removeFromCart(id) {
  const items = getCart().filter((i) => i.id !== id);
  saveCart(items);
}

export function setQty(id, qty) {
  const items = getCart().map((i) => (i.id === id ? { ...i, qty } : i));
  saveCart(items.filter((i) => i.qty > 0));
}

export function clearCart() {
  saveCart([]);
}