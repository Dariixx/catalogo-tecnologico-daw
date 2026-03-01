'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

function readJSON(relPath) {
  return fs.readJsonSync(path.join(process.cwd(), relPath));
}

function assetPath(relativePath) {
  return path.join(process.cwd(), 'data', 'assets', relativePath);
}

function fileExists(p) {
  return fs.existsSync(p);
}

/**
 * ✅ Strapi Blocks required:
 * Si description es type: "blocks" y required: true, nunca puede ser '' ni []
 * Esto crea un bloque mínimo válido.
 */
function normalizeBlocksDescription(desc, fallbackText) {
  if (Array.isArray(desc) && desc.length > 0) return desc;

  const text = String(fallbackText || 'Descripción no disponible');

  return [
    {
      type: 'paragraph',
      children: [{ text }],
    },
  ];
}
function toStrapiInline(child) {
  // Si ya viene en formato Strapi (type:text)
  if (child && typeof child === 'object' && child.type === 'text') return child;

  // Tu formato actual: { text: "..." }
  if (child && typeof child === 'object' && typeof child.text === 'string') {
    return { type: 'text', text: child.text };
  }

  // Si viene un string suelto
  if (typeof child === 'string') return { type: 'text', text: child };

  return { type: 'text', text: '' };
}

function slateBlocksToStrapiBlocks(blocks, fallbackText) {
  // Si no hay blocks -> bloque mínimo
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: String(fallbackText || 'Descripción no disponible') }],
      },
    ];
  }

  return blocks
    .map((b) => {
      // heading -> Strapi espera type: "heading" y level
      if (b?.type === 'heading') {
        const level = Math.min(Math.max(Number(b.level) || 2, 1), 6);
        const children = Array.isArray(b.children) ? b.children.map(toStrapiInline) : [];
        return { type: 'heading', level, children: children.length ? children : [{ type: 'text', text: '' }] };
      }

      // paragraph (o cualquier otro -> paragraph)
      const children = Array.isArray(b?.children) ? b.children.map(toStrapiInline) : [];
      return { type: 'paragraph', children: children.length ? children : [{ type: 'text', text: '' }] };
    })
    .filter(Boolean);
}
async function uploadIfNeeded(relativeAssetPath) {
  if (!relativeAssetPath) return null;

  const abs = assetPath(relativeAssetPath);

  if (!fileExists(abs)) {
    console.warn(`⚠️ Imagen no encontrada: data/assets/${relativeAssetPath}`);
    return null;
  }

  const originalFileName = path.basename(abs);
  const ext = path.extname(abs).slice(1);
  const mimetype = mime.lookup(ext) || 'application/octet-stream';

  const existing = await strapi.query('plugin::upload.file').findOne({
    where: { name: originalFileName },
  });
  if (existing) return existing;

  const stats = fs.statSync(abs);

  const [file] = await strapi.plugin('upload').service('upload').upload({
    data: {
      fileInfo: {
        name: originalFileName,
        alternativeText: originalFileName,
        caption: '',
      },
    },
    files: {
      filepath: abs,
      originalFileName,
      size: stats.size,
      mimetype,
    },
  });

  return file || null;
}

/**
 * En Strapi v5, para Draft&Publish lo más fiable es:
 * - create/update
 * - publish(documentId)
 */
async function ensurePublished(uid, documentId) {
  if (!documentId) return;
  try {
    await strapi.documents(uid).publish({ documentId });
  } catch (e) {
    // Si ya estaba publicado o el CT no tiene draft&publish, no pasa nada.
  }
}

async function upsertBySlug(uid, slug, data) {
  const existing = await strapi.documents(uid).findFirst({
    filters: { slug: { $eq: slug } },
    fields: ['documentId', 'slug'],
  });

  let saved;

  if (existing?.documentId) {
    saved = await strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
    });
    await ensurePublished(uid, existing.documentId);
    return saved;
  }

  saved = await strapi.documents(uid).create({ data });

  if (saved?.documentId) await ensurePublished(uid, saved.documentId);

  return saved;
}

async function upsertByField(uid, field, value, data) {
  const existing = await strapi.documents(uid).findFirst({
    filters: { [field]: { $eq: value } },
    fields: ['documentId'],
  });

  let saved;

  if (existing?.documentId) {
    saved = await strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
    });
    await ensurePublished(uid, existing.documentId);
    return saved;
  }

  saved = await strapi.documents(uid).create({ data });
  if (saved?.documentId) await ensurePublished(uid, saved.documentId);
  return saved;
}

