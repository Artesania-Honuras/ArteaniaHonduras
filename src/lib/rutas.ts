import { SITE } from '@/config/site';

/**
 * Prefijo de publicación (GitHub Pages sirve este sitio desde un subdirectorio).
 * Astro lo expone ya normalizado con barra final, por ejemplo `/ArteaniaHonduras/`.
 */
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

const ES_EXTERNO = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

/**
 * Convierte una ruta interna en una ruta publicable que respeta el `base`.
 * Es obligatorio usarlo en todos los `href` internos del proyecto.
 *
 * @example enlace('/tienda') // => '/ArteaniaHonduras/tienda'
 */
export function enlace(ruta = '/'): string {
  if (ES_EXTERNO.test(ruta)) return ruta;

  const limpia = ruta.startsWith('/') ? ruta : `/${ruta}`;
  if (limpia === '/') return `${BASE}/`;

  return `${BASE}${limpia}`;
}

/** Ruta absoluta con dominio, para canónicas, sitemap y Open Graph. */
export function urlAbsoluta(ruta = '/'): string {
  return new URL(enlace(ruta), SITE.url).href;
}

/** Imagen social por defecto del sitio. */
export function imagenSocial(ruta = '/imagenes/og-default.png'): string {
  return urlAbsoluta(ruta);
}

/** Devuelve `true` si la ruta corresponde a la página actual. */
export function esRutaActiva(rutaPagina: string, rutaEnlace: string): boolean {
  const a = rutaPagina.replace(/\/+$/, '') || '/';
  const b = rutaEnlace.replace(/\/+$/, '') || '/';
  if (b === '/') return a === '/';
  return a === b || a.startsWith(`${b}/`);
}

/**
 * URL canónica absoluta a partir del `pathname` que expone Astro (que ya
 * incluye el `base`). Normaliza la barra final de las páginas de directorio.
 */
export function canonica(pathname: string): string {
  const sinConsulta = pathname.split('?')[0]!.split('#')[0]!;
  const conBase = sinConsulta.startsWith(BASE)
    ? sinConsulta
    : `${BASE}${sinConsulta.startsWith('/') ? sinConsulta : `/${sinConsulta}`}`;

  const esArchivo = /\.[a-z0-9]{2,5}$/i.test(conBase);
  const normalizada = esArchivo || conBase.endsWith('/') ? conBase : `${conBase}/`;

  return new URL(normalizada, SITE.url).href;
}

