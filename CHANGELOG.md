# Changelog

Todos los cambios importantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa
[Versionado Semántico](https://semver.org/lang/es/).

---

## [1.0.0] — 2026-10-09

Primera versión publicable del sitio de Arteanía Honduras: sitio de marca y catálogo consultivo
para artesanías, textiles y joyería hechas a mano en Honduras.

### Añadido

#### Sitio y páginas

- Portada con piezas destacadas, categorías, presentación de la marca y acceso directo a WhatsApp.
- Catálogo completo en `/tienda` y catálogo filtrado por categoría en `/tienda/[categoria]`.
- Ficha de producto en `/producto/[slug]`: descripción, materiales, medidas, cuidados, origen,
  taller, tiempo de elaboración y piezas relacionadas.
- Páginas de marca e información: `/nosotros`, `/envios-y-pagos`, `/preguntas-frecuentes`,
  `/contacto`, `/privacidad`, `/terminos` y una página de error `404`.

#### Catálogo y datos

- Catálogo de **12 productos** en `src/data/productos/*.json`, uno por archivo, y **3 categorías**
  en `src/data/categorias.json` (artesanías y manualidades, textiles y ropa típica, joyería y
  accesorios).
- Carga de contenido con `import.meta.glob` y **validación con Zod** en `src/lib/catalogo.ts`:
  el build falla con un mensaje que indica el archivo y el campo inválido.
- Validación adicional del catálogo sin compilar el sitio, mediante `npm run catalogo:validar`
  (`scripts/validar-catalogo.mjs`).
- Generador de ilustraciones SVG de producto, `scripts/generar-imagenes.mjs`
  (`npm run imagenes:generar`), con 10 iconos disponibles.

#### Configuración central

- `src/config/site.ts` como único origen de los datos del negocio: identidad, contacto
  (WhatsApp), métodos de pago, modalidades de envío, banderas de funcionalidad y preguntas
  frecuentes.
- Cinco formas de pago documentadas: coordinación por WhatsApp, transferencia o depósito
  bancario, pago contra entrega, Tigo Money y BAC Credomatic.
- Tres modalidades de entrega: envíos a todo Honduras, envíos internacionales y tienda física
  con entrega en mano.
- Banderas de funcionalidad de la Fase 1, con `FUNCIONES.mostrarPrecios = false` (el catálogo
  muestra "Consultar precio" por WhatsApp).

#### Componentes y sistema de diseño

- Componentes reutilizables: `Header`, `Footer`, `Logo`, `Icono`, `Motivo`, `BotonWhatsApp`,
  `BotonWhatsAppFlotante`, `TarjetaProducto`, `TarjetaCategoria`, `SeccionEncabezado`, `Migas`
  y `Acordeon`, sobre la plantilla `src/layouts/Base.astro`.
- Sistema de diseño con **tokens de Tailwind CSS 4** en `src/styles/global.css`: paleta de barro,
  crema, olivo, añil, ocre y tinta; radios, sombras cálidas y animaciones discretas.
- Tipografías **autoalojadas** con `@fontsource` (Fraunces para títulos, Figtree para texto), sin
  CDN externas.
- Motivos decorativos de inspiración artesanal generados en el propio proyecto.

#### Enlaces y rutas

- Helper `enlace()` en `src/lib/rutas.ts`, obligatorio para todos los enlaces internos: antepone
  automáticamente el `base` `/ArteaniaHonduras` de GitHub Pages.
- Utilidades complementarias: `urlAbsoluta()` para canónicas y Open Graph, `canonica()` para
  normalizar la barra final y `esRutaActiva()` para el estado activo de la navegación.
- Construcción de enlaces de WhatsApp en `src/lib/whatsapp.ts`, con mensaje prellenado por
  producto y detección del número de ejemplo.

#### SEO y metadatos

- Canónicas, Open Graph, Twitter Card y metadatos de negocio en la plantilla base.
- **Datos estructurados JSON-LD:** `Organization`/`Store`, `WebSite`, `BreadcrumbList`, `FAQPage`,
  `Product` e `ItemList`, generados en `src/lib/seo.ts`.
- Sitemap con `@astrojs/sitemap` (excluyendo la página 404), `robots.txt` y
  `manifest.webmanifest`.
- Migas de pan visibles en las páginas internas, con su marcado estructurado correspondiente.

#### Accesibilidad

- Enlace de salto al contenido principal, navegación operativa por teclado y estados de foco
  visibles.
- Atributos `aria` en la navegación, los acordeones y los controles interactivos.
- Respeto de `prefers-reduced-motion` para las animaciones.
- Contraste de color verificado dentro del sistema de diseño de la marca.

#### Calidad, herramientas y publicación

- Migración a **Astro 5** con **TypeScript** y **Tailwind CSS 4**.
- Scripts de `package.json`: `dev`, `build`, `preview`, `check`, `verify`, `format`,
  `format:check`, `catalogo:validar` e `imagenes:generar`.
- Formato de código con **Prettier** y el plugin de Astro (`.prettierrc.json`, `.prettierignore`).
- Convenciones de editor en `.editorconfig` (UTF-8, LF, 2 espacios).
- **Integración continua** en `.github/workflows/ci.yml`: instalación reproducible con `npm ci`,
  `astro check`, validación del catálogo y build, con permisos de solo lectura.
- **Despliegue automático** en `.github/workflows/deploy.yml` hacia GitHub Pages en cada push a
  `master`, con `actions/configure-pages`, `upload-pages-artifact` y `deploy-pages`.
- Protección contra publicar un sitio sin canal de contacto: paso de CI que **advierte en pull
  requests y falla en `master`** si el número de WhatsApp sigue siendo el de ejemplo.
- Documentación del proyecto: `README.md`, `ANALISIS.md`, `docs/ARQUITECTURA.md`,
  `docs/GUIA-CONTENIDO.md`, `docs/CHECKLIST-LANZAMIENTO.md` y `docs/ROADMAP-TIENDA.md`.
- Plantilla de pull request y configuración de incidencias en `.github/`.

### Cambiado

- **Se reemplazó por completo la plantilla de prueba basada en Bootstrap 4.3.1 y jQuery por un
  sitio Astro.** Del commit inicial `46774af` (3 archivos, 26 líneas, un `index.html` con
  "Hello, world!", `lang="en"` y título de marcador) no queda nada salvo `.gitattributes`.
- Se eliminaron **todas las dependencias por CDN de terceros**: los estilos, los iconos y las
  tipografías se empaquetan o se autoalojan en el propio proyecto.
- El idioma del documento pasó de `en` a `es-HN`, con contenido en español de Honduras.
- El contenido dejó de estar escrito dentro del HTML: ahora vive en JSON validado, separado del
  diseño.
- Se sustituyó la ausencia total de metadatos por un sistema de SEO con canónicas, tarjetas
  sociales, datos estructurados y sitemap.
- El despliegue dejó de ser manual: ahora lo ejecuta GitHub Actions en cada push a `master`.
- **Gestor de paquetes: npm.** Se evaluó pnpm y se descartó por un problema real de *junctions*
  en Windows con `LongPathsEnabled=0`. Se conserva `package-lock.json` para instalaciones
  reproducibles en CI.

### Pendiente

Datos del negocio por confirmar antes de difundir el enlace del sitio. Están marcados con `TODO:`
en el código y detallados en [docs/CHECKLIST-LANZAMIENTO.md](docs/CHECKLIST-LANZAMIENTO.md).

- **Número de WhatsApp real.** `CONTACTO.whatsapp.numero` sigue en `50400000000`, valor de
  ejemplo. Mientras no se reemplace, los botones de contacto no abren ningún chat y el build
  imprime un aviso por consola. **Es el pendiente bloqueante número uno.**
- **Dirección de la tienda física** y horarios de atención (`ENVIOS`, modalidad `tienda-fisica`).
- **Fotografías reales de producto.** Hoy el catálogo usa ilustraciones SVG generadas; se
  sustituyen por fotografías mediante el campo `imagen` de cada producto.
- **Revisión de las políticas legales**: `privacidad` y `terminos` son textos base redactados
  como punto de partida y no constituyen asesoría legal.
- **Dominio propio (opcional).** De adoptarse, hay que actualizar `site` y `base` en
  `astro.config.mjs` y en `src/config/site.ts`.
- **Redes sociales y correo de respaldo:** campos vacíos en `src/config/site.ts`, de modo que no
  se muestran en el sitio mientras no existan cuentas oficiales.
- **Analítica y medición:** sin herramienta instalada; su adopción implica cookies y, por lo
  tanto, actualizar la política de privacidad.
- **Fase 2 — tienda transaccional:** carrito, checkout y pasarelas de pago. Planificada en
  [docs/ROADMAP-TIENDA.md](docs/ROADMAP-TIENDA.md), no implementada.

---

<!--
Plantilla para las próximas versiones:

## [X.Y.Z] — AAAA-MM-DD

### Añadido
### Cambiado
### Obsoleto
### Eliminado
### Corregido
### Seguridad
-->
