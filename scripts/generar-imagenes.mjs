/**
 * Generador de ilustraciones de Arteanía Honduras.
 *
 * Crea, a partir del catálogo real, las ilustraciones SVG de cada producto, la
 * imagen del héroe y el favicon. Es determinista e idempotente: volver a
 * ejecutarlo produce exactamente los mismos archivos.
 *
 * Las ilustraciones son composiciones geométricas inspiradas en el bordado
 * lenca. No incluyen texto a propósito: cuando un SVG se usa como imagen no
 * puede cargar las tipografías del sitio y el texto se vería inconsistente.
 * El nombre de la pieza ya aparece en la tarjeta, debajo de la imagen.
 *
 * Uso:
 *   node scripts/generar-imagenes.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { motivoGrupo, motivoDesdeIcono } from '../src/lib/motivos.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR_DATOS = join(RAIZ, 'src', 'data');
const DIR_PRODUCTOS = join(DIR_DATOS, 'productos');
const DIR_SALIDA_PRODUCTOS = join(RAIZ, 'public', 'imagenes', 'productos');
const DIR_SALIDA = join(RAIZ, 'public', 'imagenes');

/** Paleta de respaldo si un producto no trae colores válidos. */
const RESPALDO = ['#b4522c', '#c8933a'];

/** Mezcla dos colores hexadecimales. `proporcion` 0 = a, 1 = b. */
function mezclar(a, b, proporcion) {
  const partes = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [r1, g1, b1] = partes(a);
  const [r2, g2, b2] = partes(b);
  const canal = (x, y) => Math.round(x + (y - x) * proporcion);
  return `#${[canal(r1, r2), canal(g1, g2), canal(b1, b2)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Patrón de rombos lenca como `<pattern>` reutilizable. */
function patronLenca(id, color, opacidad, lado = 54) {
  const mitad = lado / 2;
  return `<pattern id="${id}" width="${lado}" height="${lado}" patternUnits="userSpaceOnUse">
      <g fill="none" stroke="${color}" stroke-opacity="${opacidad}" stroke-width="1.1">
        <path d="M${mitad} 3 L${lado - 3} ${mitad} L${mitad} ${lado - 3} L3 ${mitad} Z" />
        <path d="M${mitad} ${mitad * 0.5} L${mitad * 1.5} ${mitad} L${mitad} ${mitad * 1.5} L${mitad * 0.5} ${mitad} Z" />
      </g>
    </pattern>`;
}

/**
 * Ilustración cuadrada de un producto.
 * @param {any} producto
 * @returns {string}
 */
function ilustracionProducto(producto) {
  const colores =
    Array.isArray(producto.colores) && producto.colores.length > 0 ? producto.colores : RESPALDO;
  const principal = colores[0];
  const secundario = colores[1] ?? mezclar(principal, '#ffffff', 0.4);

  const claro = mezclar(principal, '#faf4ec', 0.86);
  const medio = mezclar(principal, '#faf4ec', 0.62);
  const id = producto.slug;

  // El motivo vive en una retícula de 48×48; se escala para ocupar el centro.
  const escala = 8.6;
  const centroX = 400;
  const centroY = 360;

  const motivo = motivoGrupo(motivoDesdeIcono(producto.icono), {
    grosor: 1.8,
    color: principal,
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800" role="img" aria-label="Ilustración de ${escapar(producto.nombre)}">
  <defs>
    <linearGradient id="fondo-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fefbf7" />
      <stop offset="55%" stop-color="${claro}" />
      <stop offset="100%" stop-color="${medio}" />
    </linearGradient>
    ${patronLenca(`lenca-${id}`, principal, 0.13)}
  </defs>

  <rect width="800" height="800" fill="url(#fondo-${id})" />
  <rect width="800" height="800" fill="url(#lenca-${id})" />

  <circle cx="${centroX}" cy="${centroY}" r="238" fill="#fffdfa" fill-opacity="0.9" />
  <circle cx="${centroX}" cy="${centroY}" r="238" fill="none" stroke="${secundario}" stroke-opacity="0.55" stroke-width="3" />
  <circle cx="${centroX}" cy="${centroY}" r="214" fill="none" stroke="${principal}" stroke-opacity="0.22" stroke-width="1.5" stroke-dasharray="7 9" />

  <g transform="translate(${centroX} ${centroY}) scale(${escala}) translate(-24 -24)">
    ${motivo}
  </g>

  <g fill="${principal}" fill-opacity="0.9">
    <path d="M400 640 l16 22 -16 22 -16 -22 z" />
  </g>
  <path d="M250 700 H550" stroke="${principal}" stroke-opacity="0.35" stroke-width="2" stroke-linecap="round" />
  <path d="M300 726 H500" stroke="${principal}" stroke-opacity="0.22" stroke-width="2" stroke-linecap="round" />

  <rect x="22" y="22" width="756" height="756" fill="none" stroke="${principal}" stroke-opacity="0.3" stroke-width="2.5" rx="26" />
</svg>
`;
}

