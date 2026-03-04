/**
 * products-filter.js
 *
 * Filtrado 100% client-side + paginación client-side.
 * - Filtra las cards del DOM instantáneamente
 * - Pagina los resultados filtrados (4 columnas × 3 filas = 12 por página)
 * - El paginado se recalcula tras cada filtro
 * - La URL se actualiza para compartir/recargar
 */
(() => {
  const inputQ    = document.querySelector("[data-filter-q]");
  const inputCat  = document.querySelector("[data-filter-cat]");
  const inputSort = document.querySelector("[data-filter-sort]");
  const inputMin  = document.querySelector("[data-filter-min]");
  const inputMax  = document.querySelector("[data-filter-max]");

  if (!inputQ && !inputCat && !inputSort) return;

  const allCards  = Array.from(document.querySelectorAll("[data-product-card]"));
  const counterEl = document.querySelector("[data-filter-count]");
  const emptyEl   = document.querySelector("[data-filter-empty]");
  const gridEl    = document.querySelector("[data-products-grid]");
  const paginationEl = document.querySelector("[data-pagination]");

  const PAGE_SIZE = 12; // 4 cols × 3 filas
  let currentPage = 1;
  let filteredCards = [...allCards];

  // ── Restaurar filtros desde la URL ────────────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  if (inputQ    && params.get("q"))    inputQ.value    = params.get("q");
  if (inputCat  && params.get("cat"))  inputCat.value  = params.get("cat");
  if (inputSort && params.get("sort")) inputSort.value = params.get("sort");
  if (inputMin  && params.get("min"))  inputMin.value  = params.get("min");
  if (inputMax  && params.get("max"))  inputMax.value  = params.get("max");
  if (params.get("page")) currentPage = Number(params.get("page")) || 1;

  // ── Renderizar página actual ───────────────────────────────────────────────
  function renderPage() {
    const total     = filteredCards.length;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > pageCount) currentPage = pageCount;

    const start = (currentPage - 1) * PAGE_SIZE;
    const end   = start + PAGE_SIZE;

    // Ocultar todas las cards, mostrar solo las de la página actual
    allCards.forEach(card => card.style.display = "none");
    filteredCards.forEach((card, idx) => {
      card.style.display = (idx >= start && idx < end) ? "" : "none";
    });

    // Contador
    if (counterEl) counterEl.textContent = total;

    // Estado vacío
    if (emptyEl) emptyEl.style.display = total === 0 ? "" : "none";
    if (gridEl)  gridEl.style.display  = total === 0 ? "none" : "";

    // Renderizar paginación
    renderPagination(pageCount);

    // Actualizar URL
    const newParams = new URLSearchParams();
    const q    = inputQ?.value.trim()    ?? "";
    const cat  = inputCat?.value.trim()  ?? "";
    const sort = inputSort?.value.trim() ?? "createdAt:desc";
    const min  = inputMin?.value.trim()  ?? "";
    const max  = inputMax?.value.trim()  ?? "";
    if (q)   newParams.set("q", q);
    if (cat) newParams.set("cat", cat);
    if (sort && sort !== "createdAt:desc") newParams.set("sort", sort);
    if (min) newParams.set("min", min);
    if (max) newParams.set("max", max);
    if (currentPage > 1) newParams.set("page", String(currentPage));
    const newUrl = window.location.pathname + (newParams.toString() ? "?" + newParams.toString() : "");
    window.history.replaceState({}, "", newUrl);
  }

  // ── Renderizar paginación ─────────────────────────────────────────────────
  function renderPagination(pageCount) {
    if (!paginationEl) return;

    if (pageCount <= 1) {
      paginationEl.innerHTML = "";
      return;
    }

    const delta      = 2;
    const rangeStart = Math.max(1, currentPage - delta);
    const rangeEnd   = Math.min(pageCount, currentPage + delta);
    const pageRange  = [];
    for (let i = rangeStart; i <= rangeEnd; i++) pageRange.push(i);

    const showFirst         = rangeStart > 1;
    const showLast          = rangeEnd < pageCount;
    const showLeftEllipsis  = rangeStart > 2;
    const showRightEllipsis = rangeEnd < pageCount - 1;

    // Estilos reutilizables
    const btnBase    = `style="background: rgba(255,255,255,0.04); color: rgba(229,229,229,0.65); border: 1px solid rgba(255,255,255,0.08);"`;
    const btnHover   = `onmouseover="this.style.background='rgba(30,136,229,0.12)'; this.style.color='#3aa0ff'; this.style.borderColor='rgba(30,136,229,0.35)';" onmouseout="this.style.background='rgba(255,255,255,0.04)'; this.style.color='rgba(229,229,229,0.65)'; this.style.borderColor='rgba(255,255,255,0.08)';"`;
    const btnActive  = `style="background: #1e88e5; color: #fff; border: 1px solid #1e88e5; box-shadow: 0 0 12px rgba(30,136,229,0.4);"`;
    const btnNav     = `style="background: rgba(30,136,229,0.08); color: #3aa0ff; border: 1px solid rgba(30,136,229,0.25);"`;
    const btnNavHov  = `onmouseover="this.style.background='rgba(30,136,229,0.18)'; this.style.borderColor='rgba(30,136,229,0.5)';" onmouseout="this.style.background='rgba(30,136,229,0.08)'; this.style.borderColor='rgba(30,136,229,0.25)';"`;
    const btnDis     = `style="background: rgba(255,255,255,0.03); color: rgba(229,229,229,0.2); border: 1px solid rgba(255,255,255,0.05);"`;
    const svgPrev    = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const svgNext    = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const numClass   = `inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200`;
    const navClass   = `inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200`;

    let html = `<div class="mt-14 flex items-center justify-center gap-1.5 flex-wrap">`;

    // Anterior
    if (currentPage > 1) {
      html += `<button class="${navClass}" ${btnNav} ${btnNavHov} data-goto="${currentPage - 1}">${svgPrev} Anterior</button>`;
    } else {
      html += `<span class="${navClass} cursor-not-allowed" ${btnDis}>${svgPrev} Anterior</span>`;
    }

    // Números
    html += `<div class="flex items-center gap-1">`;

    if (showFirst) {
      html += `<button class="${numClass}" ${btnBase} ${btnHover} data-goto="1">1</button>`;
      if (showLeftEllipsis) html += `<span class="inline-flex items-center justify-center w-9 h-9 text-sm" style="color:rgba(229,229,229,0.3)">…</span>`;
    }

    pageRange.forEach(p => {
      if (p === currentPage) {
        html += `<span class="${numClass} font-bold" ${btnActive} aria-current="page">${p}</span>`;
      } else {
        html += `<button class="${numClass}" ${btnBase} ${btnHover} data-goto="${p}">${p}</button>`;
      }
    });

    if (showLast) {
      if (showRightEllipsis) html += `<span class="inline-flex items-center justify-center w-9 h-9 text-sm" style="color:rgba(229,229,229,0.3)">…</span>`;
      html += `<button class="${numClass}" ${btnBase} ${btnHover} data-goto="${pageCount}">${pageCount}</button>`;
    }

    html += `</div>`;

    // Siguiente
    if (currentPage < pageCount) {
      html += `<button class="${navClass}" ${btnNav} ${btnNavHov} data-goto="${currentPage + 1}">Siguiente ${svgNext}</button>`;
    } else {
      html += `<span class="${navClass} cursor-not-allowed" ${btnDis}>Siguiente ${svgNext}</span>`;
    }

    html += `</div>`;
    paginationEl.innerHTML = html;

    // Listeners de los botones de paginación
    paginationEl.querySelectorAll("[data-goto]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentPage = Number(btn.dataset.goto);
        renderPage();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ── Filtrar + ordenar cards ───────────────────────────────────────────────
  function applyFilters() {
    const q    = (inputQ?.value    ?? "").trim().toLowerCase();
    const cat  = (inputCat?.value  ?? "").trim();
    const sort = (inputSort?.value ?? "createdAt:desc").trim();
    const minV = parseFloat(inputMin?.value ?? "") || 0;
    const maxV = parseFloat(inputMax?.value ?? "") || Infinity;

    // Filtrar
    filteredCards = allCards.filter(card => {
      const name  = (card.dataset.name  ?? "").toLowerCase();
      const ccat  = (card.dataset.cat   ?? "");
      const price = parseFloat(card.dataset.price ?? "0") || 0;
      return (!q || name.includes(q))
          && (!cat || ccat === cat)
          && price >= minV
          && (maxV === Infinity || price <= maxV);
    });

    // Ordenar
    filteredCards.sort((a, b) => {
      const nameA  = a.dataset.name  ?? "";
      const nameB  = b.dataset.name  ?? "";
      const priceA = parseFloat(a.dataset.price ?? "0") || 0;
      const priceB = parseFloat(b.dataset.price ?? "0") || 0;
      if (sort === "name:asc")   return nameA.localeCompare(nameB, "es");
      if (sort === "name:desc")  return nameB.localeCompare(nameA, "es");
      if (sort === "price:asc")  return priceA - priceB;
      if (sort === "price:desc") return priceB - priceA;
      return 0;
    });

    // Reordenar en el DOM para que la paginación respete el orden
    if (gridEl) {
      filteredCards.forEach(card => gridEl.appendChild(card));
    }

    currentPage = 1; // al filtrar siempre volvemos a página 1
    renderPage();
  }

  // ── Listeners ─────────────────────────────────────────────────────────────
  let debounceTimer;
  const debounce = (fn, ms) => { clearTimeout(debounceTimer); debounceTimer = setTimeout(fn, ms); };

  inputQ?.addEventListener("input",     () => debounce(applyFilters, 350));
  inputCat?.addEventListener("change",  () => applyFilters());
  inputSort?.addEventListener("change", () => applyFilters());
  inputMin?.addEventListener("input",   () => debounce(applyFilters, 500));
  inputMax?.addEventListener("input",   () => debounce(applyFilters, 500));

  const form = inputQ?.closest("form") ?? inputCat?.closest("form");
  form?.addEventListener("submit", e => { e.preventDefault(); applyFilters(); });

  // ── Init ──────────────────────────────────────────────────────────────────
  applyFilters();
})();