---
titulo: Arquitectura del sitio
tags:
  - proyecto
  - arquitectura
  - tecnica
actualizado: 2026-10-09
estado: vigente
---

# Arquitectura del sitio — Artesanías De Honduras

Documento técnico. Explica **cómo está construido** el sitio, por qué está construido así y qué
reglas hay que respetar al modificarlo. Para editar contenido no hace falta leer esto: ver
[GUIA-CONTENIDO.md](GUIA-CONTENIDO.md).

---

## 1. Panorama general

| Aspecto | Decisión |
| ------- | -------- |
| Naturaleza | Sitio **estático** (sin servidor, sin base de datos, sin cobro en línea) |
| Generador | **Astro 5** con `output: 'static'` |
| Estilos | **Tailwind CSS 4** por el plugin de Vite (`@tailwindcss/vite`) |
| Lenguaje | **TypeScript** (modo estricto vía `tsconfig.json`), con alias `@/` → `src/` |
| Validación de contenido | **Zod** en tiempo de build |
| Gestor de paquetes | **npm** (hay `package-lock.json`) |
| Publicación | **GitHub Pages** como *project site*, en el subdirectorio `/ArteaniaHonduras` |
| URL pública | `https://artesania-honuras.github.io/ArteaniaHonduras/` |

Consecuencia central del enfoque: **todo el trabajo pesado ocurre en el build**. Si el contenido
es inválido, el sitio no se genera. No hay errores de contenido en producción porque no hay
contenido que llegue a producción sin validarse.

---

## 2. Diagrama de carpetas

