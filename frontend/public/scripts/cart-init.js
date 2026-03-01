// public/scripts/cart-init.js
// ✅ Script auto-contenido (sin imports) para entorno "static".
// Expone window.ZG_CART + eventos globales.

(() => {
  const KEY = "zetagadget_cart_v1";

  function safeParse(json, fallback) {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  }

  function getCart() {
    return safeParse(localStorage.getItem(KEY) || "[]", []);
  }

  function saveCart(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: items } }));
  }

  function countItems(items = getCart()) {
    return items.reduce((acc, it) => acc + (Number(it.qty) || 1), 0);
  }

  function addToCart(product) {
    const items = getCart();
    const id = String(product?.id ?? "");
    if (!id) return;

    const idx = items.findIndex((i) => String(i.id) === id);
    if (idx >= 0) {
      items[idx].qty = (Number(items[idx].qty) || 1) + 1;
    } else {
      items.push({
        id,
        name: product?.name || "Producto",
        slug: product?.slug || null,
        price: Number(product?.price) || 0,
        qty: 1,
      });
    }
    saveCart(items);
  }

  function setQty(id, qty) {
    const n = Math.max(0, Number(qty) || 0);
    const items = getCart()
      .map((i) => (String(i.id) === String(id) ? { ...i, qty: n } : i))
      .filter((i) => (Number(i.qty) || 0) > 0);
    saveCart(items);
  }

  function removeFromCart(id) {
    const items = getCart().filter((i) => String(i.id) !== String(id));
    saveCart(items);
  }

  function clearCart() {
    saveCart([]);
  }

  // API pública
  window.ZG_CART = {
    getCart,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    countItems,
  };

  // Helpers globales
  window.openCart = () => window.dispatchEvent(new CustomEvent("cart:open"));
  window.closeCart = () => window.dispatchEvent(new CustomEvent("cart:close"));

  // Evento inicial para que el drawer/badge rendericen
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: getCart() } }));
})();
