(() => {
  const q = document.querySelector("[data-filter-q]");
  const cat = document.querySelector("[data-filter-cat]");
  const sort = document.querySelector("[data-filter-sort]");
  if (!q && !cat && !sort) return;

  const basePath = "/productos/";

  const go = () => {
    const url = new URL(basePath, window.location.origin);

    const qv = (q?.value || "").trim();
    const cv = (cat?.value || "").trim();
    const sv = (sort?.value || "").trim();

    if (qv) url.searchParams.set("q", qv);
    if (cv) url.searchParams.set("cat", cv);
    if (sv && sv !== "createdAt:desc") url.searchParams.set("sort", sv);

    window.location.href = url.pathname + url.search;
  };

  let t;
  const debounceGo = () => {
    clearTimeout(t);
    t = setTimeout(go, 250);
  };

  q?.addEventListener("input", debounceGo);
  cat?.addEventListener("change", go);
  sort?.addEventListener("change", go);
})();