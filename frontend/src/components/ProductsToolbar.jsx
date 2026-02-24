// src/components/ProductsToolbar.jsx
import { useState, useCallback } from "react";

const SORT_OPTIONS = [
  { label: "Más recientes", value: "createdAt:desc" },
  { label: "Más antiguos", value: "createdAt:asc" },
  { label: "Precio: menor a mayor", value: "price:asc" },
  { label: "Precio: mayor a menor", value: "price:desc" },
  { label: "Nombre A-Z", value: "name:asc" },
  { label: "Nombre Z-A", value: "name:desc" },
];

const INVALID_CHARS = /[<>"'`{}|\\^[\]]/;

export default function ProductsToolbar({ categories = [], initial = {} }) {
  const [q, setQ] = useState(initial.q ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [sort, setSort] = useState(initial.sort ?? "createdAt:desc");

  const isInvalid = INVALID_CHARS.test(q);
  const isDirty =
    q !== (initial.q ?? "") ||
    category !== (initial.category ?? "") ||
    sort !== (initial.sort ?? "createdAt:desc");

  const handleApply = useCallback(() => {
    if (isInvalid) return;
    const params = new URLSearchParams(window.location.search);
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    if (category) params.set("cat", category);
    else params.delete("cat");
    if (sort) params.set("sort", sort);
    else params.delete("sort");
    params.delete("page");
    window.location.search = params.toString();
  }, [q, category, sort, isInvalid]);

  const handleClear = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete("q");
    params.delete("cat");
    params.delete("sort");
    params.delete("page");
    window.location.search = params.toString();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleApply();
  };

  const inputBase = {
    background: "#0f1115",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e5e5e5",
  };

  const inputFocusStyle = `
    focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60
  `;

  return (
    <div
      className="w-full rounded-xl px-4 py-4 flex flex-col gap-4"
      style={{
        background: "rgba(21,26,34,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Fila principal */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Input búsqueda */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="relative">
            {/* Icono lupa */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="rgba(229,229,229,0.35)" strokeWidth="1.4" />
                <path d="M10 10l3 3" stroke="rgba(229,229,229,0.35)" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar productos…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full pl-9 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200 ${inputFocusStyle}`}
              style={{
                ...inputBase,
                borderColor: isInvalid
                  ? "rgba(239,68,68,0.5)"
                  : "rgba(255,255,255,0.08)",
              }}
              aria-invalid={isInvalid}
              aria-describedby={isInvalid ? "q-hint" : undefined}
            />
          </div>
          {isInvalid && (
            <p
              id="q-hint"
              className="text-xs px-1"
              style={{ color: "rgba(239,68,68,0.85)" }}
            >
              La búsqueda contiene caracteres no permitidos.
            </p>
          )}
        </div>

        {/* Select categoría */}
        <div className="flex-shrink-0 sm:w-44">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer transition-colors duration-200 ${inputFocusStyle}`}
            style={inputBase}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select ordenación */}
        <div className="flex-shrink-0 sm:w-52">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg text-sm appearance-none cursor-pointer transition-colors duration-200 ${inputFocusStyle}`}
            style={inputBase}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-between gap-3">
        {/* Hint activo */}
        <p
          className="text-xs"
          style={{ color: "rgba(229,229,229,0.35)" }}
        >
          {isDirty && !isInvalid
            ? "Tienes cambios sin aplicar."
            : "\u00A0"}
        </p>

        <div className="flex items-center gap-2">
          {/* Limpiar */}
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: "transparent",
              color: "rgba(229,229,229,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#e5e5e5";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "rgba(229,229,229,0.5)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
            type="button"
          >
            Limpiar
          </button>

          {/* Aplicar */}
          <button
            onClick={handleApply}
            disabled={isInvalid}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
            style={{
              background: isInvalid ? "rgba(30,136,229,0.2)" : "#1e88e5",
              color: isInvalid ? "rgba(255,255,255,0.3)" : "#fff",
              border: "1px solid transparent",
            }}
            onMouseOver={(e) => {
              if (!isInvalid) e.currentTarget.style.background = "#3aa0ff";
            }}
            onMouseOut={(e) => {
              if (!isInvalid) e.currentTarget.style.background = "#1e88e5";
            }}
            type="button"
            aria-disabled={isInvalid}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}