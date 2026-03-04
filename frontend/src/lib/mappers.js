import { absoluteUrl } from "./strapi.js";

export function mapProductCard(p) {
    const images = Array.isArray(p?.images) ? p.images : [];
    // ✅ Priorizar resoluciones más altas para evitar imágenes pixeladas
    const imageUrl =
      images?.[0]?.formats?.large?.url ||
      images?.[0]?.formats?.medium?.url ||
      images?.[0]?.formats?.small?.url ||
      images?.[0]?.url ||
      null;
  
    return {
      id: p?.id ?? p?.documentId ?? p?.slug,
      name: p?.name ?? "Producto",
      slug: p?.slug,
      price: Number(p?.price ?? 0),
      shortDescription: p?.shortDescription ?? null,
      imageUrl, // 👈 RELATIVA "/uploads/..."
      featured: !!p?.featured,
      stock: Number(p?.stock ?? 0),
      category: p?.category?.slug
        ? { name: p.category.name, slug: p.category.slug }
        : null,
    };
  }

export function mapArticleCard(a) {
  // ajusta si tu article tiene cover o images
  // ✅ Priorizar resoluciones más altas para evitar imágenes pixeladas
  const cover =
    a?.cover?.formats?.large?.url ||
    a?.cover?.formats?.medium?.url ||
    a?.cover?.formats?.small?.url ||
    a?.cover?.url ||
    null;

  return {
    title: a?.title,
    slug: a?.slug,
    description: a?.description ?? a?.excerpt ?? "",
    coverUrl: cover ? absoluteUrl(cover) : null,
    publishedAt: a?.publishedAt ?? null,
  };
}