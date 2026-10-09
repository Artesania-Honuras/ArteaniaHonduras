import { CONTACTO, FUNCIONES, SITE } from '@/config/site';
import { urlAbsoluta } from '@/lib/rutas';

/** Devuelve `true` si el número de WhatsApp ya fue reemplazado por uno real. */
export function whatsappConfigurado(): boolean {
  return /^\d{11,15}$/.test(CONTACTO.whatsapp.numero) && !CONTACTO.whatsapp.numero.includes('0000000');
}

/**
 * Construye el enlace de WhatsApp con el mensaje ya codificado.
 * Si no se pasa mensaje se usa el saludo por defecto de la marca.
 */
export function enlaceWhatsApp(mensaje?: string): string {
  const texto = (mensaje?.trim() || CONTACTO.whatsapp.mensajePorDefecto).slice(0, 900);
  return `https://wa.me/${CONTACTO.whatsapp.numero}?text=${encodeURIComponent(texto)}`;
}

/** Mensaje prellenado para consultar una pieza del catálogo. */
export function mensajeProducto(producto: {
  nombre: string;
  slug: string;
  categoriaNombre?: string;
}): string {
  const lineas = [
    `¡Hola ${SITE.nombre}! Me interesa esta pieza del catálogo:`,
    '',
    `• ${producto.nombre}${producto.categoriaNombre ? ` (${producto.categoriaNombre})` : ''}`,
    // Se usa urlAbsoluta() para que el enlace incluya el subdirectorio de
    // GitHub Pages; construirlo a mano producía un 404 al abrirlo desde el chat.
    `• Enlace: ${urlAbsoluta(`/producto/${producto.slug}/`)}`,
    '',
    FUNCIONES.mostrarPrecios
      ? '¿Está disponible y cuál es el total con envío?'
      : '¿Está disponible? ¿Me compartes el precio y el costo de envío?',
    'Mi ciudad es: ',
  ];

  return lineas.join('\n');
}

/** Mensaje prellenado para una categoría completa. */
export function mensajeCategoria(categoria: { nombre: string; slug: string }): string {
  return [
    `¡Hola ${SITE.nombre}! Quiero ver opciones de la categoría ${categoria.nombre}.`,
    '',
    'Me interesan piezas para: (regalo / uso personal / reventa)',
    'Mi ciudad es: ',
  ].join('\n');
}

/** Mensaje prellenado para pedidos de mayoreo. */
export function mensajeMayoreo(): string {
  return [
    `¡Hola ${SITE.nombre}! Quiero cotizar un pedido de mayoreo.`,
    '',
    '• Tipo de piezas: ',
    '• Cantidad aproximada: ',
    '• Fecha en que las necesito: ',
    '• Ciudad de entrega: ',
  ].join('\n');
}

/** Mensaje prellenado para consultas generales desde la página de contacto. */
export function mensajeGeneral(asunto?: string): string {
  return [
    `¡Hola ${SITE.nombre}!`,
    asunto ? `Motivo: ${asunto}` : 'Motivo: ',
    '',
    'Cuéntanos en qué te podemos ayudar: ',
  ].join('\n');
}

/**
 * Aviso de configuración pendiente, una sola vez por proceso de build.
 * Es intencionalmente ruidoso: un sitio publicado con el número de ejemplo no
 * puede recibir pedidos.
 */
if (!whatsappConfigurado()) {
  console.warn(
    '\n[Artesanías De Honduras] ATENCIÓN: CONTACTO.whatsapp.numero sigue con el valor de ejemplo.\n' +
      '  Edita src/config/site.ts y coloca el número real en formato internacional (504 + 8 dígitos).\n' +
      '  Mientras no lo hagas, todos los botones de WhatsApp abrirán un chat inexistente.\n',
  );
}