/** Imagen principal del héroe: composición de tres oficios. */
function ilustracionHero(iconos = ['vasija', 'tejido', 'collar']) {
  const paleta = ['#b4522c', '#6e7c4b', '#2f4a66'];
  const piezas = iconos.map((icono, indice) => {
    const color = paleta[indice % paleta.length];
    const posiciones = [
      { x: 320, y: 330, escala: 8.4 },
      { x: 660, y: 470, escala: 6.6 },
      { x: 430, y: 730, escala: 6.2 },
    ];
    const { x, y, escala } = posiciones[indice % posiciones.length];
    const motivo = motivoGrupo(motivoDesdeIcono(icono), { grosor: 1.8, color });

    return `<g transform="translate(${x} ${y}) scale(${escala}) translate(-24 -24)">
      ${motivo}
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" role="img" aria-label="Composición de piezas artesanales hondureñas: barro lenca, textil y joyería">
  <defs>
    <linearGradient id="hero-fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#faf4ec" />
      <stop offset="45%" stop-color="#f3e7d8" />
      <stop offset="100%" stop-color="#ebbfa6" />
    </linearGradient>
    <radialGradient id="hero-brillo" cx="0.35" cy="0.3" r="0.75">
      <stop offset="0%" stop-color="#fffdfa" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#fffdfa" stop-opacity="0" />
    </radialGradient>
    ${patronLenca('hero-lenca', '#b4522c', 0.14)}
  </defs>

  <rect width="1000" height="1000" fill="url(#hero-fondo)" />
  <rect width="1000" height="1000" fill="url(#hero-lenca)" />
  <rect width="1000" height="1000" fill="url(#hero-brillo)" />

  <circle cx="320" cy="330" r="215" fill="#fffdfa" fill-opacity="0.82" />
  <circle cx="660" cy="470" r="168" fill="#fffdfa" fill-opacity="0.74" />
  <circle cx="430" cy="730" r="150" fill="#fffdfa" fill-opacity="0.7" />

  ${piezas.join('\n  ')}

  <g fill="none" stroke="#b4522c" stroke-opacity="0.3" stroke-width="3">
    <path d="M40 40 H240 M40 40 V240" stroke-linecap="round" />
    <path d="M960 40 H760 M960 40 V240" stroke-linecap="round" />
    <path d="M40 960 H240 M40 960 V760" stroke-linecap="round" />
    <path d="M960 960 H760 M960 960 V760" stroke-linecap="round" />
  </g>

  <g fill="#b4522c" fill-opacity="0.85">
    <path d="M500 96 l14 20 -14 20 -14 -20 z" />
    <path d="M500 864 l14 20 -14 20 -14 -20 z" />
  </g>
</svg>
`;
}

/** Favicon: rombo lenca con la "A" de Arteanía. */
function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="Arteanía Honduras">
  <rect width="48" height="48" rx="10" fill="#faf4ec" />
  <path d="M24 4 44 24 24 44 4 24z" fill="#b4522c" />
  <path d="M24 10.5 37.5 24 24 37.5 10.5 24z" fill="#c8933a" />
  <g fill="none" stroke="#451d0f" stroke-width="2.6" stroke-linecap="round">
    <path d="M24 14 33 34" />
    <path d="M24 14 15 34" />
    <path d="M19.4 27.5 h9.2" />
  </g>
</svg>
`;
}

function escapar(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Manifiesto de aplicación web. */
function manifiesto() {
  return `${JSON.stringify(
    {
      name: 'Arteanía Honduras',
      short_name: 'Arteanía',
      description:
        'Artesanías, textiles y joyería hechas a mano en Honduras. Pedidos por WhatsApp.',
      start_url: './',
      scope: './',
      display: 'standalone',
      background_color: '#faf4ec',
      theme_color: '#b4522c',
      lang: 'es-HN',
      icons: [
        { src: './favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: './apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2,
  )}\n`;
}

/** robots.txt acorde al subdirectorio de publicación. */
function robots() {
  return `# Arteanía Honduras
User-agent: *
Allow: /

# Sitemap del sitio (GitHub Pages sirve el sitio bajo /ArteaniaHonduras/)
Sitemap: https://artesania-honuras.github.io/ArteaniaHonduras/sitemap-index.xml
`;
}

function asegurarDirectorio(ruta) {
  mkdirSync(ruta, { recursive: true });
}

// ---------------------------------------------------------------------------
// Ejecución
// ---------------------------------------------------------------------------

const archivosProductos = readdirSync(DIR_PRODUCTOS).filter((nombre) => nombre.endsWith('.json'));
const categorias = JSON.parse(readFileSync(join(DIR_DATOS, 'categorias.json'), 'utf8'));

asegurarDirectorio(DIR_SALIDA_PRODUCTOS);
asegurarDirectorio(DIR_SALIDA);

let generados = 0;

for (const archivo of archivosProductos) {
  const producto = JSON.parse(readFileSync(join(DIR_PRODUCTOS, archivo), 'utf8'));
  const destino = join(DIR_SALIDA_PRODUCTOS, `${producto.slug}.svg`);
  writeFileSync(destino, ilustracionProducto(producto), 'utf8');
  generados += 1;
}

const iconosHeroe = categorias.map((categoria) => categoria.icono).filter(Boolean);
writeFileSync(join(DIR_SALIDA, 'hero.svg'), ilustracionHero(iconosHeroe), 'utf8');
writeFileSync(join(RAIZ, 'public', 'favicon.svg'), favicon(), 'utf8');
writeFileSync(join(RAIZ, 'public', 'manifest.webmanifest'), manifiesto(), 'utf8');
writeFileSync(join(RAIZ, 'public', 'robots.txt'), robots(), 'utf8');

console.log(`✓ ${generados} ilustraciones de producto en public/imagenes/productos/`);
console.log('✓ public/imagenes/hero.svg');
console.log('✓ public/favicon.svg');
console.log('✓ public/manifest.webmanifest');
console.log('✓ public/robots.txt');
console.log('\nNota: og-default.png y apple-touch-icon.png son imágenes raster y se');
console.log('regeneran con `python scripts/generar-raster.py` (requiere Pillow).');
