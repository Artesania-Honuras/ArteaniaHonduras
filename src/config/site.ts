/**
 * Configuración central del sitio Arteanía Honduras.
 *
 * Este es el ÚNICO archivo que hay que tocar para cambiar datos de contacto,
 * métodos de pago, envíos y banderas de funcionalidad. Ninguna página debe
 * tener datos de contacto escritos directamente.
 *
 * Cualquier valor marcado con `TODO:` es un dato pendiente de confirmar por
 * el negocio antes de difundir el enlace del sitio.
 */

export const SITE = {
  /** Nombre legal/comercial que aparece en el logo y los metadatos. */
  nombre: 'Arteanía Honduras',
  nombreCorto: 'Arteanía',
  /** Lema corto, se usa en el header, el footer y las tarjetas sociales. */
  eslogan: 'Artesanía hecha a mano en Honduras',
  /** Descripción de 150-160 caracteres para SEO y tarjetas sociales. */
  descripcion:
    'Arteanía Honduras reúne artesanías, textiles y joyería hechas a mano por artesanos hondureños. Piezas únicas con historia, envíos a todo Honduras y al extranjero.',
  /** URL canónica del sitio (sin el subdirectorio). */
  url: 'https://artesania-honuras.github.io',
  /** Subdirectorio de publicación en GitHub Pages. Debe coincidir con astro.config.mjs. */
  base: '/ArteaniaHonduras',
  idioma: 'es-HN',
  locale: 'es_HN',
  moneda: 'HNL',
  monedaSimbolo: 'L',
  pais: 'Honduras',
  anioFundacion: 2024,
} as const;

/**
 * Canal de contacto. Actualmente WhatsApp es el único canal oficial de la marca.
 * TODO: reemplazar `numero` por el número real en formato internacional sin
 * signos ni espacios (Honduras = 504 + 8 dígitos). El enlace no funcionará
 * mientras siga el valor de ejemplo.
 */
export const CONTACTO = {
  whatsapp: {
    numero: '50400000000',
    /** Cómo se muestra el número en el sitio. */
    numeroVisible: '+504 0000-0000',
    /** Mensaje que se prellena cuando el visitante abre el chat genérico. */
    mensajePorDefecto:
      '¡Hola Arteanía Honduras! Vengo desde su sitio web y quiero información sobre sus piezas artesanales.',
    horario: 'Lunes a sábado, 8:00 a.m. a 6:00 p.m. (hora de Honduras)',
  },
  /** Correo de respaldo para proveedores o facturación. Opcional. */
  correo: '',
  /** Redes sociales. Dejar vacío para que no se muestren en el footer. */
  redes: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
} as const;

/**
 * Banderas de funcionalidad de la Fase 1.
 *
 * `mostrarPrecios` está en `false` porque el negocio decidió trabajar con
 * "Consultar precio" por WhatsApp. Cuando se definan precios fijos basta con
 * poner `true` y llenar el campo `precio` de cada producto del catálogo.
 */
export const FUNCIONES = {
  mostrarPrecios: false,
  mostrarPreciosMayoreo: false,
  mostrarCarrito: false,
  mostrarFormularioContacto: false,
  mostrarBuscador: true,
} as const;

/** Categorías del catálogo en el orden en que se muestran en la navegación. */
export const NAVEGACION = [
  { etiqueta: 'Inicio', ruta: '/' },
  { etiqueta: 'Catálogo', ruta: '/tienda' },
  { etiqueta: 'Nuestra historia', ruta: '/nosotros' },
  { etiqueta: 'Envíos y pagos', ruta: '/envios-y-pagos' },
  { etiqueta: 'Preguntas frecuentes', ruta: '/preguntas-frecuentes' },
  { etiqueta: 'Contacto', ruta: '/contacto' },
] as const;

/**
 * Formas de pago aceptadas. En Fase 1 todas se cierran por WhatsApp; no hay
 * cobro automático en el sitio. Los datos bancarios NO se publican aquí: se
 * comparten de forma privada al confirmar cada pedido.
 */
export const METODOS_PAGO = [
  {
    id: 'whatsapp',
    nombre: 'Pedido y coordinación por WhatsApp',
    descripcion:
      'Eliges tus piezas, te confirmamos disponibilidad y cerramos el pedido en el chat. Es la vía más rápida y la que usamos para asesorarte sobre tamaños, colores y personalizaciones.',
    icono: 'chat',
    destacado: true,
  },
  {
    id: 'transferencia',
    nombre: 'Transferencia o depósito bancario',
    descripcion:
      'Al confirmar tu pedido te compartimos los datos de la cuenta por WhatsApp y enviamos tu pedido al verificarse el pago. Disponible en los principales bancos del país.',
    icono: 'banco',
    destacado: true,
  },
  {
    id: 'contra-entrega',
    nombre: 'Pago contra entrega',
    descripcion:
      'Pagas en efectivo al recibir tu pieza. Disponible en zonas de cobertura dentro de Honduras y sujeta al monto y a la zona de entrega.',
    icono: 'camion',
    destacado: false,
  },
  {
    id: 'tigo-money',
    nombre: 'Tigo Money',
    descripcion:
      'Billetera móvil ideal para montos pequeños y medianos. Te indicamos el número y el nombre de la cuenta al momento de confirmar.',
    icono: 'telefono',
    destacado: false,
  },
  {
    id: 'bac',
    nombre: 'BAC Credomatic',
    descripcion:
      'Transferencias y pagos con tarjeta a través de los canales de BAC Credomatic. Escríbenos para coordinar el detalle según el tipo de pedido.',
    icono: 'tarjeta',
    destacado: false,
  },
] as const;

