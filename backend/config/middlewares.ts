import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
  name: 'strapi::security',
  config: {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "connect-src": ["'self'", "http:", "https:", "ws:", "wss:"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http:", "https:"],
        "style-src": ["'self'", "'unsafe-inline'", "http:", "https:"],
        "img-src": ["'self'", "data:", "blob:", "http:", "https:"],
        "media-src": ["'self'", "data:", "blob:", "http:", "https:"],
      },
    },
  },
},
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
