# Arteanía Honduras

**Artesanía hecha a mano en Honduras.**

Sitio web de marca y catálogo de **Arteanía Honduras**: un espacio para mostrar piezas
artesanales hondureñas —barro, madera, fibra, textil, plata, tagua y cuero— hechas por talleres
familiares de distintos departamentos del país.

El sitio es **estático**: se genera con [Astro](https://astro.build) y se publica en GitHub
Pages. No tiene servidor, base de datos ni cobro en línea. Cada pieza se consulta y se cierra
por **WhatsApp**, que es el único canal de contacto de la marca en esta primera fase.

> **Sitio publicado:**
> <https://artesania-honuras.github.io/ArteaniaHonduras/>

---

## ⚠️ Antes de publicar: pendientes

El sitio está en línea y funcionando. El canal de venta ya apunta al número real del negocio
(**+504 9965-3413**), así que los botones de WhatsApp sí abren el chat. Queda esto por resolver
antes de difundir el enlace a gran escala:

| # | Pendiente | Dónde se corrige | Por qué importa |
| - | --------- | ---------------- | --------------- |
| 1 | **Dirección de la tienda física** y horarios | `src/config/site.ts` → `ENVIOS` (modalidad `tienda-fisica`) | La página de envíos y pagos anuncia una tienda sin dirección. |
| 2 | **Fotografías reales de producto** | Campo `imagen` de cada JSON en `src/data/productos/` | Hoy hay ilustraciones SVG generadas con `npm run imagenes:generar`. Sirven para maquetar, no para vender. |
| 3 | **Revisar privacidad y términos** con criterio propio | `src/pages/privacidad.astro`, `src/pages/terminos.astro` | Son textos base redactados como punto de partida. **No son asesoría legal.** |
| 4 | **Dominio propio (opcional)** | `site` y `base` en `astro.config.mjs` y `src/config/site.ts` | Sin dominio propio el sitio funciona, pero la URL es larga y no es de marca. |

El CI mantiene una comprobación automática: si `CONTACTO.whatsapp.numero` volviera a quedar en un
valor de ejemplo, el build imprime un aviso y el workflow **falla en `master`**. La lista completa
y accionable está en [docs/CHECKLIST-LANZAMIENTO.md](docs/CHECKLIST-LANZAMIENTO.md).

---

## Requisitos

- **Node.js >= 20.11** (declarado en `engines` de `package.json`)
- **npm** (hay `package-lock.json` en el repositorio)

> **¿Por qué npm y no pnpm?** Se probó pnpm y se descartó: en Windows, con `LongPathsEnabled=0`,
> la instalación falla por un problema real de *junctions* en el almacén de paquetes. No es una
> preferencia de estilo, es una limitación del entorno. Ver [ANALISIS.md](ANALISIS.md).

## Instalación

```bash
npm install
```

## Comandos

| Script | Comando real | Para qué sirve |
| ------ | ------------ | -------------- |
| `npm run dev` | `astro dev` | Servidor de desarrollo en `http://localhost:4321/ArteaniaHonduras/`. |
| `npm start` | `astro dev` | Alias de `dev`. |
| `npm run build` | `astro build` | Genera el sitio estático en `dist/`. |
| `npm run preview` | `astro preview` | Sirve `dist/` localmente para revisar el resultado final. |
| `npm run check` | `astro check` | Revisa errores de TypeScript y de plantillas `.astro`. |
| `npm run verify` | `astro check && astro build` | Verificación completa antes de subir cambios. **Es el comando a correr siempre.** |
| `npm run catalogo:validar` | `node scripts/validar-catalogo.mjs` | Valida los JSON del catálogo sin compilar el sitio. Error claro y sin build. |
| `npm run imagenes:generar` | `node scripts/generar-imagenes.mjs` | Regenera las ilustraciones SVG de los productos. |
| `npm run format` | `prettier --write .` | Formatea todo el proyecto. |
| `npm run format:check` | `prettier --check .` | Comprueba el formato sin escribir (lo que corre CI). |

Antes de abrir un pull request:

```bash
npm run format && npm run verify && npm run catalogo:validar
```

> **Nota sobre `format` y la documentación:** Prettier formatea también los `.md` (no están
> excluidos en `.prettierignore`) y reajusta los párrafos a `printWidth: 100`, lo que refluye las
> tablas de `README.md` y de `docs/`. Es esperado. Si en algún momento se agrega
> `npm run format:check` al workflow de CI, conviene decidir antes si la documentación se formatea
> o si se excluye con `*.md` en `.prettierignore`.

---

## Por qué la URL lleva `/ArteaniaHonduras/`

El repositorio se publica como **project site** de GitHub Pages, no como sitio de usuario. En
GitHub Pages, un *project site* vive en un subdirectorio:

```text
https://artesania-honuras.github.io/ArteaniaHonduras/
└── usuario/organización      └── nombre del repositorio (= base)
```

Por eso `astro.config.mjs` define:

```js
site: 'https://artesania-honuras.github.io',
base: '/ArteaniaHonduras',
```

**La consecuencia práctica es la trampa más común de este proyecto.** Un `href="/tienda"` escrito
a mano apunta a `https://artesania-honuras.github.io/tienda`, que **no existe**, y el enlace se
rompe en producción aunque en `npm run dev` parezca funcionar.

**Regla del proyecto: todos los enlaces internos se construyen con el helper `enlace()` de
`src/lib/rutas.ts`.** Nunca a mano.

```astro
---
import { enlace } from '@/lib/rutas';
---
<a href={enlace('/tienda')}>Catálogo</a>
<!-- genera /ArteaniaHonduras/tienda -->
```

El helper también expone `urlAbsoluta()` (canónicas y Open Graph), `canonica()` (normaliza la
barra final) y `esRutaActiva()` (estado activo del menú). Para imágenes y archivos de `public/`
aplica la misma regla. Todos los `href` internos del proyecto deben pasar por `enlace()`.

---

## Estructura del proyecto

```text
ArteaniaHonduras/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # Verificación en cada push y pull request
│   │   └── deploy.yml              # Publicación automática en GitHub Pages
│   ├── ISSUE_TEMPLATE/config.yml
│   └── pull_request_template.md
├── docs/
│   ├── ARQUITECTURA.md             # Cómo está construido el sitio por dentro
│   ├── GUIA-CONTENIDO.md           # Guía para editar productos sin saber programar
│   ├── CHECKLIST-LANZAMIENTO.md    # Qué revisar antes de publicar
│   └── ROADMAP-TIENDA.md           # Fase 2 y 3: carrito, pagos, panel
├── public/                         # Archivos servidos tal cual (imágenes, manifest, robots)
│   └── imagenes/productos/         # Ilustraciones SVG y fotografías de producto
├── scripts/
│   ├── validar-catalogo.mjs        # Valida los JSON del catálogo sin compilar
│   └── generar-imagenes.mjs        # Genera las ilustraciones SVG de cada producto
├── src/
│   ├── components/                 # Header, Footer, tarjetas, botones de WhatsApp, etc.
│   ├── config/
│   │   ├── site.ts                 # ⭐ Configuración central: contacto, pagos, envíos, FAQ
│   │   └── navegacion.ts           # Menú principal y del pie de página
│   ├── data/
│   │   ├── categorias.json         # Las 3 categorías del catálogo
│   │   └── productos/*.json        # Un archivo JSON por producto (hoy 12)
│   ├── layouts/Base.astro          # Plantilla HTML base: <head>, SEO, JSON-LD
│   ├── lib/
│   │   ├── catalogo.ts             # Carga los JSON y los valida con Zod
│   │   ├── rutas.ts                # ⭐ Helper enlace() y el manejo del base
│   │   ├── seo.ts                  # Datos estructurados JSON-LD
│   │   ├── iconos.ts               # Tipos e iconos (fuera de los .astro, ver nota)
│   │   └── whatsapp.ts             # Construcción de enlaces de WhatsApp
│   ├── pages/                      # Una página por ruta del sitio
│   └── styles/global.css           # Sistema de diseño (tokens de Tailwind 4)
├── astro.config.mjs                # Configuración de Astro: site, base, sitemap, Tailwind
├── package.json
└── tsconfig.json
```

### Páginas del sitio

| Ruta | Contenido |
| ---- | --------- |
| `/` | Portada: piezas destacadas, categorías, historia de la marca. |
| `/tienda` | Catálogo completo con todas las piezas. |
| `/tienda/[categoria]` | Catálogo filtrado por categoría (`artesanias`, `textiles`, `joyeria`). |
| `/producto/[slug]` | Ficha de producto: materiales, medidas, cuidados, origen y taller. |
| `/nosotros` | Historia de la marca y de los talleres. |
| `/envios-y-pagos` | Modalidades de entrega y formas de pago. |
| `/preguntas-frecuentes` | Preguntas frecuentes (también alimentan el JSON-LD `FAQPage`). |
| `/contacto` | Único canal: WhatsApp. |
| `/privacidad` | Política de privacidad (**texto base a revisar**). |
| `/terminos` | Términos y condiciones (**texto base a revisar**). |
| `/404` | Página de error. |

---

## Cómo editar el contenido

- **Cambiar el número de WhatsApp, métodos de pago, envíos o preguntas frecuentes:**
  todo vive en `src/config/site.ts`. Es el único archivo que hay que tocar.
- **Agregar, editar o retirar un producto:** se copia un JSON de `src/data/productos/`, se
  rellena y se guarda. El esquema está documentado campo por campo en
  [docs/GUIA-CONTENIDO.md](docs/GUIA-CONTENIDO.md).
- **Sustituir una ilustración SVG por una fotografía real:** campo `imagen` del producto. La
  ilustración generada se usa como respaldo mientras no haya foto.
- **Activar precios:** `FUNCIONES.mostrarPrecios = true` en `src/config/site.ts`. Hoy está en
  `false` porque el negocio decidió trabajar con "Consultar precio" por WhatsApp.
- **Cambiar colores, tipografías o espaciados:** tokens de Tailwind 4 en
  `src/styles/global.css`.

Si el build falla después de editar un JSON, casi siempre es un campo obligatorio vacío o una
categoría que no existe. La guía de contenido explica cómo leer ese error.

> **Nota técnica (trampa conocida):** Astro **no admite uniones de tipos multilínea en el
> frontmatter de un `.astro`**. El compilador las elimina mal y esbuild falla con
> `Unexpected "|"`. Los tipos van en módulos `.ts` —como `src/lib/iconos.ts`— y se importan desde
> la plantilla. Ya pasó una vez; no volver a escribirlos dentro del `.astro`.

---

## Despliegue

El despliegue es automático con **GitHub Actions**.

1. `.github/workflows/ci.yml` corre en cada push a `master` y en cada pull request:
   `npm ci`, `npm run check`, `npm run catalogo:validar` y `npm run build`. Solo tiene permiso de
   lectura del repositorio.
2. `.github/workflows/deploy.yml` corre en cada push a `master`: construye el sitio y lo publica
   en GitHub Pages. Sube `./dist` como artefacto de Pages, sin rama `gh-pages`.

En la configuración del repositorio, en **Settings → Pages → Build and deployment**, la fuente
debe estar en **GitHub Actions** (no en "Deploy from a branch").

### Red de seguridad contra publicar sin canal de contacto

`ci.yml` incluye un paso que revisa si `CONTACTO.whatsapp.numero` sigue siendo el valor de
ejemplo. Ese paso **solo advierte en los pull requests y falla el workflow en `master`**: la idea
es poder trabajar en ramas sin bloqueos, pero nunca dejar que llegue a producción un sitio cuyo
único botón de contacto no funciona.

---

## Documentación

| Documento | Qué contiene |
| --------- | ------------ |
| [ANALISIS.md](ANALISIS.md) | Análisis del repositorio original: estado encontrado, diagnóstico, decisiones, riesgos y hoja de ruta. |
| [CHANGELOG.md](CHANGELOG.md) | Historial de cambios, en formato Keep a Changelog. |
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Flujo de datos, validación con Zod, sistema de diseño, SEO y accesibilidad. |
| [docs/GUIA-CONTENIDO.md](docs/GUIA-CONTENIDO.md) | Guía paso a paso para editar el sitio sin conocimientos técnicos. |
| [docs/CHECKLIST-LANZAMIENTO.md](docs/CHECKLIST-LANZAMIENTO.md) | Lista de verificación antes de publicar. |
| [docs/ROADMAP-TIENDA.md](docs/ROADMAP-TIENDA.md) | Plan para convertir el sitio en tienda en línea (Fase 2 y 3). |
| [LICENSE](LICENSE) | Condiciones de uso del contenido y del código. |

---

## Estado del proyecto

**Fase 1 — sitio de marca y catálogo consultivo.** Completa en cuanto a código: páginas,
catálogo validado, SEO, accesibilidad y despliegue automático. Pendiente de datos reales del
negocio (ver "Antes de publicar").

Sin carrito de compras por decisión de negocio: la venta se cierra por WhatsApp. La Fase 2
—carrito, checkout y pasarelas de pago— está planificada en
[docs/ROADMAP-TIENDA.md](docs/ROADMAP-TIENDA.md).

---

© 2026 Arteanía Honduras. Contenido, fotografías, ilustraciones y textos: todos los derechos
reservados. Ver [LICENSE](LICENSE).