```text
ArteaniaHonduras/
│
├── .github/
│   ├── ISSUE_TEMPLATE/config.yml
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml                    # check + validar catálogo + build (solo lectura)
│       └── deploy.yml                # build + publicación en GitHub Pages
│
├── docs/                             # Documentación del proyecto
│   ├── ARQUITECTURA.md               # (este archivo)
│   ├── GUIA-CONTENIDO.md
│   ├── CHECKLIST-LANZAMIENTO.md
│   └── ROADMAP-TIENDA.md
│
├── public/                           # Se copia tal cual a dist/ (sin procesar)
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── imagenes/
│       ├── og-default.png            # Tarjeta social por defecto (1200x630)
│       └── productos/                # Ilustraciones SVG y fotografías de producto
│
├── scripts/                          # Utilidades de Node (no forman parte del sitio)
│   ├── validar-catalogo.mjs          # Valida los JSON con Zod sin compilar
│   └── generar-imagenes.mjs          # Genera las ilustraciones SVG de cada producto
│
├── src/
│   ├── components/                   # Bloques de interfaz reutilizables
│   │   ├── Header.astro              # Navegación principal, con estado activo
│   │   ├── Footer.astro              # Pie de página: navegación secundaria y contacto
│   │   ├── Logo.astro                # Logotipo de la marca (SVG en línea)
│   │   ├── Icono.astro               # Icono por nombre, tipado desde lib/iconos.ts
│   │   ├── Motivo.astro              # Motivos decorativos de inspiración artesanal
│   │   ├── BotonWhatsApp.astro       # Botón de contacto, con variantes de tamaño/estilo
│   │   ├── BotonWhatsAppFlotante.astro
│   │   ├── TarjetaProducto.astro     # Ficha resumida para las rejillas del catálogo
│   │   ├── TarjetaCategoria.astro
│   │   ├── SeccionEncabezado.astro   # Encabezado de sección (título + entradilla)
│   │   ├── Migas.astro               # Migas de pan + BreadcrumbList
│   │   └── Acordeon.astro            # Acordeón accesible (FAQ y detalles)
│   │
│   ├── config/
│   │   ├── site.ts                   # ⭐ Datos del negocio: contacto, pagos, envíos, FAQ
│   │   └── navegacion.ts             # Menú principal y enlaces del pie
│   │
│   ├── data/                         # CONTENIDO (datos puros, sin diseño)
│   │   ├── categorias.json           # Las 3 categorías
│   │   └── productos/
│   │       ├── aretes-coco-concha-roatan.json
│   │       ├── aretes-filigrana-plata-gracias.json
│   │       ├── bolso-fibra-tela-atlantida.json
│   │       ├── canasta-fibra-tuno-puerto-lempira.json
│   │       ├── collar-tagua-plata-copan.json
│   │       ├── figura-tallada-madera-valle-de-angeles.json
│   │       ├── hamaca-algodon-choluteca.json
│   │       ├── manta-telar-cintura-lenca.json
│   │       ├── mantel-bordado-lenca-la-campa.json
│   │       ├── muneca-trapo-lenca-la-esperanza.json
│   │       ├── pulsera-cuero-trenzado-comayagua.json
│   │       └── vasija-barro-lenca-marcala.json
│   │
│   ├── layouts/
│   │   └── Base.astro                # Documento HTML: <head>, SEO, JSON-LD, envoltorio
│   │
│   ├── lib/                          # Lógica: nada de presentación
│   │   ├── catalogo.ts               # import.meta.glob + Zod → catálogo tipado
│   │   ├── rutas.ts                  # ⭐ enlace(), urlAbsoluta(), canonica(), esRutaActiva()
│   │   ├── seo.ts                    # Constructores de JSON-LD
│   │   ├── iconos.ts                 # Tipos e iconos (fuera de los .astro, ver §8)
│   │   ├── whatsapp.ts               # Enlaces de WhatsApp y aviso de número de ejemplo
│   │   └── motivos.mjs               # Geometrías de los motivos decorativos
│   │
│   ├── pages/                        # Enrutado por archivos
│   │   ├── index.astro               # /
│   │   ├── tienda/index.astro        # /tienda
│   │   ├── tienda/[categoria].astro  # /tienda/[categoria]
│   │   ├── producto/[slug].astro     # /producto/[slug]
│   │   ├── nosotros.astro
│   │   ├── envios-y-pagos.astro
│   │   ├── preguntas-frecuentes.astro
│   │   ├── contacto.astro
│   │   ├── privacidad.astro
│   │   ├── terminos.astro
│   │   └── 404.astro
│   │
│   ├── styles/
│   │   └── global.css                # ⭐ Sistema de diseño: tokens de Tailwind 4 + base
│   │
│   └── env.d.ts                      # Tipos de entorno de Astro
│
├── astro.config.mjs                  # site, base, sitemap, Tailwind, alias, prefetch
├── package.json
├── tsconfig.json
└── .editorconfig / .prettierrc.json / .prettierignore
```

---

## 3. Flujo de datos: de un JSON a una página

Este es el recorrido completo de un producto. Entenderlo explica por qué el contenido se edita
sin tocar plantillas.

```text
①  Autor escribe el JSON
    src/data/productos/vasija-barro-lenca-marcala.json

②  Astro lo carga en el build con import.meta.glob (eager)
    src/lib/catalogo.ts
      import.meta.glob('../data/productos/*.json', { eager: true })
    → objeto { rutaArchivo: { default: contenidoJson } }

③  Zod valida cada archivo contra ProductoSchema
      ProductoSchema.safeParse(modulo.default)
    → éxito: datos tipados (Producto)
    → fallo: throw con z.prettifyError() indicando archivo y campo

④  Se ejecutan las comprobaciones cruzadas
    · slug duplicado entre productos
    · categoría del producto existente en categorias.json

⑤  Se ordenan y se derivan los campos de vista (aVista)
    · categoriaNombre, categoriaColor  ← de la categoría
    · imagenPrincipal, imagenes        ← foto real o ilustración SVG de respaldo
    · ruta                             ← enlace(`/producto/${slug}/`)

⑥  Las páginas consumen el catálogo tipado
    src/pages/producto/[slug].astro
      getStaticPaths() → una ruta por producto
      catalogo.obtenerProducto(slug) → ProductoVista

⑦  Astro genera HTML estático
    dist/producto/vasija-barro-lenca-marcala/index.html
```

