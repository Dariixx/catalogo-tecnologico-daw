// public/scripts/cart-init.js
// SOLO gestiona: API pública (ZG_CART), badge y toast.
// Los clicks de [data-add-to-cart] los maneja CartDrawer.astro.
// Así no hay listeners duplicados.

(function () {
  const KEY = "zetagadget_cart_v1";

  function safeParse(json, fb) { try { return JSON.parse(json); } catch { return fb; } }
  function getCart()  { return safeParse(localStorage.getItem(KEY) || "[]", []); }
  function saveCart(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: items } }));
  }
  function countItems(items) {
    return (items || getCart()).reduce((a, i) => a + (Number(i.qty) || 1), 0);
  }

  function addToCart(product) {
    const id = String(product?.id ?? "");
    if (!id) return;
    const items = getCart();
    const idx = items.findIndex((i) => String(i.id) === id);
    if (idx >= 0) {
      items[idx].qty = (Number(items[idx].qty) || 1) + 1;
    } else {
      items.push({ id, name: product?.name || "Producto", slug: product?.slug || null, price: Number(product?.price) || 0, qty: 1 });
    }
    saveCart(items);
  }
  function setQty(id, qty) {
    const n = Math.max(0, Number(qty) || 0);
    saveCart(getCart().map((i) => String(i.id) === String(id) ? { ...i, qty: n } : i).filter((i) => i.qty > 0));
  }
  function removeFromCart(id) { saveCart(getCart().filter((i) => String(i.id) !== String(id))); }
  function clearCart() { saveCart([]); }

  // ── Badge ─────────────────────────────────────────────────────────────────
  function updateBadge(cart) {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;
    const n = countItems(cart);
    badge.textContent = String(n);
    badge.classList.toggle("hidden", n === 0);
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showToast(name) {
    document.getElementById("zg-cart-toast")?.remove();
    const t = document.createElement("div");
    t.id = "zg-cart-toast";
    t.setAttribute("role", "alert");
    Object.assign(t.style, {
      position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:"9999",
      display:"flex", alignItems:"center", gap:"0.75rem",
      padding:"0.85rem 1rem", borderRadius:"14px",
      background:"rgba(21,26,34,0.97)",
      border:"1px solid rgba(34,197,94,0.28)",
      boxShadow:"0 16px 48px rgba(0,0,0,0.50)",
      backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
      minWidth:"260px", maxWidth:"340px",
      transform:"translateY(20px)", opacity:"0",
      transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
    });
    t.innerHTML = `
      <span style="flex-shrink:0;width:2rem;height:2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(34,197,94,0.13);border:1px solid rgba(34,197,94,0.25);">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#4ade80" stroke-width="1.3"/>
          <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <div style="flex:1;min-width:0;">
        <p style="margin:0;font-size:.875rem;font-weight:600;color:#4ade80;">¡Añadido al carrito!</p>
        <p style="margin:.12rem 0 0;font-size:.75rem;color:rgba(229,229,229,0.55);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</p>
      </div>
      <button onclick="document.getElementById('zg-cart-toast')?.remove()" aria-label="Cerrar"
        style="background:none;border:none;cursor:pointer;color:rgba(229,229,229,0.28);font-size:.9rem;padding:.1rem;flex-shrink:0;line-height:1;">✕</button>
    `;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      t.style.transform = "translateY(0)"; t.style.opacity = "1";
    }));
    const timer = setTimeout(() => {
      t.style.transform = "translateY(20px)"; t.style.opacity = "0";
      setTimeout(() => t.remove(), 280);
    }, 4000);
    t.addEventListener("mouseenter", () => clearTimeout(timer));
  }

  // ── Feedback visual botón ─────────────────────────────────────────────────
  function feedbackBtn(productId) {
    const btn = document.querySelector(`[data-add-to-cart][data-id="${productId}"]`);
    if (!btn || btn.dataset.fbActive) return;
    btn.dataset.fbActive = "1";
    const orig = { text: btn.textContent, bg: btn.style.background, color: btn.style.color, border: btn.style.borderColor };
    btn.textContent = "✓ Añadido";
    btn.style.background  = "rgba(34,197,94,0.15)";
    btn.style.color       = "#4ade80";
    btn.style.borderColor = "rgba(34,197,94,0.30)";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent       = orig.text;
      btn.style.background  = orig.bg;
      btn.style.color       = orig.color;
      btn.style.borderColor = orig.border;
      btn.disabled          = false;
      delete btn.dataset.fbActive;
    }, 1800);
  }

  // ── API pública ───────────────────────────────────────────────────────────
  window.ZG_CART = { getCart, addToCart, setQty, removeFromCart, clearCart, countItems, showToast, feedbackBtn };
  window.openCart  = () => window.dispatchEvent(new CustomEvent("cart:open"));
  window.closeCart = () => window.dispatchEvent(new CustomEvent("cart:close"));

  // ── Badge: escuchar cart:updated ──────────────────────────────────────────
  // AbortController para limpiar en re-ejecuciones (View Transitions)
  window.__zgCtrl?.abort();
  const ctrl = new AbortController();
  window.__zgCtrl = ctrl;

  window.addEventListener("cart:updated", (e) => {
    updateBadge(e.detail?.cart ?? getCart());
  }, { signal: ctrl.signal });

  // ── Init ──────────────────────────────────────────────────────────────────
  updateBadge(getCart());
})();