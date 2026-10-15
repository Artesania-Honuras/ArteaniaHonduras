---
titulo: Inventario de archivos
tags:
  - proyecto
  - inventario
  - referencia
actualizado: 2026-10-09
estado: vigente
---

# Inventario de archivos

Mapa completo del proyecto: **102 archivos rastreados por git**. Sirve para saber qué es cada cosa
sin abrirla. Si es tu primera vez en la bóveda, empieza por [INICIO](INICIO.md).

**Leyenda de la columna «Origen»:**

| Marca | Significado |
| ----- | ----------- |
| ✍️ **A mano** | Se edita a mano y se versiona tal cual. |
| ⚙️ **Generado** | Lo produce un script del proyecto. No se edita a mano: se regenera con su comando. |

Documentos relacionados: [README](../README.md) · [ANALISIS](../ANALISIS.md) · [ARQUITECTURA](ARQUITECTURA.md) · [GUIA-CONTENIDO](GUIA-CONTENIDO.md) ·
[CHECKLIST-LANZAMIENTO](CHECKLIST-LANZAMIENTO.md) · [ROADMAP-TIENDA](ROADMAP-TIENDA.md) · [CHANGELOG](../CHANGELOG.md)

---

## Raíz

Configuración del proyecto y documentos de portada.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `.editorconfig` | Convenciones de edición compartidas entre editores: UTF-8, fin de línea LF, dos espacios y 100 columnas. | ✍️ A mano |
| `.gitattributes` | Normaliza los finales de línea a LF en todo el repositorio. Es el único archivo que sobrevive del commit inicial. | ✍️ A mano |
| `.gitignore` | Qué queda fuera de git: dependencias, artefactos de compilación, cachés y las carpetas de trabajo privadas. | ✍️ A mano |
| `.prettierignore` | Rutas que Prettier no debe formatear: compilación, dependencias y las ilustraciones generadas. | ✍️ A mano |
| `.prettierrc.json` | Reglas de formato: 100 columnas, comillas simples, punto y coma, y el plugin de Astro. | ✍️ A mano |
| `AGENTS.md` | **Reglas obligatorias para agentes y para cualquier sesión nueva.** Empieza con el puntero al índice de la memoria y define las tres reglas: registro, cambios y estado. | ✍️ A mano |
| `ANALISIS.md` | Análisis del repositorio original: qué había, diagnóstico, riesgos, decisiones tomadas y hoja de ruta por fases. Ver [ANALISIS](../ANALISIS.md). | ✍️ A mano |
| `CHANGELOG.md` | Historial de versiones en formato Keep a Changelog, con lo añadido, lo corregido y lo pendiente. Ver [CHANGELOG](../CHANGELOG.md). | ✍️ A mano |
| `LICENSE` | Condiciones de uso: el contenido es propiedad de la marca con todos los derechos reservados y **no hay licencia de código abierto**. Ver [LICENSE](../LICENSE). | ✍️ A mano |
| `README.md` | Portada del proyecto: requisitos, comandos, estructura, despliegue y la lista de pendientes antes de difundir el enlace. Ver [README](../README.md). | ✍️ A mano |
| `astro.config.mjs` | Configuración de Astro: `site`, el `base` `/ArteaniaHonduras`, el sitemap, el plugin de Tailwind y el alias `@`. | ✍️ A mano |
| `package-lock.json` | Árbol de dependencias exacto y congelado, para que `npm ci` instale siempre lo mismo en CI. Lo escribe npm. | ⚙️ Generado |
| `package.json` | Dependencias del proyecto y **12 comandos**: `dev`, `start`, `build`, `preview`, `check`, `verify`, `format`, `format:check`, `catalogo:validar`, `imagenes:generar`, `fotos:procesar` y `estado`. | ✍️ A mano |
| `tsconfig.json` | Configuración de TypeScript: modo estricto, alias `@/*` hacia `src/` y exclusión de las carpetas que no deben analizarse. | ✍️ A mano |

---

## `.github/`