async function importCategories() {
  const categories = readJSON('data/categories.json');
  const map = new Map();

  for (const c of categories) {
    await upsertBySlug('api::category.category', c.slug, {
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
    });

    const saved = await strapi.documents('api::category.category').findFirst({
      filters: { slug: { $eq: c.slug } },
      fields: ['id', 'documentId', 'slug', 'name'],
    });

    if (!saved?.id) {
      console.warn(`⚠️ No pude leer category id para slug: ${c.slug}`);
      continue;
    }

    map.set(c.slug, saved);
  }

  console.log(`✅ Categories: ${map.size}`);
  console.log('🧩 Category slugs cargados:', [...map.keys()]);
  return map;
}

async function importAuthors() {
  const authors = readJSON('data/authors.json');
  const map = new Map();

  for (const a of authors) {
    if (!a.slug) {
      console.warn(
        `⚠️ Author sin slug en authors.json (necesario para enlazar artículos): ${a.email || a.name}`
      );
      continue;
    }

    let avatar = null;
    if (a.avatarPath) avatar = await uploadIfNeeded(a.avatarPath);

    await upsertByField('api::author.author', 'email', a.email, {
      name: a.name,
      email: a.email,
      ...(avatar ? { avatar: avatar.id } : {}),
    });

    const saved = await strapi.documents('api::author.author').findFirst({
      filters: { email: { $eq: a.email } },
      fields: ['id', 'documentId', 'email', 'name'],
    });

    if (!saved?.id) {
      console.warn(`⚠️ No pude leer author id para email: ${a.email}`);
      continue;
    }

    map.set(String(a.slug).toLowerCase(), saved);
  }

  console.log(`✅ Authors: ${map.size}`);
  console.log('🧩 Author slugs cargados:', [...map.keys()]);
  return map;
}

async function importProducts(categoryMap) {
  const products = readJSON('data/products.json');

  for (const p of products) {
    const cat = categoryMap.get(p.categorySlug);

    if (!cat?.id) {
      console.warn(`⚠️ Producto ${p.slug}: categorySlug no existe -> ${p.categorySlug}`);
      continue;
    }

    const imageIds = [];
    if (Array.isArray(p.imagePaths)) {
      for (const rel of p.imagePaths) {
        const f = await uploadIfNeeded(rel);
        if (f?.id) imageIds.push(f.id);
      }
    }

    await upsertBySlug('api::product.product', p.slug, {
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription ?? '',
      // ✅ CLAVE: description es blocks requerido
      description: slateBlocksToStrapiBlocks(p.description, p.shortDescription || p.name),
      price: p.price ?? 0,
      brand: p.brand ?? '',
      stock: p.stock ?? 0,
      category: cat.id,
      specifications: p.specifications ?? [],
      seo: p.seo ?? null,
      ...(imageIds.length ? { images: imageIds } : {}),
    });
  }

  console.log(`✅ Products: ${products.length} procesados`);
}

async function importArticles(categoryMap, authorMap) {
  const articles = readJSON('data/articles.json');

  for (const a of articles) {
    const cat = categoryMap.get(a.categorySlug);
    const author = authorMap.get(String(a.authorSlug).toLowerCase());

    if (!cat?.id) {
      console.warn(`⚠️ Article ${a.slug}: categorySlug no existe -> ${a.categorySlug}`);
      continue;
    }
    if (!author?.id) {
      console.warn(`⚠️ Article ${a.slug}: authorSlug no existe -> ${a.authorSlug}`);
      continue;
    }

    let cover = null;
    if (a.coverPath) cover = await uploadIfNeeded(a.coverPath);

    try {
      await upsertBySlug('api::article.article', a.slug, {
        title: a.title,
        slug: a.slug,
        description: a.description ?? '',
        category: cat.id,
        author: author.id,
        blocks: Array.isArray(a.blocks) && a.blocks.length ? a.blocks : [
          { "__component": "shared.rich-text", "body": "<p>Contenido pendiente</p>" }
        ],
        seo: a.seo ?? null,
        ...(cover ? { cover: cover.id } : {}),
      });
    } catch (err) {
      console.error(`❌ Error creando article: ${a.slug}`);
      if (err?.details?.errors) console.error(JSON.stringify(err.details.errors, null, 2));
      else console.error(err);
    }
  }

  console.log(`✅ Articles: ${articles.length} procesados`);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('🚀 Seed: empezando…');

  const categoryMap = await importCategories();
  const authorMap = await importAuthors();
  await importProducts(categoryMap);
  await importArticles(categoryMap, authorMap);

  console.log('🎉 Seed terminado.');
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});