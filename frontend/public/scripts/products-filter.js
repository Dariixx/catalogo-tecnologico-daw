// /public/scripts/products-filter.js
(function () {
    const root = document.querySelector("[data-products-root]");
    if (!root) return;
  
    const q = document.querySelector("[data-filter-q]");
    const cat = document.querySelector("[data-filter-cat]");
    const sort = document.querySelector("[data-filter-sort]");
  
    const getCards = () => Array.from(root.querySelectorAll("[data-product-card]"));
  
    function apply() {
      const qv = (q?.value || "").trim().toLowerCase();
      const cv = (cat?.value || "").trim();
      const sv = sort?.value || "";
  
      const cards = getCards();
  
      // filter
      cards.forEach((el) => {
        const name = (el.dataset.name || "").toLowerCase();
        const c = (el.dataset.cat || "").trim();
        const okQ = !qv || name.includes(qv);
        const okC = !cv || c === cv;
        el.style.display = okQ && okC ? "" : "none";
      });
  
      // sort visible
      if (!sv) return;
      const visible = cards.filter((el) => el.style.display !== "none");
  
      visible.sort((a, b) => {
        const pa = Number(a.dataset.price || 0);
        const pb = Number(b.dataset.price || 0);
        if (sv === "price_asc") return pa - pb;
        if (sv === "price_desc") return pb - pa;
        return 0;
      });
  
      // Re-append sorted nodes
      visible.forEach((el) => root.appendChild(el));
    }
  
    q?.addEventListener("input", apply);
    cat?.addEventListener("change", apply);
    sort?.addEventListener("change", apply);
  
    apply();
  })();