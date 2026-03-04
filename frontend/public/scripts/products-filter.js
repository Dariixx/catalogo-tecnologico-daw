/**
 * products-filter.js
 * 
 * Filtrado 100% client-side:
 * - Lee los productos del DOM (data-product-card, data-name, data-cat, data-price)
 * - Filtra sin recargar la página (instantáneo)
 * - Actualiza la URL con los parámetros actuales (para compartir/recargar)
 * - Al cargar la página, restaura los filtros desde la URL
 */
(() => {
  // ── Elementos del form ────────────────────────────────────────────────────
  const inputQ    = document.querySelector("[data-filter-q]");
  const inputCat  = document.querySelector("[data-filter-cat]");
  const inputSort = document.querySelector("[data-filter-sort]");
  const inputMin  = document.querySelector("[data-filter-min]");
  const inputMax  = document.querySelector("[data-filter-max]");

  if (!inputQ && !inputCat && !inputSort) return; // no estamos en la página de productos

  // ── Productos del DOM ─────────────────────────────────────────────────────
  const cards = Array.from(document.querySelectorAll("[data-product-card]"));

  // ── Contadores ────────────────────────────────────────────────────────────
  const counterEl = document.querySelector("[data-filter-count]");
  const emptyEl   = document.querySelector("[data-filter-empty]");
  const gridEl    = document.querySelector("[data-products-grid]");

  // ── Restaurar filtros desde la URL al cargar ──────────────────────────────
  const params = new URLSearchParams(window.location.search);
  if (inputQ    && params.get("q"))    inputQ.value    = params.get("q");
  if (inputCat  && params.get("cat"))  inputCat.value  = params.get("cat");
  if (inputSort && params.get("sort")) inputSort.value = params.get("sort");
  if (inputMin  && params.get("min"))  inputMin.value  = params.get("min");
  if (inputMax  && params.get("max"))  inputMax.value  = params.get("max");

  // ── Función principal de filtrado ─────────────────────────────────────────
  function applyFilters() {
    const q    = (inputQ?.value    ?? "").trim().toLowerCase();
    const cat  = (inputCat?.value  ?? "").trim();
    const sort = (inputSort?.value ?? "createdAt:desc").trim();
    const minV = parseFloat(inputMin?.value ?? "") || 0;
    const maxV = parseFloat(inputMax?.value ?? "") || Infinity;

    let visible = 0;

    cards.forEach((card) => {
      const name  = (card.dataset.name  ?? "").toLowerCase();
      const ccat  = (card.dataset.cat   ?? "");
      const price = parseFloat(card.dataset.price ?? "0") || 0;

      const matchQ   = !q   || name.includes(q);
      const matchCat = !cat || ccat === cat;
      const matchMin = price >= minV;
      const matchMax = maxV === Infinity || price <= maxV;

      const show = matchQ && matchCat && matchMin && matchMax;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    // Ordenación visual de las cards visibles
    if (gridEl) {
      const visibleCards = cards.filter((c) => c.style.display !== "none");
      visibleCards.sort((a, b) => {
        const nameA  = a.dataset.name  ?? "";
        const nameB  = b.dataset.name  ?? "";
        const priceA = parseFloat(a.dataset.price ?? "0") || 0;
        const priceB = parseFloat(b.dataset.price ?? "0") || 0;

        if (sort === "name:asc")   return nameA.localeCompare(nameB, "es");
        if (sort === "name:desc")  return nameB.localeCompare(nameA, "es");
        if (sort === "price:asc")  return priceA - priceB;
        if (sort === "price:desc") return priceB - priceA;
        return 0; // createdAt:desc → orden original del DOM
      });
      // Reordenar en el DOM
      visibleCards.forEach((card) => gridEl.appendChild(card));
    }

    // Actualizar contador
    if (counterEl) counterEl.textContent = visible;

    // Mostrar/ocultar estado vacío
    if (emptyEl) {
      emptyEl.style.display = visible === 0 ? "" : "none";
    }

    // Actualizar URL sin recargar (para compartir filtros)
    const newParams = new URLSearchParams();
    if (q)                        newParams.set("q", q);
    if (cat)                      newParams.set("cat", cat);
    if (sort && sort !== "createdAt:desc") newParams.set("sort", sort);
    if (minV > 0)                 newParams.set("min", minV);
    if (maxV < Infinity)          newParams.set("max", maxV);

    const newUrl = window.location.pathname + (newParams.toString() ? "?" + newParams.toString() : "");
    window.history.replaceState({}, "", newUrl);
  }

  // ── Listeners ─────────────────────────────────────────────────────────────
  let debounceTimer;
  const debounce = (fn, ms = 300) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, ms);
  };

  inputQ?.addEventListener("input",  () => debounce(applyFilters, 300));
  inputCat?.addEventListener("change",  () => applyFilters());
  inputSort?.addEventListener("change", () => applyFilters());
  inputMin?.addEventListener("input",   () => debounce(applyFilters, 400));
  inputMax?.addEventListener("input",   () => debounce(applyFilters, 400));

  // Evitar recarga de página al pulsar Aplicar (ya filtramos en tiempo real)
  const form = inputQ?.closest("form") ?? inputCat?.closest("form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
  });

  // ── Aplicar filtros iniciales si hay params en la URL ─────────────────────
  if (params.toString()) {
    applyFilters();
  }
})();