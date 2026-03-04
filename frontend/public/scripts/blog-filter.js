/**
 * blog-filter.js
 *
 * Filtrado client-side del blog.
 * - Filtra las cards visibles en tiempo real por título y categoría
 * - Al enviar el form hace GET con parámetros limpios (sin %5B%5D)
 * - Restaura el estado desde la URL al cargar
 */
(() => {
  const inputQ   = document.querySelector("[data-blog-q]");
  const inputCat = document.querySelector("[data-blog-cat]");
  if (!inputQ && !inputCat) return;

  const cards    = Array.from(document.querySelectorAll("[data-blog-card]"));
  const emptyEl  = document.querySelector("[data-blog-empty]");
  const countEl  = document.querySelector("[data-blog-count]");

  // ── Restaurar estado desde URL ──────────────────────────────────────────
  const sp = new URLSearchParams(window.location.search);
  if (inputQ   && sp.get("q"))   inputQ.value   = sp.get("q");
  if (inputCat && sp.get("cat")) inputCat.value = sp.get("cat");

  // ── Filtrado ─────────────────────────────────────────────────────────────
  function applyFilters() {
    const q   = (inputQ?.value   ?? "").trim().toLowerCase();
    const cat = (inputCat?.value ?? "").trim();

    let visible = 0;

    cards.forEach((card) => {
      const title = (card.dataset.title ?? "").toLowerCase();
      const ccat  = (card.dataset.cat  ?? "");

      const matchQ   = !q   || title.includes(q);
      const matchCat = !cat || ccat === cat;
      const show = matchQ && matchCat;

      // La card es un <article class="contents"> que envuelve el ArticleCard
      // Necesitamos mostrar/ocultar el hijo directo (el elemento visual)
      const visual = card.firstElementChild ?? card;
      visual.style.display = show ? "" : "none";
      card.style.display   = show ? "" : "none";
      if (show) visible++;
    });

    // Contador
    if (countEl) countEl.textContent = String(visible);

    // Estado vacío
    if (emptyEl) emptyEl.style.display = visible === 0 ? "" : "none";

    // Actualizar URL sin recargar
    const np = new URLSearchParams();
    if (q)   np.set("q", q);
    if (cat) np.set("cat", cat);
    const newUrl = window.location.pathname + (np.toString() ? "?" + np.toString() : "");
    window.history.replaceState({}, "", newUrl);
  }

  // ── Interceptar submit del form ──────────────────────────────────────────
  // Si el usuario hace click en "Filtrar", aplicamos client-side en vez de
  // recargar, excepto si necesita cambiar de página (no hay cards de otras páginas)
  const form = inputQ?.closest("form") ?? inputCat?.closest("form");
  form?.addEventListener("submit", (e) => {
    // Solo interceptar si estamos en página 1 (todas las cards están en el DOM)
    const currentPage = parseInt(new URLSearchParams(window.location.search).get("page") ?? "1");
    if (currentPage === 1) {
      e.preventDefault();
      applyFilters();
    }
    // En página > 1 dejamos que recargue normalmente para ir a página 1
  });

  // ── Listeners en tiempo real ─────────────────────────────────────────────
  let timer;
  const debounce = (fn, ms = 300) => { clearTimeout(timer); timer = setTimeout(fn, ms); };

  inputQ?.addEventListener("input",    () => debounce(applyFilters, 300));
  inputCat?.addEventListener("change", () => applyFilters());

  // ── Aplicar al cargar si hay parámetros ──────────────────────────────────
  if (sp.toString()) applyFilters();
})();