const KEY = "zetagadget_cart_v1";

export function readCart() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function writeCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
}

export function addToCart(item) {
  const cart = readCart();
  const id = String(item.id ?? item.slug ?? "");
  const qtyToAdd = Number(item.qty) || 1;

  const found = cart.find((x) => String(x.id) === id);
  if (found) found.qty = (Number(found.qty) || 1) + qtyToAdd;
  else cart.push({ ...item, id, qty: qtyToAdd });

  writeCart(cart);
}

export function setQty(id, qty) {
  const cart = readCart();
  const idx = cart.findIndex((x) => String(x.id) === String(id));
  if (idx === -1) return;

  const q = Number(qty) || 0;
  if (q <= 0) cart.splice(idx, 1);
  else cart[idx].qty = q;

  writeCart(cart);
}

export function incQty(id, delta = 1) {
  const cart = readCart();
  const idx = cart.findIndex((x) => String(x.id) === String(id));
  if (idx === -1) return;

  const next = (Number(cart[idx].qty) || 1) + (Number(delta) || 1);
  if (next <= 0) cart.splice(idx, 1);
  else cart[idx].qty = next;

  writeCart(cart);
}

export function removeFromCart(id) {
  const cart = readCart().filter((x) => String(x.id) !== String(id));
  writeCart(cart);
}