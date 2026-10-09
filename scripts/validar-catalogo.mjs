/**
 * Validador del catálogo — sin dependencias externas.
 *
 * Comprueba la integridad de `src/data/categorias.json` y de cada archivo de
 * `src/data/productos/*.json` antes de compilar. Se ejecuta en CI y también
 * puede correrse a mano:
 *
 *   node scripts/validar-catalogo.mjs
 *
 * Sale con código 1 y una lista de errores si algo no cuadra.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR_DATOS = join(RAIZ, 'src', 'data');
const DIR_PRODUCTOS = join(DIR_DATOS, 'productos');

const ICONOS = [
  'vasija',
  'canasta',
  'tejido',
  'hamaca',
  'bolso',
  'collar',
  'aretes',
  'pulsera',
  'madera',
  'muneca',
];

const CAMPOS_PRODUCTO = [
  'slug',
  'nombre',
  'categoria',
  'subtitulo',
  'resumen',
  'descripcion',
  'materiales',
  'medidas',
  'cuidados',
  'origen',
  'taller',
  'tiempoElaboracion',
  'personalizable',
  'destacado',
  'etiquetas',
  'colores',
  'icono',
];

const errores = [];
const avisos = [];

const error = (mensaje) => errores.push(mensaje);
const aviso = (mensaje) => avisos.push(mensaje);

function leerJson(ruta, etiqueta) {
  try {
    return JSON.parse(readFileSync(ruta, 'utf8'));
  } catch (causa) {
    error(`${etiqueta}: no es JSON válido — ${causa.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------

const categorias = leerJson(join(DIR_DATOS, 'categorias.json'), 'categorias.json');

if (!Array.isArray(categorias)) {
  error('categorias.json debe ser un arreglo de categorías.');
}

const slugsCategoria = new Set();
for (const [indice, categoria] of (categorias ?? []).entries()) {
  const etiqueta = `categorias.json[${indice}]`;
  for (const campo of ['slug', 'nombre', 'descripcion', 'icono', 'color']) {
    if (typeof categoria?.[campo] !== 'string' || categoria[campo].trim() === '') {
      error(`${etiqueta}: falta el campo "${campo}" o está vacío.`);
    }
  }
  if (categoria?.icono && !ICONOS.includes(categoria.icono)) {
    error(`${etiqueta}: el icono "${categoria.icono}" no es válido.`);
  }
  if (categoria?.color && !/^#[0-9a-fA-F]{6}$/.test(categoria.color)) {
    error(`${etiqueta}: el color "${categoria.color}" no es un hexadecimal de 6 dígitos.`);
  }
  if (slugsCategoria.has(categoria?.slug)) {
    error(`${etiqueta}: la categoría "${categoria.slug}" está duplicada.`);
  }
  slugsCategoria.add(categoria?.slug);
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------

const archivos = readdirSync(DIR_PRODUCTOS)
  .filter((nombre) => nombre.endsWith('.json'))
  .sort();

if (archivos.length === 0) {
  error('No hay ningún producto en src/data/productos/.');
}

const slugsProducto = new Set();
const conteoPorCategoria = {};

for (const archivo of archivos) {
  const ruta = join(DIR_PRODUCTOS, archivo);
  const producto = leerJson(ruta, archivo);
  if (!producto) continue;

  const etiqueta = archivo;

  // Campos obligatorios
  for (const campo of CAMPOS_PRODUCTO) {
    if (producto[campo] === undefined || producto[campo] === null) {
      error(`${etiqueta}: falta el campo obligatorio "${campo}".`);
    }
  }

  // Sin precios: la Fase 1 trabaja con "consultar precio"
  if ('precio' in producto && producto.precio !== undefined) {
    aviso(
      `${etiqueta}: declara "precio". No se mostrará mientras FUNCIONES.mostrarPrecios sea false.`,
    );
  }

  // Slug coherente con el nombre del archivo
  if (producto.slug !== archivo.replace(/\.json$/, '')) {
    error(`${etiqueta}: el slug "${producto.slug}" no coincide con el nombre del archivo.`);
  }
  if (producto.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(producto.slug)) {
    error(`${etiqueta}: el slug "${producto.slug}" debe ser kebab-case sin tildes ni espacios.`);
  }
  if (slugsProducto.has(producto.slug)) {
    error(`${etiqueta}: el slug "${producto.slug}" está duplicado.`);
  }
  slugsProducto.add(producto.slug);

  // Categoría existente
  if (producto.categoria && !slugsCategoria.has(producto.categoria)) {
    error(`${etiqueta}: la categoría "${producto.categoria}" no existe en categorias.json.`);
  }
  conteoPorCategoria[producto.categoria] = (conteoPorCategoria[producto.categoria] ?? 0) + 1;

  // Icono
  if (producto.icono && !ICONOS.includes(producto.icono)) {
    error(`${etiqueta}: el icono "${producto.icono}" no es válido.`);
  }

  // Tipos y longitudes
  if (typeof producto.subtitulo === 'string' && producto.subtitulo.length > 90) {
    aviso(`${etiqueta}: el subtítulo supera los 90 caracteres.`);
  }
  if (typeof producto.resumen === 'string' && producto.resumen.length > 220) {
    aviso(`${etiqueta}: el resumen supera los 220 caracteres.`);
  }

  if (!Array.isArray(producto.descripcion) || producto.descripcion.length === 0) {
    error(`${etiqueta}: "descripcion" debe ser un arreglo con al menos un párrafo.`);
  }
  for (const [campo, minimo] of [
    ['materiales', 1],
    ['cuidados', 1],
    ['etiquetas', 1],
    ['colores', 1],
  ]) {
    if (!Array.isArray(producto[campo]) || producto[campo].length < minimo) {
      error(`${etiqueta}: "${campo}" debe ser un arreglo con al menos ${minimo} elemento(s).`);
    }
  }

  if (Array.isArray(producto.colores)) {
    for (const color of producto.colores) {
      if (typeof color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(color)) {
        error(`${etiqueta}: el color "${color}" no es un hexadecimal de 6 dígitos.`);
      }
    }
  }

  // Origen y taller
  for (const campo of ['departamento', 'municipio']) {
    if (typeof producto.origen?.[campo] !== 'string' || producto.origen[campo].trim() === '') {
      error(`${etiqueta}: "origen.${campo}" es obligatorio.`);
    }
  }
  for (const campo of ['nombre', 'artesano', 'historia']) {
    if (typeof producto.taller?.[campo] !== 'string' || producto.taller[campo].trim() === '') {
      error(`${etiqueta}: "taller.${campo}" es obligatorio.`);
    }
  }

  if (typeof producto.personalizable !== 'boolean') {
    error(`${etiqueta}: "personalizable" debe ser true o false.`);
  }
  if (typeof producto.destacado !== 'boolean') {
    error(`${etiqueta}: "destacado" debe ser true o false.`);
  }
}

// ---------------------------------------------------------------------------
// Resumen
// ---------------------------------------------------------------------------

console.log(`Productos analizados: ${archivos.length}`);
console.log(`Categorías: ${[...slugsCategoria].join(', ') || 'ninguna'}`);
console.log(
  `Reparto: ${Object.entries(conteoPorCategoria)
    .map(([categoria, total]) => `${categoria}=${total}`)
    .join(' · ')}`,
);

if (avisos.length > 0) {
  console.log(`\n${avisos.length} aviso(s):`);
  for (const mensaje of avisos) console.log(`  · ${mensaje}`);
}

if (errores.length > 0) {
  console.error(`\n${errores.length} error(es):`);
  for (const mensaje of errores) console.error(`  ✗ ${mensaje}`);
  process.exit(1);
}

console.log('\n✓ Catálogo válido.');
