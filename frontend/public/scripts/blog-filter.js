(() => {
    const q = document.querySelector("[data-filter-q]");
    if (!q) return;
  
    const basePath = "/blog";
  
    const go = () => {
      const url = new URL(basePath, window.location.origin);
      const qv = (q.value || "").trim();
      if (qv) url.searchParams.set("q", qv);
      window.location.href = url.pathname + url.search;
    };
  
    let t;
    q.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(go, 250);
    });
  })();