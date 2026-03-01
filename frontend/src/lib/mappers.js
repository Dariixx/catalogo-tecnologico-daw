import { absoluteUrl } from "./strapi.js";

export function mapProductCard(p) {
    const images = Array.isArray(p?.images) ? p.images : [];
    const imageUrl =
      images?.[0]?.formats?.small?.url ||
      images?.[0]?.formats?.thumbnail?.url ||
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
  const cover =
    a?.cover?.formats?.small?.url ||
    a?.cover?.formats?.thumbnail?.url ||
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