Automatización e integración con GitHub.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `.github/ISSUE_TEMPLATE/config.yml` | Configuración del selector de incidencias: permite crear incidencias en blanco y ofrece un enlace de contacto. | ✍️ A mano |
| `.github/dependabot.yml` | Actualizaciones automáticas: agrupa las versiones menores y de parche y **no propone saltos de versión mayor** de Astro, Tailwind, TypeScript ni `sharp`. | ✍️ A mano |
| `.github/pull_request_template.md` | Plantilla de pull request con el checklist de verificación y las trampas conocidas del proyecto. | ✍️ A mano |
| `.github/workflows/ci.yml` | Integración continua en cada push a `master` y en cada pull request: `astro check`, validación del catálogo y compilación. Incluye el **guardián que falla si el WhatsApp vuelve a ser un valor de ejemplo**. | ✍️ A mano |
| `.github/workflows/deploy.yml` | Publica el sitio en GitHub Pages en cada push a `master`: compila, sube el artefacto y lo despliega con las acciones oficiales de Pages. | ✍️ A mano |

---

## `docs/`

Documentación de referencia y guías operativas.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `docs/INICIO.md` | **Puntero al índice de la memoria.** Se conserva para que los enlaces antiguos y la nota raíz de la bóveda sigan resolviendo. | ✍️ A mano |
| `docs/INVENTARIO.md` | Este mismo documento: inventario archivo por archivo, con una marca de si se edita a mano o se genera. | ✍️ A mano |
| `docs/ARQUITECTURA.md` | Cómo está construido el sitio: flujo de datos desde los JSON hasta las páginas, sistema de diseño, el helper `enlace()` y el problema del subdirectorio, SEO y accesibilidad. Ver [ARQUITECTURA](ARQUITECTURA.md). | ✍️ A mano |
| `docs/CHECKLIST-LANZAMIENTO.md` | Checklist de lanzamiento por bloques (contacto, contenido, legal, SEO, operación y técnico) con lo ya resuelto y los pendientes reales. Ver [CHECKLIST-LANZAMIENTO](CHECKLIST-LANZAMIENTO.md). | ✍️ A mano |
| `docs/GUIA-CONTENIDO.md` | Guía para editar el sitio **sin saber programar**: cambiar el WhatsApp, agregar un producto, poner fotografías reales, activar precios y qué hacer si el build falla. Ver [GUIA-CONTENIDO](GUIA-CONTENIDO.md). | ✍️ A mano |
| `docs/ROADMAP-TIENDA.md` | Fases 2 y 3 del proyecto: carrito, checkout, Tigo Money, BAC Credomatic, contra entrega, panel de administración e inventario. Ver [ROADMAP-TIENDA](ROADMAP-TIENDA.md). | ✍️ A mano |

### Memoria del proyecto (`docs/memoria/`)

Registro operativo del proyecto: qué se cambió, qué se midió y qué se decidió. Ver [INDICE](memoria/INDICE.md).

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `docs/memoria/INDICE.md` | **Lo primero que debe leer una sesión nueva:** mapa, decisiones vivas con su evidencia, fuentes de verdad, criterios de aceptación y pendientes priorizados. | ✍️ A mano |
| `docs/memoria/MANUAL-DE-CAMBIOS.md` | Una entrada `C-NN` por cambio aplicado: qué, por qué, evidencia numérica y cómo revertirlo. Diez entradas hasta hoy. | ✍️ A mano |
| `docs/memoria/REGISTRO-DE-RESULTADOS.md` | Una fila `E-NN` por medición con hipótesis, método, números y veredicto. **Incluye los experimentos descartados.** Once entradas hasta hoy. | ✍️ A mano |
| `docs/memoria/LOG-DE-SESIONES.md` | Bitácora de cada sesión: qué se hizo, qué se rompió, qué se decidió y qué quedó abierto. Absorbió al antiguo `docs/HISTORIAL.md`. | ✍️ A mano |
| `docs/memoria/PLANTILLAS.md` | Formatos vacíos de `C-NN`, `E-NN` y entrada de sesión, para que el registro sea consistente. | ✍️ A mano |

### Bóveda de Obsidian

El repositorio se abre directamente como bóveda de Obsidian (*Abrir carpeta como bóveda* → la raíz).

