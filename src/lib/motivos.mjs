/**
 * Motivos gráficos de Arteanía Honduras.
 *
 * Módulo compartido entre el sitio (componente `Motivo.astro`) y el generador
 * de ilustraciones de producto (`scripts/generar-imagenes.mjs`). Se mantiene en
 * JavaScript plano para que Node pueda importarlo sin compilar TypeScript.
 *
 * Cada motivo se dibuja sobre una retícula de 48×48 con trazo geométrico
 * inspirado en los bordados lenca: formas simples, simétricas y legibles a
 * cualquier tamaño.
 */

/** @typedef {{ tipo: 'path', d: string } | { tipo: 'circle', cx: number, cy: number, r: number } | { tipo: 'rect', x: number, y: number, ancho: number, alto: number, radio?: number }} Elemento */

const p = (/** @type {string} */ d) => ({ tipo: /** @type {const} */ ('path'), d });
const c = (/** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ r) => ({
  tipo: /** @type {const} */ ('circle'),
  cx,
  cy,
  r,
});
const r = (
  /** @type {number} */ x,
  /** @type {number} */ y,
  /** @type {number} */ ancho,
  /** @type {number} */ alto,
  /** @type {number} */ radio = 0,
) => ({ tipo: /** @type {const} */ ('rect'), x, y, ancho, alto, radio });

/** @type {Record<string, { nombre: string, elementos: Elemento[] }>} */
export const MOTIVOS = {
  vasija: {
    nombre: 'Vasija de barro',
    elementos: [
      p('M16 11h16'),
      p('M18 11c-1 4-7 6.5-7 14 0 7 5.5 12 13 12s13-5 13-12c0-7.5-6-10-7-14'),
      p('M12.5 27c7.5 3.6 15.5 3.6 23 0'),
      p('M24 30.5l2.8 3.5L24 37.5 21.2 34z'),
    ],
  },
  canasta: {
    nombre: 'Canasta tejida',
    elementos: [
      p('M11 20h26l-3.5 19h-19z'),
      p('M18.5 20c0-6.5 2.5-10 5.5-10s5.5 3.5 5.5 10'),
      p('M13 26.5h22'),
      p('M14.5 33h19'),
      p('M17 20l-1.5 19'),
      p('M31 20l1.5 19'),
    ],
  },
  tejido: {
    nombre: 'Tejido en telar',
    elementos: [
      r(10, 11, 28, 25, 2),
      p('M10 19h28'),
      p('M10 28h28'),
      p('M17.5 11v25'),
      p('M30.5 11v25'),
      p('M13 36v6'),
      p('M19 36v6'),
      p('M25 36v6'),
      p('M31 36v6'),
      p('M35 36v6'),
    ],
  },
  hamaca: {
    nombre: 'Hamaca de algodón',
    elementos: [
      p('M9 15c4 12 9 17 15 17s11-5 15-17'),
      p('M9 15 4 7'),
      p('M39 15l5-8'),
      p('M18 30v6'),
      p('M24 32v6'),
      p('M30 30v6'),
      p('M12 21c7.5 3.5 16.5 3.5 24 0'),
    ],
  },
  bolso: {
    nombre: 'Bolso tejido',
    elementos: [
      p('M11 18h26v22H11z'),
      p('M17.5 18v-3.5a6.5 6.5 0 0 1 13 0V18'),
      p('M11 25h26'),
      p('M11 32h26'),
      p('M19 25v7'),
      p('M29 25v7'),
    ],
  },
  collar: {
    nombre: 'Collar artesanal',
    elementos: [
      p('M9 12c0 13 6.5 19 15 19s15-6 15-19'),
      p('M24 27l5.5 6.5L24 40l-5.5-6.5z'),
      c(9, 12, 2.4),
      c(39, 12, 2.4),
      c(14.5, 22.5, 2),
      c(33.5, 22.5, 2),
    ],
  },
  aretes: {
    nombre: 'Aretes',
    elementos: [
      c(16, 9, 2.6),
      c(32, 9, 2.6),
      p('M16 11.6v5'),
      p('M32 11.6v5'),
      p('M16 16.5a6.5 8 0 1 0 .01 0z'),
      p('M32 16.5a6.5 8 0 1 0 .01 0z'),
    ],
  },
  pulsera: {
    nombre: 'Pulsera',
    elementos: [
      c(24, 25, 13),
      c(24, 25, 9.5),
      c(24, 10.5, 3.4),
      p('M11 25h26'),
    ],
  },
  madera: {
    nombre: 'Tallado en madera',
    elementos: [
      c(24, 12, 5.5),
      p('M14.5 43l3.5-16h12l3.5 16z'),
      p('M18 33.5h12'),
      p('M14 35.5 7.5 42'),
      p('M34 35.5 40.5 42'),
      p('M21 27l3 3-3 3-3-3z'),
    ],
  },
  muneca: {
    nombre: 'Muñeca de trapo',
    elementos: [
      c(24, 12, 6.5),
      p('M24 18.5 33.5 43h-19z'),
      p('M17.5 25 10 32'),
      p('M30.5 25 38 32'),
      p('M20 11.5c2.5 2 5.5 2 8 0'),
      p('M24 25v18'),
    ],
  },
};