### 3.1 `import.meta.glob` + Zod: el patrón del catálogo

`src/lib/catalogo.ts` es el corazón del proyecto. Se apoya en dos ideas:

**Carga masiva sin listar archivos a mano.** `import.meta.glob` con `{ eager: true }` importa
todos los JSON del directorio en el momento del build. Añadir un producto **no requiere tocar
código**: basta con crear el archivo `.json` en `src/data/productos/`. El catálogo, las categorías
y las rutas se recalculan solos.

**Validación que detiene el build.** Cada archivo pasa por Zod. Si un campo obligatorio falta o
está mal formado, el build falla con el nombre del archivo y el detalle del campo. Un error de
contenido nunca llega a producción, y quien lo comete no necesita saber programar para entender
el mensaje.

```ts
const modulosProductos = import.meta.glob<{ default: unknown }>('../data/productos/*.json', {
  eager: true,
});

for (const [rutaArchivo, modulo] of Object.entries(modulosProductos)) {
  const resultado = ProductoSchema.safeParse(modulo.default);
  if (!resultado.success) {
    throw new Error(
      `${rutaArchivo} no cumple el esquema de producto:\n${z.prettifyError(resultado.error)}`,
    );
  }
  // …
}
```

### 3.2 Esquemas y datos derivados

| Esquema | Campos principales |
| ------- | ------------------ |
| `CategoriaSchema` | `slug`, `nombre`, `descripcion`, `icono`, `color` (hexadecimal de 6 dígitos) |
| `ProductoSchema` | `slug` (kebab-case), `nombre`, `categoria`, `subtitulo`, `resumen`, `descripcion[]`, `materiales[]`, `medidas`, `cuidados[]`, `origen`, `taller`, `tiempoElaboracion`, `personalizable`, `destacado`, `etiquetas[]`, `colores[]`, `icono`, y opcionales `precio`, `imagen`, `galeria[]`, `disponible`, `orden` |

`Producto` es el dato validado; `ProductoVista` es ese dato **más los campos derivados** que
consumen los componentes (`categoriaNombre`, `categoriaColor`, `imagenPrincipal`, `imagenes`,
`ruta`). Las páginas usan siempre `ProductoVista`: así, ninguna plantilla repite la lógica de
resolver la categoría o la imagen.

El catálogo exporta además `productosDestacados`, `etiquetasDisponibles`, `conteoPorCategoria()`,
`productosPorCategoria()`, `obtenerCategoria()`, `obtenerProducto()`,
`categoriaPrincipal()` y `productosRelacionados()`.

### 3.3 Ilustración de respaldo

```ts
export function ilustracionProducto(slug: string): string {
  return enlace(`/imagenes/productos/${slug}.svg`);
}
```

Si un producto no tiene el campo `imagen`, se usa el SVG generado por
`scripts/generar-imagenes.mjs` a partir de su `icono`. Sustituir la ilustración por una fotografía
real es solo añadir el campo `imagen`: **no hay que borrar ni tocar el SVG**.

### 3.4 Validación sin compilar

`scripts/validar-catalogo.mjs` (`npm run catalogo:validar`) aplica los mismos esquemas sin
construir el sitio. Es el comando rápido para comprobar el contenido: error claro en segundos en
lugar de un build completo. CI lo ejecuta siempre.

---

## 4. Sistema de diseño (Tailwind CSS 4)

Todo el sistema vive en **`src/styles/global.css`**, usando la directiva `@theme` de Tailwind 4
para declarar tokens. No hay archivo de configuración de Tailwind: los tokens **son** la
configuración, y generan utilidades (`bg-barro-500`, `text-tinta-700`, `rounded-pieza`, …).

### 4.1 Capas del archivo

1. **Tipografías autoalojadas** — `@import '@fontsource-variable/fraunces'` y `figtree`. Sin CDN
   externas: ninguna visita filtra datos a un tercero y no hay dependencia de disponibilidad.