**La carpeta `.obsidian/` NO se versiona** (decisión C-10): Obsidian la reescribe en cada apertura
—registra los plugins de su versión, crea `graph.json` y quita el salto de línea final—, así que
tenerla en git dejaba el repositorio sucio de forma permanente. Obsidian la regenera sola al abrir
la bóveda por primera vez.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `docs/mapa-proyecto.canvas` | Lienzo visual de Obsidian con la arquitectura, el estado y la hoja de ruta. | ✍️ A mano |
| `docs/plantillas/PLANTILLA-NOTA.md` | Plantilla para crear notas nuevas. Obsidian la encuentra en `docs/plantillas`. | ✍️ A mano |

El repositorio se abre directamente como bóveda de Obsidian. Se versiona la configuración; el
estado local de cada persona (pestañas abiertas, caché) queda fuera por `.gitignore`.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `.obsidian/app.json` | Configuración de la bóveda: enlaces en formato Markdown, carpeta de notas nuevas y filtros que excluyen código, dependencias y compilados del grafo. | ✍️ A mano |
| `.obsidian/appearance.json` | Tema y color de acento de la bóveda. | ✍️ A mano |
| `.obsidian/core-plugins.json` | Complementos integrados activos (grafo, plantillas, lienzo, propiedades…). | ✍️ A mano |
| `.obsidian/templates.json` | Carpeta de plantillas: apunta a `docs/plantillas`. | ✍️ A mano |
| `docs/mapa-proyecto.canvas` | Lienzo visual de Obsidian con la arquitectura, el estado y la hoja de ruta. | ✍️ A mano |
| `docs/plantillas/PLANTILLA-NOTA.md` | Plantilla para crear notas nuevas. | ✍️ A mano |

---

## `scripts/`

Herramientas de generación y validación. Ninguna se ejecuta durante la compilación del sitio salvo
la validación del catálogo, que va aparte.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `scripts/generar-imagenes.mjs` | Genera las 13 ilustraciones SVG, el favicon, el manifest y el `robots.txt` a partir del catálogo real. Comando: `npm run imagenes:generar`. | ✍️ A mano |
| `scripts/generar-raster.py` | Genera las dos únicas imágenes raster: la tarjeta de Open Graph y el icono de iOS. Requiere Python con Pillow y se ejecuta a mano. | ✍️ A mano |
| `scripts/procesar-fotos.py` | Toma las fotos de `fotos-originales/`, las redimensiona, **les quita el EXIF y el GPS**, las convierte a WebP y actualiza los JSON de producto. Comando: `npm run fotos:procesar`. | ✍️ A mano |
| `scripts/estado.py` | **Instrumento de medición del proyecto.** Checklist de solo lectura y sin dependencias que recorre 41 comprobaciones en 6 bloques: servicios, conectividad externa, frescura de la publicación, configuración viva, repositorio y hardware. Comando: `npm run estado`. | ✍️ A mano |
| `scripts/validar-catalogo.mjs` | Valida categorías y productos **sin dependencias externas ni compilar el sitio**, con mensajes de error claros. Comando: `npm run catalogo:validar`. | ✍️ A mano |

---

## `public/`