/**
 * Modalidades de entrega. La tienda física es el punto de referencia de la marca.
 * TODO: completar dirección exacta, horarios y enlace de Google Maps.
 */
export const ENVIOS = [
  {
    id: 'nacional',
    nombre: 'Envíos a todo Honduras',
    descripcion:
      'Despachamos por courier a los 18 departamentos. El costo se calcula según destino, peso y volumen de la pieza, y te lo confirmamos por WhatsApp antes de pagar.',
    detalle: 'Entrega estimada: 1 a 3 días hábiles en zona urbana, hasta 5 días en zonas alejadas.',
    icono: 'camion',
  },
  {
    id: 'internacional',
    nombre: 'Envíos internacionales',
    descripcion:
      'Llevamos artesanía hondureña al exterior. Cotizamos por peso y destino con la paquetería disponible y te enviamos el detalle antes de confirmar el pedido.',
    detalle: 'Entrega estimada: 5 a 15 días hábiles según el país y la aduana de destino.',
    icono: 'globo',
  },
  {
    id: 'tienda-fisica',
    nombre: 'Tienda física y entrega en mano',
    descripcion:
      'Puedes conocer las piezas en persona, ver los acabados y recoger tu pedido sin costo de envío. Te esperamos con cita previa por WhatsApp.',
    detalle: 'Dirección y horarios por confirmar. Escríbenos para agendar tu visita.',
    icono: 'tienda',
  },
] as const;

/**
 * Preguntas frecuentes. Se usan en la página de FAQ y alimentan el marcado
 * estructurado FAQPage para aparecer en resultados enriquecidos de Google.
 */
export const PREGUNTAS_FRECUENTES = [
  {
    pregunta: '¿Cómo hago un pedido?',
    respuesta:
      'Elige las piezas que te gustan en el catálogo y toca el botón de WhatsApp. El mensaje se abre con el nombre de la pieza ya escrito, solo agrega tu ciudad y las dudas que tengas. Te confirmamos disponibilidad, valor y forma de entrega.',
  },
  {
    pregunta: '¿Por qué el catálogo no muestra precios?',
    respuesta:
      'Cada pieza es hecha a mano y su valor depende del tamaño, los materiales y el tiempo de elaboración del artesano. Preferimos darte un precio exacto y personalizado por WhatsApp, incluyendo opciones de envío, antes de que decidas.',
  },
  {
    pregunta: '¿Las piezas son iguales a las de las fotos?',
    respuesta:
      'Son piezas artesanales: cada una sale distinta del taller. Los colores y las medidas pueden variar ligeramente respecto a la fotografía. Si necesitas una medida o tono específico, escríbenos y lo consultamos con el taller antes de confirmar.',
  },
  {
    pregunta: '¿Puedo encargar una pieza personalizada?',
    respuesta:
      'Sí. Varias piezas admiten personalización de color, tamaño o grabado. Cuéntanos qué necesitas por WhatsApp y te decimos si el taller puede realizarlo, el tiempo de elaboración y el precio.',
  },
  {
    pregunta: '¿Cuánto tarda mi pedido?',
    respuesta:
      'Si la pieza está disponible, se despacha en 1 a 2 días hábiles. Si es sobre pedido o personalizada, el tiempo lo indica cada ficha de producto y empieza a contar desde que confirmas y se recibe el pago.',
  },
  {
    pregunta: '¿Cómo pago mi pedido?',
    respuesta:
      'Aceptamos transferencia o depósito bancario, Tigo Money, BAC Credomatic y pago contra entrega en zonas de cobertura. Los datos de pago se comparten de forma privada al confirmar el pedido.',
  },
  {
    pregunta: '¿Qué pasa si mi pedido llega dañado?',
    respuesta:
      'Escríbenos el mismo día de la entrega con fotografías del empaque y de la pieza. Al ser piezas únicas revisamos cada caso con el taller y te ofrecemos reposición, ajuste o devolución según corresponda.',
  },
  {
    pregunta: '¿Venden al mayoreo o para reventa?',
    respuesta:
      'Sí, trabajamos pedidos de mayoreo para hoteles, tiendas de souvenirs, empresas y eventos. Escríbenos por WhatsApp con las cantidades aproximadas y te preparamos una cotización.',
  },
] as const;

/** Metadatos del negocio reutilizados en el marcado estructurado. */
export const NEGOCIO = {
  tipo: 'Store',
  categoria: 'Artesanía y regalos',
  zonaAtendida: ['Honduras', 'Internacional'],
  /** Rango de precios orientativo para datos estructurados. */
  rangoPrecios: '$$',
} as const;