2. **`@import 'tailwindcss'`** — motor de Tailwind 4.
3. **`@theme`** — la paleta y los tokens del proyecto.
4. **`@keyframes`** — animaciones propias.
5. **`@layer base`** — estilos de elementos, foco y accesibilidad.
6. **Componentes y utilidades** del proyecto.

### 4.2 Paleta

| Familia | Uso | Escala disponible |
| ------- | --- | ----------------- |
| `crema` | Fondos y arena | 50–300 |
| `barro` | **Color primario de marca** (terracota) | 50–900 |
| `olivo` | Acento natural | 100, 300, 500, 700 |
| `anil` | Acento frío, tradición textil hondureña | 100, 300, 500, 700 |
| `ocre` | Detalles, filetes, precios | 300–600 |
| `tinta` | Textos y neutrales cálidos | 50–900 |
| `whatsapp` | **Reservado a acciones de contacto** | 500, 600, 700 |

El verde de WhatsApp tiene un uso semántico estricto: solo botones de contacto. Eso mantiene
reconocible la acción principal del sitio.

### 4.3 Alias semánticos

Los componentes no usan colores crudos, sino alias que describen **intención**:
`--color-fondo`, `--color-superficie`, `--color-borde`, `--color-texto`, `--color-texto-suave`,
`--color-primario`, `--color-primario-oscuro`, `--color-acento`.

Ventaja: cambiar la identidad visual es editar el alias, no perseguir valores hexadecimales por
todas las plantillas. Si la marca cambia de terracota a otro color, se cambia `--color-primario`.

### 4.4 Otros tokens

- **Tipografías:** `--font-display` (Fraunces, títulos) y `--font-sans` (Figtree, texto).
- **Radios:** `--radius-pieza` (1.25rem) y `--radius-bloque` (1.75rem), para una geometría
  "hecha a mano" y no de esquina recta.
- **Sombras:** `--shadow-suave`, `--shadow-pieza`, `--shadow-elevada`. Son **cálidas** (matiz de
  barro), nunca grises fríos.
- **Animación:** `--animate-aparecer` y `--ease-artesanal`, con una curva de entrada discreta.

---

## 5. El helper `enlace()` y el problema del `base`

### 5.1 El problema

GitHub Pages sirve los *project sites* desde un subdirectorio. En este caso:

```text
site: 'https://artesania-honuras.github.io'
base: '/ArteaniaHonduras'

URL final: https://artesania-honuras.github.io/ArteaniaHonduras/tienda/
```

Si una plantilla escribe `<a href="/tienda">`, el navegador resuelve
`https://artesania-honuras.github.io/tienda` — **fuera** del subdirectorio del proyecto. El
resultado es un 404 en producción, aunque en desarrollo el síntoma sea distinto o inexistente:
es un fallo que solo aparece publicado.

### 5.2 La solución

Toda ruta interna pasa por `enlace()` de `src/lib/rutas.ts`:

```ts
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
const ES_EXTERNO = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

export function enlace(ruta = '/'): string {
  if (ES_EXTERNO.test(ruta)) return ruta;         // http(s):, mailto:, //, #ancla → intacto
  const limpia = ruta.startsWith('/') ? ruta : `/${ruta}`;
  if (limpia === '/') return `${BASE}/`;
  return `${BASE}${limpia}`;
}
```

`import.meta.env.BASE_URL` es el `base` de `astro.config.mjs`, ya normalizado con barra final.
Así el helper **no duplica** el valor del subdirectorio: lo lee de Astro. Cambiar de *project
site* a dominio propio es cambiar `site` y `base` en un solo archivo.

### 5.3 El resto de utilidades de `rutas.ts`

| Función | Para qué |
| ------- | -------- |
| `enlace(ruta)` | Rutas internas de `href` y de recursos (`<img>`, `manifest`, iconos). |
| `urlAbsoluta(ruta)` | URL con dominio: canónicas, Open Graph, JSON-LD, sitemap. |
| `canonica(pathname)` | URL canónica normalizada; añade la barra final de las páginas de directorio y respeta archivos con extensión. |
| `esRutaActiva(pagina, enlace)` | Estado activo de la navegación, tolerante a la barra final y a las subrutas. |