Todo lo que está aquí se publica tal cual, sin procesar. **Son 18 archivos, y los 18 son
generados**: no se editan a mano.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `public/apple-touch-icon.png` | Icono de 180×180 para iOS. Lo produce `scripts/generar-raster.py`. | ⚙️ Generado |
| `public/favicon.svg` | Icono del sitio: rombo lenca con la «A». Lo produce `scripts/generar-imagenes.mjs`. | ⚙️ Generado |
| `public/manifest.webmanifest` | Metadatos de aplicación web instalable: nombre, colores, idioma e iconos. | ⚙️ Generado |
| `public/robots.txt` | Permite el rastreo de todo el sitio y declara la ubicación del sitemap. | ⚙️ Generado |
| `public/imagenes/og-default.png` | Tarjeta social de 1200×630 que se ve al compartir cualquier enlace. La produce `scripts/generar-raster.py`. | ⚙️ Generado |
| `public/imagenes/hero.svg` | Composición del héroe de la portada, con un motivo por cada categoría. | ⚙️ Generado |
| `public/imagenes/productos/` | **12 ilustraciones, una por producto**, que se sustituyen solas en cuanto el producto tiene fotografía real. Nombres: `aretes-coco-concha-roatan.svg`, `aretes-filigrana-plata-gracias.svg`, `bolso-fibra-tela-atlantida.svg`, `canasta-fibra-tuno-puerto-lempira.svg`, `collar-tagua-plata-copan.svg`, `figura-tallada-madera-valle-de-angeles.svg`, `hamaca-algodon-choluteca.svg`, `manta-telar-cintura-lenca.svg`, `mantel-bordado-lenca-la-campa.svg`, `muneca-trapo-lenca-la-esperanza.svg`, `pulsera-cuero-trenzado-comayagua.svg`, `vasija-barro-lenca-marcala.svg`. Se regeneran con `npm run imagenes:generar`. | ⚙️ Generado |

---

## `src/config/`

Los datos del negocio, separados del diseño. **Ninguna página debe tener teléfonos, precios ni
condiciones escritas dentro.**

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `src/config/site.ts` | El archivo más importante para el negocio: marca, WhatsApp, redes sociales, ubicación, métodos de pago, modalidades de envío, preguntas frecuentes y las banderas de funcionalidad (como mostrar precios o no). | ✍️ A mano |
| `src/config/navegacion.ts` | Enlaces del pie de página, categorías del footer y la lista de páginas legales e informativas. | ✍️ A mano |

---

## `src/data/`

El catálogo. **Agregar una pieza al sitio es agregar un archivo aquí.**

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `src/data/categorias.json` | Las 3 categorías del catálogo, cada una con nombre, descripción, icono y color de marca. | ✍️ A mano |

### Productos (`src/data/productos/`)

12 archivos JSON, uno por pieza. Todos comparten el mismo esquema de 17 campos obligatorios
(slug, nombre, categoría, subtítulo, resumen, descripción, materiales, medidas, cuidados, origen,
taller, tiempo de elaboración, personalizable, destacado, etiquetas, colores e icono) más cuatro
campos opcionales. Si alguno no cumple el esquema, **el build falla con el detalle del error**.

**Cada fila de la tabla corresponde al archivo `src/data/productos/<slug>.json`**, y el campo
`slug` de dentro del archivo coincide siempre con su nombre de archivo.

| Slug | Nombre | Categoría | Origen |
| ---- | ------ | --------- | ------ |
| `aretes-coco-concha-roatan` | Aretes de coco y concha | Joyería | Roatán, Islas de la Bahía |
| `aretes-filigrana-plata-gracias` | Aretes de filigrana de plata | Joyería | Gracias, Lempira |
| `bolso-fibra-tela-atlantida` | Bolso tejido de fibra natural | Textiles | Tela, Atlántida |
| `canasta-fibra-tuno-puerto-lempira` | Canasta de fibra de tuno | Artesanías | Puerto Lempira, Gracias a Dios |
| `collar-tagua-plata-copan` | Collar de tagua y plata | Joyería | Santa Rosa de Copán, Copán |
| `figura-tallada-madera-valle-de-angeles` | Figura tallada en madera de cedro | Artesanías | Valle de Ángeles, Francisco Morazán |
| `hamaca-algodon-choluteca` | Hamaca de algodón tejida | Textiles | Choluteca, Choluteca |
| `manta-telar-cintura-lenca` | Manta tejida en telar de cintura | Textiles | La Esperanza, Intibucá |
| `mantel-bordado-lenca-la-campa` | Mantel bordado a mano | Textiles | La Campa, Lempira |
| `muneca-trapo-lenca-la-esperanza` | Muñeca de trapo lenca | Artesanías | La Esperanza, Intibucá |
| `pulsera-cuero-trenzado-comayagua` | Pulsera de cuero trenzado | Joyería | Comayagua, Comayagua |
| `vasija-barro-lenca-marcala` | Vasija de barro lenca | Artesanías | Marcala, La Paz |

