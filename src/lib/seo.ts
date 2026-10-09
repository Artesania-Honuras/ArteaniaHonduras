import { SITE, CONTACTO, NEGOCIO, FUNCIONES } from '@/config/site';
import { urlAbsoluta, enlace } from '@/lib/rutas';
import type { ProductoVista } from '@/lib/catalogo';

type JsonLd = Record<string, unknown>;

/** Marcado estructurado de la organización / tienda. */
export function organizacionSchema(): JsonLd {
  const mismos = Object.values(CONTACTO.redes).filter(Boolean) as string[];

  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': NEGOCIO.tipo,
    '@id': `${SITE.url}/#organizacion`,
    name: SITE.nombre,
    alternateName: SITE.nombreCorto,
    description: SITE.descripcion,
    url: `${SITE.url}${enlace('/')}`,
    slogan: SITE.eslogan,
    foundingDate: String(SITE.anioFundacion),
    areaServed: NEGOCIO.zonaAtendida.map((zona) => ({ '@type': 'AdministrativeArea', name: zona })),
    knowsLanguage: ['es-HN'],
    priceRange: NEGOCIO.rangoPrecios,
    currenciesAccepted: SITE.moneda,
    paymentAccepted: 'Transferencia bancaria, Tigo Money, BAC Credomatic, pago contra entrega',
    image: urlAbsoluta('/imagenes/og-default.png'),
    logo: urlAbsoluta('/favicon.svg'),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: `+${CONTACTO.whatsapp.numero}`,
        availableLanguage: ['es'],
        areaServed: 'HN',
      },
    ],
  };

  if (mismos.length > 0) schema.sameAs = mismos;

  return schema;
}

/** Marcado estructurado del sitio web con su nombre y editor. */
export function sitioWebSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#sitio`,
    name: SITE.nombre,
    description: SITE.descripcion,
    url: `${SITE.url}${enlace('/')}`,
    inLanguage: SITE.idioma,
    publisher: { '@id': `${SITE.url}/#organizacion` },
  };
}

/** Migas de pan visibles y su marcado estructurado. */
export function migasSchema(migas: { nombre: string; ruta: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((miga, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: miga.nombre,
      item: urlAbsoluta(miga.ruta),
    })),
  };
}

/**
 * Ficha de producto.
 *
 * Nota deliberada: la Fase 1 trabaja con "consultar precio", por lo que NO se
 * emite `offers`. Un `offers` sin precio es marcado inválido y Google puede
 * penalizarlo. Cuando se activen precios fijos (FUNCIONES.mostrarPrecios) esta
 * función los incluirá automáticamente.
 */
export function productoSchema(producto: ProductoVista): JsonLd {
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': urlAbsoluta(`/producto/${producto.slug}/`),
    name: producto.nombre,
    description: producto.resumen,
    // `imagenPrincipal` ya viene con el base aplicado por `catalogo.ts`, así que
    // solo falta anteponerle el dominio.
    image: new URL(producto.imagenPrincipal, SITE.url).href,
    sku: producto.slug.toUpperCase().replace(/-/g, ''),
    category: producto.categoriaNombre,
    material: producto.materiales.join(', '),
    countryOfOrigin: { '@type': 'Country', name: 'Honduras' },
    brand: { '@type': 'Brand', name: SITE.nombre },
    manufacturer: { '@type': 'Organization', name: producto.taller.nombre },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Medidas', value: producto.medidas },
      { '@type': 'PropertyValue', name: 'Tiempo de elaboración', value: producto.tiempoElaboracion },
      { '@type': 'PropertyValue', name: 'Origen', value: `${producto.origen.municipio}, ${producto.origen.departamento}` },
    ],
  };

  if (FUNCIONES.mostrarPrecios && producto.precio) {
    schema.offers = {
      '@type': 'Offer',
      price: producto.precio,
      priceCurrency: SITE.moneda,
      availability: producto.disponible
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      url: urlAbsoluta(`/producto/${producto.slug}/`),
      seller: { '@id': `${SITE.url}/#organizacion` },
    };
  }

  return schema;
}

/** Marcado estructurado de la página de preguntas frecuentes. */
export function faqSchema(preguntas: readonly { pregunta: string; respuesta: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: preguntas.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
    })),
  };
}

/** Marcado estructurado de una lista de productos (página de catálogo). */
export function itemListSchema(productos: ProductoVista[], nombre: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: nombre,
    numberOfItems: productos.length,
    itemListElement: productos.map((producto, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      url: urlAbsoluta(`/producto/${producto.slug}/`),
      name: producto.nombre,
    })),
  };
}
