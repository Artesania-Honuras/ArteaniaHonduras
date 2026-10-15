# Changelog

Todos los cambios importantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa
[Versionado Semántico](https://semver.org/lang/es/).

> Este archivo es el **registro oficial de cambios**. El inventario completo de archivos, con la
> función de cada uno, está en [docs/INVENTARIO.md](docs/INVENTARIO.md).

---

## [1.1.0] — 2026-10-15

Memoria persistente del proyecto, reglas obligatorias para agentes y checklist automatizado de
estado.

### Añadido

- **Memoria persistente en el propio repositorio** (`docs/memoria/`), sin depender de ninguna
  herramienta de memoria externa:
  - `INDICE.md` — mapa, reglas, decisiones vivas con su evidencia, fuentes de verdad, criterios de
    aceptación y pendientes priorizados. Es lo primero que debe leer una sesión nueva.
  - `MANUAL-DE-CAMBIOS.md` — una entrada `C-NN` por cambio aplicado, con evidencia numérica y cómo
    revertirlo. Diez entradas, incluida la reconstrucción del historial anterior.
  - `REGISTRO-DE-RESULTADOS.md` — una fila `E-NN` por medición con hipótesis, método, números y
    veredicto, **incluidos los experimentos descartados**: pnpm, descarga de fotos de Facebook, el
    plugin de DSH, los saltos de versión de Dependabot y las trampas de Astro y Tailwind.
  - `LOG-DE-SESIONES.md` — bitácora de las seis sesiones del proyecto.
  - `PLANTILLAS.md` — formatos vacíos de `C-NN`, `E-NN` y entrada de sesión.
- **`AGENTS.md`**: reglas obligatorias para cualquier agente o sesión nueva, encabezadas por el
  puntero al índice. Define la regla de registro (cambio → `C-NN`, experimento → `E-NN`, sesión →
  Log, todo commiteado y subido en la misma sesión), la de cambios (sin medición reproducible,
  registro y despliegue verificado no hay cambio) y la de estado (preguntar "¿está al 100%?" se
  responde con la tabla del checklist, nunca con una opinión).
- **`scripts/estado.py`** y comando `npm run estado`: checklist de solo lectura, sin dependencias,
  con **41 comprobaciones en 6 bloques** (procesos y servicios, conectividad externa, frescura de la
  publicación, configuración viva, estado del repositorio y hardware). Devuelve código de salida 0
  si no hay ningún ❌. Admite `--sin-red` y `--json`.

### Cambiado

- `docs/INICIO.md` pasa a ser un **puntero** al índice de la memoria, para que los enlaces antiguos
  y la nota raíz de la bóveda sigan resolviendo sin duplicar el mapa.
- El `README.md` reorganiza su sección de documentación: primero la memoria, después la referencia,
  y añade cómo se consulta el estado del sistema.

### Eliminado

- **`docs/HISTORIAL.md`**, absorbido por `docs/memoria/LOG-DE-SESIONES.md`. Mantener dos líneas de
  tiempo en paralelo garantizaba que una de las dos quedara desactualizada.
- **`.obsidian/` deja de versionarse.** Obsidian reescribe su configuración en cada apertura
  (registra los plugins de su versión, crea `graph.json`, quita el salto de línea final), así que
  tenerla en git dejaba el repositorio sucio de forma permanente y la comprobación "sin commits
  pendientes" dejaba de ser una señal fiable. La bóveda se abre igual: Obsidian regenera su
  configuración sola.

### Corregido

- `scripts/estado.py` no detectaba `npm` en Windows (es un `.cmd` y `CreateProcess` no lo ejecuta
  directamente) ni podía medir la RAM (`os.sysconf` no existe en Windows).
- El informe de `estado.py` fallaba al imprimirse: la consola de Windows usa cp1252 y no puede
  representar `➖`. Es la **segunda vez** que ese problema aparece en el proyecto, así que queda
  anotado como trampa conocida en el índice.
- `estado.py` trataba igual un flujo **en curso** que uno **roto**. Ahora los estados transitorios
  siguen contando como ❌ —lo no verificable se declara pendiente— pero el mensaje dice *EN CURSO* y
  pide volver a medir, en lugar de parecer una avería. Entrada C-11.

### Verificado

- **El checklist detectó un fallo real en su primera medición.** El despliegue del commit `824a2ac`
  falló con un error 500 de la infraestructura de GitHub Pages **mientras la integración continua
  pasaba en verde**. Sin la comprobación del flujo de despliegue, el proyecto se habría declarado al
  100% con el sitio sin actualizar. Relanzar el flujo lo resolvió sin tocar el código. Ver E-12 en el
  registro de resultados.
- Medición final: **37 ✅ · 0 ❌ · 0 ⚠️ · 4 ➖**. Código de salida 0.

---

## [1.0.0] — 2026-10-09

Primera versión publicable del sitio de **Artesanías De Honduras**: sitio de marca y catálogo
consultivo para artesanías, textiles y joyería hechas a mano en Honduras.

Sitio en línea: <https://artesania-honuras.github.io/ArteaniaHonduras/>

### Añadido

#### Sitio y páginas

- Portada con piezas destacadas, categorías, presentación de la marca y acceso directo a WhatsApp.
- Catálogo completo en `/tienda`, con buscador y filtros por categoría y etiqueta resueltos en el
  navegador, sin backend.
- Catálogo filtrado por categoría en `/tienda/[categoria]`.
- Ficha de producto en `/producto/[slug]`: descripción, materiales, medidas, cuidados, origen,
  taller responsable, tiempo de elaboración, métodos de pago y piezas relacionadas.
- Páginas de marca e información: `/nosotros`, `/envios-y-pagos`, `/preguntas-frecuentes`,
  `/contacto`, `/privacidad`, `/terminos` y una página de error `404`.

#### Catálogo y datos

- Catálogo de **12 productos** en `src/data/productos/*.json`, uno por archivo, y **3 categorías**
  en `src/data/categorias.json` (artesanías y manualidades, textiles y ropa típica, joyería y
  accesorios).
- Cada pieza declara su **origen real**: 10 departamentos de Honduras, con municipio, comunidad y
  taller responsable.
- Carga de contenido con `import.meta.glob` y **validación con Zod** en `src/lib/catalogo.ts`:
  el build falla con un mensaje que indica el archivo y el campo inválido.
- Validación adicional del catálogo sin compilar el sitio, mediante `npm run catalogo:validar`
  (`scripts/validar-catalogo.mjs`).
- Generador de ilustraciones SVG de producto, `scripts/generar-imagenes.mjs`
  (`npm run imagenes:generar`), con 10 motivos disponibles.

#### Configuración central

- `src/config/site.ts` como único origen de los datos del negocio: identidad, contacto (WhatsApp),
  ubicación, métodos de pago, modalidades de envío, banderas de funcionalidad y preguntas
  frecuentes.
- Cinco formas de pago documentadas: coordinación por WhatsApp, transferencia o depósito bancario,
  pago contra entrega, Tigo Money y BAC Credomatic.
- Tres modalidades de entrega: envíos a todo Honduras, envíos internacionales y tienda física con
  entrega en mano.
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
- Motivos decorativos de inspiración lenca definidos en `src/lib/motivos.mjs`, compartidos entre el
  sitio y el generador de imágenes.

#### Enlaces y rutas

- Helper `enlace()` en `src/lib/rutas.ts`, obligatorio para todos los enlaces internos: antepone
  automáticamente el `base` `/ArteaniaHonduras` de GitHub Pages.
- Utilidades complementarias: `urlAbsoluta()` para canónicas y Open Graph, `canonica()` para
  normalizar la barra final y `esRutaActiva()` para el estado activo de la navegación.
- Construcción de enlaces de WhatsApp en `src/lib/whatsapp.ts`, con mensaje prellenado por
  producto y detección del número de ejemplo.

#### Conversión por WhatsApp

- Todos los llamados a la acción abren el chat con un mensaje ya escrito: consulta por una pieza
  (con su nombre y su enlace), categoría completa, cotización de mayoreo, estado de un pedido,
  recomendación de regalo y alta de taller aliado.
- Botón flotante de WhatsApp presente en todas las páginas.
- El enlace de la pieza dentro del mensaje usa `urlAbsoluta()`, de modo que respeta el
  subdirectorio de GitHub Pages.

#### SEO y metadatos

- Canónicas, Open Graph, Twitter Card y metadatos de negocio en la plantilla base.
- **Datos estructurados JSON-LD:** `Organization`/`Store`, `WebSite`, `BreadcrumbList`, `FAQPage`,
  `Product` e `ItemList`, generados en `src/lib/seo.ts`.
- `PostalAddress` con la ciudad y el departamento del negocio, para búsquedas locales.
- Sitemap con `@astrojs/sitemap` (excluyendo la página 404), `robots.txt` y
  `manifest.webmanifest`.
- Migas de pan visibles en las páginas internas, con su marcado estructurado correspondiente.
- Tarjeta social propia (`og-default.png`) e icono para iOS generados con
  `scripts/generar-raster.py`.

#### Accesibilidad

- Enlace de salto al contenido principal, navegación operativa por teclado y estados de foco
  visibles.
- Atributos `aria` en la navegación, los acordeones y los controles interactivos.
- Menú móvil resuelto con `<details>`/`<summary>`, **sin JavaScript**.
- Respeto de `prefers-reduced-motion` para las animaciones.
- Contraste de color verificado dentro del sistema de diseño de la marca.

#### Redes sociales y presencia

- **Página de Facebook integrada**: enlace en el pie de página de todas las páginas, tarjeta
  "Síguenos en Facebook" en `/contacto` con el nombre y la ciudad de la página, y entrada `sameAs`
  en el marcado estructurado para que los buscadores asocien sitio y perfil.
- El pie de página resuelve los nombres públicos de cada red, de modo que Instagram y TikTok
  funcionarán igual en cuanto se configuren.

#### Flujo para fotografías reales

- `scripts/procesar-fotos.py` y comando `npm run fotos:procesar`: toma las fotos de
  `fotos-originales/`, las redimensiona, **elimina los metadatos EXIF (incluidas las coordenadas
  GPS)**, las convierte a WebP y actualiza solo el JSON de cada producto con `imagen` y `galeria`.
- Emparejamiento por `slug` o por nombre comercial, ignorando tildes, mayúsculas y espacios. Una
  foto sin número siempre queda como principal, para que `producto-2.jpg` no desplace a
  `producto.jpg` por orden alfabético.
- Los archivos que no logran asignarse se reportan y no se tocan; los originales nunca se borran.

#### Calidad, herramientas y publicación

- Migración a **Astro 5** con **TypeScript** y **Tailwind CSS 4**.
- Scripts de `package.json`: `dev`, `build`, `preview`, `check`, `verify`, `format`,
  `format:check`, `catalogo:validar`, `imagenes:generar` y `fotos:procesar`.
- Formato de código con **Prettier** y el plugin de Astro (`.prettierrc.json`, `.prettierignore`).
- Convenciones de editor en `.editorconfig` (UTF-8, LF, 2 espacios).
- **Integración continua** en `.github/workflows/ci.yml`: instalación reproducible con `npm ci`,
  `astro check`, validación del catálogo y build, con permisos de solo lectura.
- **Despliegue automático** en `.github/workflows/deploy.yml` hacia GitHub Pages en cada push a
  `master`, con `actions/configure-pages`, `upload-pages-artifact` y `deploy-pages`.
- Protección contra publicar un sitio sin canal de contacto: paso de CI que **advierte en pull
  requests y falla en `master`** si el número de WhatsApp sigue siendo el de ejemplo.
- **Dependabot configurado** en `.github/dependabot.yml`: agrupa las actualizaciones menores y de
  parche en una sola PR y no propone saltos de versión mayor de `astro`, `@astrojs/*`,
  `tailwindcss`, `@tailwindcss/*`, `typescript` ni `sharp`, porque exigen una migración planificada.
- Plantilla de pull request y configuración de incidencias en `.github/`.

#### Documentación

- `README.md`, `ANALISIS.md` (diagnóstico del repositorio original y hoja de ruta),
  `docs/ARQUITECTURA.md`, `docs/GUIA-CONTENIDO.md`, `docs/CHECKLIST-LANZAMIENTO.md` y
  `docs/ROADMAP-TIENDA.md`.
- `docs/INVENTARIO.md`: inventario archivo por archivo del proyecto.

#### Bóveda de Obsidian

- El repositorio se abre directamente como **bóveda de Obsidian**: configuración en `.obsidian/`
  con filtros para excluir código, dependencias y artefactos de compilación.
- `docs/INICIO.md` como nota raíz (mapa de contenido) con enlaces wiki a todos los documentos.
- `docs/HISTORIAL.md` como línea de tiempo del proyecto.
- `docs/plantillas/PLANTILLA-NOTA.md` como plantilla para notas nuevas.
- `docs/mapa-proyecto.canvas`: lienzo visual con la arquitectura, el flujo de contenido y la hoja
  de ruta.
- Propiedades (frontmatter) con etiquetas y fecha de actualización en las notas de `docs/`.

### Cambiado

- **Se reemplazó por completo la plantilla de prueba basada en Bootstrap 4.3.1 y jQuery por un
  sitio Astro.** Del commit inicial `46774af` no queda ningún archivo.
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
- **La marca pasó de "Arteanía Honduras" a "Artesanías De Honduras"**, para unificarla con la
  página de Facebook del negocio, que es donde ya existe audiencia. El cambio alcanzó 48
  reemplazos en 29 archivos; el script de renombrado solo tocó la forma acentuada, de modo que la
  ruta base `/ArteaniaHonduras` de GitHub Pages (sin tilde) quedó intacta a propósito.
- El logotipo pasa a mostrar "Artesanías" con la sublínea "De Honduras", con el interletrado
  ajustado para equilibrar ambas líneas.
- **Ubicación publicada.** La ciudad (**Choloma, Cortés**) aparece en el pie de página, en la
  tarjeta de tienda física de `/contacto`, en `/envios-y-pagos` y en el `PostalAddress` del
  marcado estructurado. La dirección exacta sigue pendiente y, mientras esté vacía, el marcado
  estructurado la omite en lugar de publicar un dato falso.
- Las rutas del campo `imagen` y de `galeria` pasan ahora por el helper de base: antes, una foto
  declarada como `/imagenes/fotos/x.webp` habría devuelto 404 en GitHub Pages.
- La imagen de Open Graph de cada ficha usa la **foto principal cuando existe**, en lugar de
  recurrir siempre a la ilustración SVG.

### Eliminado

- **`index.html` de la raíz.** Era el archivo original con "Hello, world!" y Bootstrap cargado por
  CDN. Astro nunca lo usó —la portada se genera desde `src/pages/index.astro`— así que era peso
  muerto y confuso en el repositorio. El punto de entrada del sitio es Astro, no un HTML suelto.
- Todas las referencias a Bootstrap 4.3.1, jQuery y Popper por CDN.

### Corregido

- **`astro check` fallaba en CI** por tres motivos: el plugin de Tailwind declara los tipos de su
  propia copia de Vite (ts 2322), se usaba `z.prettifyError` (API de Zod 4) sobre Zod 3, y había
  dos importaciones sin usar. Los tres quedaron resueltos y el comando pasa con 0 errores y 0
  avisos sobre 37 archivos.
- **El enlace de producto dentro del mensaje de WhatsApp apuntaba a un 404.** Se construía con
  `new URL()` contra el dominio sin el subdirectorio de GitHub Pages. Ahora usa `urlAbsoluta()`.
  El fallo estaba en producción y se detectó leyendo el HTML desplegado.
- **Las rutas de imagen no pasaban por el helper de base**, lo que habría roto las fotografías
  reales en cuanto se subieran. Se añadió `rutaImagen()` en `src/lib/catalogo.ts`.
- **`tsconfig.json` ahora excluye `dist`, `node_modules`, `.npm-cache` y `_revision`.** Con el
  patrón `include: ["**/*"]`, cualquier carpeta de trabajo con copias del sitio compilado hacía
  que `astro check` intentara analizar bundles minificados hasta agotar la memoria.
- **`scripts/procesar-fotos.py` fallaba en la consola de Windows** al imprimir el carácter `✓`
  (cp1252 no puede representarlo). Ahora fuerza UTF-8 con reemplazo y usa marcadores ASCII.
- **Orden de las fotos de galería:** el archivo numerado `producto-2.jpg` se asignaba como imagen
  principal solo por orden alfabético. Ahora la coincidencia exacta con el nombre del producto
  siempre tiene prioridad.
- **`public/robots.txt` apuntaba a un sitemap inexistente** antes de que el generador lo creara;
  ahora se genera junto con el resto de los recursos.

### Resuelto durante el lanzamiento

- **Número de WhatsApp real publicado** (`50499653413`, visible como +504 9965-3413). El canal de
  venta del sitio ya abre el chat correcto y el guardián del CI deja de fallar en `master`.
- **Página de Facebook publicada** e integrada en el pie de página, en contacto y en el marcado
  estructurado.
- **PR automática de Dependabot cerrada.** Proponía Astro 5 → 7, un salto de versión mayor que
  rompe el build. Se cerró explicando el motivo y se configuró Dependabot para que no vuelva a
  proponerlo sin planificación.

### Pendiente

Datos y contenido del negocio por confirmar antes de difundir el enlace a gran escala.

- **Dirección exacta de la tienda física y horarios.** La ciudad ya está publicada; falta la calle
  y el enlace de Google Maps (`UBICACION.direccion` y `UBICACION.mapsUrl`).
- **Fotografías reales de producto.** Hoy el catálogo usa ilustraciones SVG generadas. No se pueden
  descargar automáticamente de Facebook —la página exige iniciar sesión—, así que hay que bajarlas
  a mano y dejarlas en `fotos-originales/`.
- **Revisión de las políticas legales**: `privacidad` y `terminos` son textos base redactados como
  punto de partida y no constituyen asesoría legal.
- **Dominio propio (opcional).** De adoptarse, hay que actualizar `site` y `base` en
  `astro.config.mjs` y en `src/config/site.ts`.
- **Analítica y medición:** sin herramienta instalada; su adopción implica cookies y, por lo tanto,
  actualizar la política de privacidad.
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