---

## `src/lib/`

La lógica reutilizable. Aquí está lo que hace que el sitio funcione como sistema y no como un
montón de páginas.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `src/lib/catalogo.ts` | Carga los JSON del catálogo, **los valida con Zod** y expone los productos y categorías ya tipados. Es la única puerta de entrada a los datos. | ✍️ A mano |
| `src/lib/rutas.ts` | El helper `enlace()` que antepone el subdirectorio `/ArteaniaHonduras` a todos los enlaces internos, más el cálculo de URLs canónicas y absolutas. | ✍️ A mano |
| `src/lib/seo.ts` | Constructores del marcado estructurado: organización, sitio web, producto, preguntas frecuentes, migas de pan y listas de productos. | ✍️ A mano |
| `src/lib/whatsapp.ts` | Construye los enlaces `wa.me` con el mensaje ya escrito según el contexto (pieza, categoría, mayoreo o pedido), y avisa durante el build si el número es un marcador. | ✍️ A mano |
| `src/lib/iconos.ts` | Los 24 iconos SVG del sitio en trazo y su tipo. Están aquí y no en un `.astro` porque Astro no admite uniones de tipos multilínea en el frontmatter. | ✍️ A mano |
| `src/lib/motivos.mjs` | Los 10 motivos artesanales de inspiración lenca, compartidos entre el sitio y el generador de ilustraciones. | ✍️ A mano |

---

## `src/components/`

Piezas de interfaz reutilizables.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `src/components/Header.astro` | Barra de aviso superior, logotipo, navegación principal con estado activo y menú móvil **sin JavaScript**. | ✍️ A mano |
| `src/components/Footer.astro` | Pie de página: marca, catálogo, información de compra, contacto, redes sociales, formas de pago y entrega. | ✍️ A mano |
| `src/components/Logo.astro` | El logotipo: monograma lenca con la «A» y el wordmark «Artesanías / De Honduras». | ✍️ A mano |
| `src/components/Icono.astro` | Dibuja un icono del catálogo de `src/lib/iconos.ts`. | ✍️ A mano |
| `src/components/Motivo.astro` | Dibuja un motivo artesanal de `src/lib/motivos.mjs`. | ✍️ A mano |
| `src/components/BotonWhatsApp.astro` | Botón de WhatsApp con mensaje prellenado, cuatro variantes visuales y tres tamaños. | ✍️ A mano |
| `src/components/BotonWhatsAppFlotante.astro` | Botón de WhatsApp fijo en la esquina inferior, presente en todas las páginas. | ✍️ A mano |
| `src/components/SeccionEncabezado.astro` | Encabezado de sección reutilizable: antetítulo, título y descripción, alineable al centro. | ✍️ A mano |
| `src/components/TarjetaProducto.astro` | Tarjeta de producto para las grillas: imagen, etiquetas, origen, tiempo de elaboración y botón de consulta. | ✍️ A mano |
| `src/components/TarjetaCategoria.astro` | Tarjeta de categoría con el motivo, el contador de piezas y el enlace al catálogo filtrado. | ✍️ A mano |
| `src/components/Migas.astro` | Ruta de navegación visible, acompañada de su marcado `BreadcrumbList`. | ✍️ A mano |
| `src/components/Acordeon.astro` | Acordeón de preguntas frecuentes hecho con `<details>`: accesible y sin JavaScript. | ✍️ A mano |

---

## `src/layouts/`

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `src/layouts/Base.astro` | El documento HTML completo: `<head>` con SEO, Open Graph, Twitter Card, JSON-LD e iconos, y el armazón de la página (salto de contenido, cabecera, contenido, pie y botón flotante). | ✍️ A mano |

---

## `src/pages/`