### 5.4 Regla de revisión

> **Todo `href` o `src` interno que empiece por `/` es un error de revisión si no está envuelto en
> `enlace()`.** Es la comprobación número uno al revisar una contribución.

### 5.5 Trampa conocida: tipos en el frontmatter de un `.astro`

**Astro no admite uniones de tipos multilínea en el frontmatter de un `.astro`.** El compilador
las elimina de forma incorrecta y esbuild falla con:

```text
Unexpected "|"
```

Los tipos con uniones se declaran en **módulos `.ts`** —como `src/lib/iconos.ts`— y se importan
desde la plantilla. Las `interface Props` simples dentro del `.astro` sí funcionan; las uniones
multilínea, no. Ya ocurrió una vez en este proyecto: no reintroducirlo.

---

## 6. Estrategia de SEO y datos estructurados

### 6.1 En el `<head>` — `src/layouts/Base.astro`

Todas las páginas pasan por la plantilla `Base.astro`, que recibe `titulo`, `descripcion`,
`imagen`, `tipo`, `noindex`, `jsonLd`, `sufijo` y `mensajeFlotante`, y construye:

- `<title>` compuesto (`Título | Artesanías De Honduras`).
- `<meta name="description">` con el valor recibido o la descripción de la marca.
- **Canónica** calculada con `canonica(Astro.url.pathname)`.
- `robots` según `noindex`; si no, `index, follow, max-image-preview:large, max-snippet:-1`.
- **Open Graph** completo: `og:type`, `og:site_name`, `og:locale`, `og:title`, `og:description`,
  `og:url`, `og:image` (1200×630 con texto alternativo) y `og:image:alt`.
- **Twitter Card** `summary_large_image` con título, descripción e imagen.
- Metadatos de negocio: `theme-color` (`#B4522C`), `author`, `geo.region` (`HN`) y
  `format-detection` para no convertir números en enlaces telefónicos.
- `<html lang="es-HN">`, iconos, `manifest.webmanifest` y enlace al sitemap.

### 6.2 Datos estructurados JSON-LD

Se generan en `src/lib/seo.ts` y se inyectan desde la plantilla base más los bloques que añade
cada página:

| Tipo | Dónde | Qué aporta |
| ---- | ----- | ---------- |
| `Organization` / `Store` | Todas las páginas (base) | Identidad del negocio, zona atendida y rango de precios orientativo |
| `WebSite` | Todas las páginas (base) | Nombre y URL del sitio |
| `BreadcrumbList` | Páginas internas, vía `Migas.astro` | Ruta de navegación en los resultados de búsqueda |
| `FAQPage` | Preguntas frecuentes | Posibilidad de resultados enriquecidos para las FAQ |
| `Product` | Ficha de producto | Nombre, descripción, materiales, origen y disponibilidad |
| `ItemList` | Listados de catálogo | Orden de los productos en las páginas de categoría |

### 6.3 Sitemap, robots y manifest

- **Sitemap:** `@astrojs/sitemap` con un filtro que **excluye la página 404**. Se puede consultar
  en `/sitemap-index.xml`.
- **`robots.txt`:** en `public/`, permite el rastreo y declara la ubicación del sitemap.
- **`manifest.webmanifest`:** nombre, colores de tema y iconos, para que el sitio se pueda añadir
  a la pantalla de inicio.

### 6.4 Rendimiento

- `compressHTML: true` e `inlineStylesheets: 'auto'`: menos peticiones y HTML más ligero.
- **Prefetch** activado (`prefetchAll`, estrategia `viewport`): Astro precarga las páginas a las
  que el usuario probablemente irá, y la navegación se siente instantánea en un sitio estático.
- Salida sin JavaScript de framework en el cliente: el sitio es HTML y CSS.
- Tipografías variables autoalojadas, con `font-synthesis-weight: none` para evitar falsos
  negritos.