/** Lista de nombres de motivos disponibles. */
export const NOMBRES_MOTIVOS = Object.keys(MOTIVOS);

/**
 * Convierte un elemento en su marca SVG.
 * @param {Elemento} elemento
 * @returns {string}
 */
function elementoAMarkup(elemento) {
  const n = (/** @type {number} */ valor) => Number(valor.toFixed(2));

  if (elemento.tipo === 'path') return `<path d="${elemento.d}"/>`;
  if (elemento.tipo === 'circle') {
    return `<circle cx="${n(elemento.cx)}" cy="${n(elemento.cy)}" r="${n(elemento.r)}"/>`;
  }
  return `<rect x="${n(elemento.x)}" y="${n(elemento.y)}" width="${n(elemento.ancho)}" height="${n(elemento.alto)}"${elemento.radio ? ` rx="${n(elemento.radio)}"` : ''}/>`;
}

/**
 * Marca SVG completa de un motivo.
 * @param {string} nombre
 * @param {{ tamano?: number, grosor?: number, clase?: string, titulo?: string, color?: string }} [opciones]
 * @returns {string}
 */
export function motivoSvg(nombre, opciones = {}) {
  const { tamano = 48, grosor = 1.9, clase = '', titulo = '', color = 'currentColor' } = opciones;
  const motivo = MOTIVOS[nombre] ?? MOTIVOS.vasija;
  const contenido = motivo.elementos.map(elementoAMarkup).join('');

  const atributosAccesibles = titulo
    ? `role="img" aria-label="${titulo.replace(/"/g, '&quot;')}"`
    : 'aria-hidden="true"';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${tamano}" height="${tamano}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round"${clase ? ` class="${clase}"` : ''} ${atributosAccesibles}>${contenido}</svg>`;
}

/**
 * Grupo SVG con los trazos del motivo, listo para incrustar dentro de otro SVG.
 * A diferencia de {@link motivoSvg} conserva los atributos de trazo en el propio
 * grupo, así que puede escalarse y trasladarse sin perder el estilo.
 * @param {string} nombre
 * @param {{ grosor?: number, color?: string }} [opciones]
 * @returns {string}
 */
export function motivoGrupo(nombre, opciones = {}) {
  const { grosor = 1.9, color = 'currentColor' } = opciones;
  const motivo = MOTIVOS[nombre] ?? MOTIVOS.vasija;
  const contenido = motivo.elementos.map(elementoAMarkup).join('');

  return (
    `<g fill="none" stroke="${color}" stroke-width="${grosor}" ` +
    `stroke-linecap="round" stroke-linejoin="round">${contenido}</g>`
  );
}

/**
 * Devuelve el nombre del motivo a partir del icono declarado en el producto.
 * @param {string} icono
 * @returns {string}
 */
export function motivoDesdeIcono(icono) {
  return Object.prototype.hasOwnProperty.call(MOTIVOS, icono) ? icono : 'vasija';
}
