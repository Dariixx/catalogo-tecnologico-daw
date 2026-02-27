// src/config/site.ts
export const site = {
    name: "ZetaGadget",
    tagline: "Tu tienda tech de confianza.",
  
    defaultTitle: "ZetaGadget | Catálogo tecnológico",
    defaultDescription:
      "Catálogo tecnológico con productos destacados, categorías y artículos.",
  
    nav: [
      { label: "Inicio", href: "/" },
      { label: "Productos", href: "/productos" },
      { label: "Categorías", href: "/categorias" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contacto" },
    ],
  
    footerLinks: [
      { label: "Productos", href: "/productos" },
      { label: "Categorías", href: "/categorias" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contacto" },
      { label: "Carrito", href: "/carrito" },
    ],
  
    primaryCta: { label: "Ver productos", href: "/productos" },
  
    logo: {
      src: "/brand/logo-nombre.png",
      alt: "ZetaGadget",
    },
  
    favicon: {
      href: "/favicon.png",
    },
  };