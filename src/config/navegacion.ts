/**
 * Enlaces de navegación del footer y páginas legales.
 *
 * Se mantienen en un módulo aparte para que el footer no dependa del catálogo
 * de productos y se pueda renderizar aunque la colección esté vacía.
 */

export const CATEGORIAS_FOOTER = [
  { slug: 'artesanias', nombre: 'Artesanías y manualidades' },
  { slug: 'textiles', nombre: 'Textiles y ropa típica' },
  { slug: 'joyeria', nombre: 'Joyería y accesorios' },
] as const;

export const ENLACES_LEGALES = [
  { etiqueta: 'Envíos y pagos', ruta: '/envios-y-pagos' },
  { etiqueta: 'Preguntas frecuentes', ruta: '/preguntas-frecuentes' },
  { etiqueta: 'Nuestra historia', ruta: '/nosotros' },
  { etiqueta: 'Contacto', ruta: '/contacto' },
  { etiqueta: 'Política de privacidad', ruta: '/privacidad' },
  { etiqueta: 'Términos y condiciones', ruta: '/terminos' },
] as const;