---

## 7. Accesibilidad

La accesibilidad no es un añadido posterior, está integrada en la plantilla base y en
`global.css`.

| Medida | Implementación |
| ------ | -------------- |
| **Enlace de salto** | Primer elemento enfocable de la página ("Saltar al contenido"), con la clase `.salto-contenido`: oculto salvo al recibir foco, cuando aparece fijo en la esquina superior izquierda (fondo `barro-700`, texto crema). |
| **Foco visible** | Regla `:focus-visible` global: contorno de 3 px en `--color-barro-600` con 3 px de separación. Nunca `outline: none` sin sustituto. |
| **Movimiento reducido** | Bloque `@media (prefers-reduced-motion: reduce)` que lleva animaciones y transiciones a 0.01 ms y desactiva el desplazamiento suave, para quien lo pide al sistema. |
| **Navegación** | `<nav>` con `aria-label`, `aria-current` en el enlace activo y estado activo calculado con `esRutaActiva()`. |
| **Acordeones** | `aria-expanded` y `aria-controls` gestionados por `Acordeon.astro`. |
| **Imágenes** | Texto alternativo descriptivo en todas las imágenes de contenido; los motivos decorativos se marcan como tales. |
| **Contraste** | Los pares texto/fondo del sistema de diseño mantienen contraste suficiente (se prefirieron los tonos oscuros de `tinta` para texto sobre crema). |
| **Estructura** | Un solo `<h1>` por página y jerarquía de encabezados coherente; el contenido principal va en `<main>` con `id` para el enlace de salto. |
| **Botones de contacto** | Enlaces con texto comprensible ("Escribir por WhatsApp"), no solo un icono. |

**Pendiente honesto:** comprobar el sitio con un lector de pantalla real (NVDA o VoiceOver) y con
navegación solo por teclado antes de publicar. Está en
[CHECKLIST-LANZAMIENTO.md](CHECKLIST-LANZAMIENTO.md).

---

## 8. Configuración central del negocio

`src/config/site.ts` es el **único origen** de los datos del negocio. Ninguna página escribe un
número de teléfono, una forma de pago o una modalidad de envío directamente.

| Export | Contenido |
| ------ | --------- |
| `SITE` | Nombre, nombre corto, eslogan, descripción, URL, `base`, idioma (`es-HN`), moneda (`HNL`), país y año de fundación |
| `CONTACTO` | WhatsApp (número, versión visible, mensaje por defecto, horario), correo opcional y redes sociales |
| `FUNCIONES` | Banderas: `mostrarPrecios`, `mostrarPreciosMayoreo`, `mostrarCarrito`, `mostrarFormularioContacto`, `mostrarBuscador` |
| `NAVEGACION` | Estructura del menú |
| `METODOS_PAGO` | Formas de pago, con `destacado` para las prioritarias |
| `ENVIOS` | Modalidades de entrega |
| `PREGUNTAS_FRECUENTES` | Preguntas y respuestas (alimentan la página de FAQ y su JSON-LD) |
| `NEGOCIO` | Tipo de negocio, categoría, zona atendida y rango de precios orientativo para datos estructurados |

Dos detalles deliberados:

- **`FUNCIONES.mostrarPrecios = false`.** El modelo de la Fase 1 es consultivo: los precios se dan
  por WhatsApp. Ponerlo en `true` requiere además llenar `precio` en cada producto.
- **`whatsapp.numero` con aviso.** `src/lib/whatsapp.ts` comprueba en tiempo de build si el número
  sigue siendo el de ejemplo (`50400000000`) y, de ser así, imprime una advertencia en consola.
  CI lleva esa comprobación más lejos: **advierte en pull requests y falla en `master`.**

---

## 9. Publicación y automatización

### 9.1 Integración continua — `.github/workflows/ci.yml`

Se ejecuta en **push a `master`** y en **pull requests**. Permisos: `contents: read` únicamente.