Las rutas del sitio. Cada archivo se convierte en una o varias páginas al compilar.

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `src/pages/index.astro` | Portada: héroe, cifras del catálogo, categorías, piezas destacadas, cómo comprar, origen, compromiso, preguntas y cierre. | ✍️ A mano |
| `src/pages/tienda/index.astro` | Catálogo completo con buscador y filtros por categoría y etiqueta, resueltos en el navegador sin dependencias. | ✍️ A mano |
| `src/pages/tienda/[categoria].astro` | Una página por cada categoría de `categorias.json` (tres en total), con sus piezas y las categorías hermanas. | ✍️ A mano |
| `src/pages/producto/[slug].astro` | Una ficha por cada producto (doce en total): galería, cotización por WhatsApp, ficha técnica, origen, taller responsable, formas de pago y piezas relacionadas. | ✍️ A mano |
| `src/pages/nosotros.astro` | Historia de la marca, por qué existe, valores, proceso paso a paso y talleres aliados (derivados del catálogo real). | ✍️ A mano |
| `src/pages/envios-y-pagos.astro` | Cómo comprar en cuatro pasos, formas de pago, modalidades de entrega, tienda física y dos bloques de preguntas frecuentes. | ✍️ A mano |
| `src/pages/preguntas-frecuentes.astro` | Las ocho preguntas de `src/config/site.ts`, agrupadas en tres bloques con accesos rápidos. | ✍️ A mano |
| `src/pages/contacto.astro` | WhatsApp como canal principal, tienda física, cobertura, tarjeta de Facebook y seis motivos de consulta con mensaje prellenado. | ✍️ A mano |
| `src/pages/privacidad.astro` | Política de privacidad en diez bloques, con índice lateral pegajoso. | ✍️ A mano |
| `src/pages/terminos.astro` | Términos y condiciones de compra en catorce bloques, con índice lateral pegajoso. | ✍️ A mano |
| `src/pages/404.astro` | Página de error: explica qué pasó y ofrece accesos al catálogo y a las secciones principales. Está marcada como `noindex`. | ✍️ A mano |

---

## `src/styles/`

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `src/styles/global.css` | El sistema de diseño completo: tokens de marca en `@theme`, tipografías autoalojadas, estilos base y la capa de componentes (botones, tarjetas, etiquetas y patrones). | ✍️ A mano |

---

## `src/` (raíz)

| Archivo | Para qué sirve | Origen |
| ------- | -------------- | ------ |
| `src/env.d.ts` | Referencia de tipos del cliente de Astro, para que el editor reconozca `import.meta.env` y los tipos de las plantillas. | ✍️ A mano |

---

## Archivos que NO se rastrean

Todo lo que sigue está en `.gitignore`: existe en la máquina de quien trabaja, pero **no se sube al
repositorio**.

| Ruta | Por qué queda fuera |
| ---- | ------------------- |
| `node_modules/` | Las dependencias instaladas. Se reconstruyen con `npm ci` en cualquier máquina. Ocupan cientos de megas y no aportan nada al historial. |
| `dist/` | El sitio compilado. Lo genera GitHub Actions en cada despliegue; versionarlo sería duplicar la salida del build. |
| `.astro/` | Tipos y caché internos de Astro, regenerados en cada compilación. |
| `.npm-cache/` | Caché local de npm. Existe solo para no escribir en la caché global del sistema. |
| `_revision/` | Carpeta de trabajo temporal: clones de código de terceros para auditarlos, capturas y scripts desechables. Nunca se publica. |
| `fotos-originales/` | Las fotografías sin procesar. Se quedan en local y se optimizan con `npm run fotos:procesar`, que escribe el resultado en `public/imagenes/fotos/`. Así el repositorio no carga con archivos de varios megas. |
| `.obsidian/` | Configuración de la bóveda de Obsidian. La reescribe la propia aplicación en cada apertura, así que versionarla dejaba el repositorio sucio de forma permanente (decisión C-10). |
| `.env` y `.env.*` | Variables de entorno y secretos. Se ignoran **todas** salvo `.env.example`, para que ninguna credencial termine en el historial. |

> Los archivos generados que **sí** se rastrean (las ilustraciones SVG, `og-default.png`,
> `apple-touch-icon.png`, `favicon.svg`, `manifest.webmanifest`, `robots.txt` y
> `package-lock.json`) se versionan a propósito: GitHub Pages publica el contenido literal de
> `public/` y el despliegue no ejecuta los scripts de generación.