1. `npm ci` — instalación reproducible desde `package-lock.json`.
2. `npm run check` — `astro check`: TypeScript y plantillas.
3. `npm run catalogo:validar` — esquemas de Zod sobre el contenido.
4. `npm run build` — genera el sitio.
5. **Comprobación del número de WhatsApp:** advierte si estamos en un pull request y falla si
   estamos en `master`.

### 9.2 Despliegue — `.github/workflows/deploy.yml`

Se ejecuta en **push a `master`**. Permisos: `contents: read`, `pages: write`,
`id-token: write`. Concurrencia `group: pages` con `cancel-in-progress: false`, para no cortar una
publicación a medias.

1. `actions/checkout@v4`
2. `actions/setup-node@v4` con `node-version: 20` y `cache: npm`
3. `npm ci`
4. `npm run build`
5. `actions/configure-pages@v5`
6. `actions/upload-pages-artifact@v3` con `path: ./dist`
7. `actions/deploy-pages@v4` en el entorno `github-pages`, con la URL del despliegue como salida

No se usa la rama `gh-pages`: el artefacto se publica directamente. En el repositorio, la fuente
de Pages debe estar en **GitHub Actions**.

---

## 10. Extensiones y mantenimiento

### 10.1 Añadir un producto

Crear un `.json` en `src/data/productos/`. Nada más: la carga es por glob, las rutas se generan
solas y la validación avisa si algo falta. Pasos detallados en
[GUIA-CONTENIDO.md](GUIA-CONTENIDO.md).

### 10.2 Añadir una categoría

Agregar un objeto a `src/data/categorias.json` con un `slug` nuevo. Las páginas
`/tienda/[categoria]` se generan automáticamente con `getStaticPaths()`, y los productos que usen
ese `slug` pasan a agruparse en ella.

### 10.3 Añadir una página

Crear el `.astro` en `src/pages/`. La ruta se deriva del nombre del archivo. La página debe usar
`Base.astro`, declarar `titulo` y `descripcion`, y construir sus enlaces con `enlace()`.

### 10.4 Añadir un icono

Ampliar `ICONOS` en `src/lib/catalogo.ts`, registrar el trazado en `src/lib/iconos.ts` y
—si debe usarse en el catálogo— añadirlo al generador de SVG. **No declarar uniones de tipos
dentro de un `.astro`** (ver §5.5).

### 10.5 Cambiar la identidad visual

Editar los tokens de `@theme` en `src/styles/global.css`. Nada más: los alias semánticos propagan
el cambio a todo el sitio. Si se cambia el color primario, hay que mantener `theme-color` en
`Base.astro` y los colores del manifest en coherencia.

### 10.6 Deuda técnica conocida y límites de la Fase 1

| Tema | Estado |
| ---- | ------ |
| Precios visibles | Implementado pero desactivado por decisión de negocio. |
| Buscador | `FUNCIONES.mostrarBuscador` está en `true`; el catálogo se filtra del lado del cliente sobre contenido ya presente. No reemplaza una búsqueda de servidor. |
| Sin carrito | Decisión de Fase 1. No hay estado de sesión ni persistencia. |
| Sin analítica | No hay herramienta instalada; instalarla obliga a actualizar la política de privacidad. |
| Fotografías | El catálogo publica ilustraciones SVG de sustitución. |
| Número de WhatsApp | **Marcador de posición. Bloqueante para publicar.** |
| Dirección de la tienda física | Pendiente. |
| Pruebas automatizadas | No hay suite de pruebas: la red de seguridad es la validación de Zod, `astro check` y el build. |
| Internacionalización | Sitio solo en español (`es-HN`). Sin estructura i18n. |
| Enlaces del pie duplicados | `src/config/navegacion.ts` (`ENLACES_LEGALES`) tiene dos entradas que apuntan a `/envios-y-pagos`: "Cómo comprar" y "Envíos y pagos". `TODO:` unificar en una sola o darle a "Cómo comprar" una ruta propia. |
