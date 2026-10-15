---
titulo: Manual de cambios
tipo: registro
tags:
  - proyecto
  - memoria
  - cambios
actualizado: 2026-10-15
estado: vigente
---

# Manual de cambios

Una entrada por cada cambio aplicado. Formato en [PLANTILLAS](PLANTILLAS.md).

**Regla:** ningún cambio se considera aplicado hasta estar aquí **y** subido a `origin/master`.
Ver [INDICE](INDICE.md) para las reglas completas.

| # | Cambio | Commit | Estado |
| - | ------ | ------ | ------ |
| C-01 | Construcción del sitio completo | `257c68b` | aplicado y desplegado |
| C-02 | Corrección de errores de `astro check` y aislamiento de `tsconfig` | `803b0b3` | aplicado y desplegado |
| C-03 | WhatsApp real, enlace de producto y Dependabot | `c5428b4` | aplicado y desplegado |
| C-04 | Alineación de la documentación con el WhatsApp publicado | `1a86cf4` | aplicado y desplegado |
| C-05 | Página de Facebook y flujo de fotografías reales | `778c400` | aplicado y desplegado |
| C-06 | Cambio de marca a Artesanías De Honduras y ubicación | `dcee4ff` | aplicado y desplegado |
| C-07 | Registro completo, bóveda de Obsidian y limpieza | `a6556c9` | aplicado y desplegado |
| C-08 | Enlace roto en la plantilla de notas | `2f3c29d` | aplicado y desplegado |
| C-09 | Sistema de memoria persistente y checklist de estado | `824a2ac` | aplicado y desplegado |
| C-10 | Dejar de versionar `.obsidian/` | `824a2ac` | aplicado y desplegado |
| C-11 | Distinguir un flujo en curso de una rotura real en el checklist | `e3a5d24` | aplicado y desplegado |

---

### C-01 — Construir el sitio completo

- **Fecha:** 2026-10-09
- **Commit:** `257c68b` — *"feat: convertir el repositorio en la tienda profesional de Arteanía Honduras"*
- **Alcance:** los 90 archivos del sitio, más CI/CD y documentación
- **Estado:** aplicado y desplegado

**Qué se hizo**

Se reemplazó la plantilla de prueba por un sitio Astro 5 + Tailwind 4 + TypeScript con salida
estática: 24 páginas, catálogo de 12 productos validado con Zod, identidad visual propia, SEO con
datos estructurados, accesibilidad, documentación y despliegue automático.

**Por qué**

El repositorio tenía 1 commit, 3 archivos y 26 líneas: un `index.html` con Bootstrap 4.3.1 y jQuery
por CDN que mostraba "Hello, world!". No era una tienda y era imposible vender con él.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Archivos rastreados | 3 | 90 | `git ls-files` |
| Líneas de código y documentación | 26 | 18 158 | `git diff --shortstat 46774af HEAD` |
| Páginas generadas | 1 | 24 | `npm run build` |
| Productos en el catálogo | 0 | 12 | `npm run catalogo:validar` |
| Dependencias por CDN externas | 3 (Bootstrap, jQuery, Popper) | 0 | Inspección del HTML |
| Errores de tipo | sin medición | 3 (detectados en C-02) | `astro check` |

**Cómo revertirlo**

```bash
git revert 257c68b
```

Devuelve el repositorio a la plantilla original. Se pierde todo el sitio: no hay nada que rehacer a
mano porque el contenido del catálogo está en los propios JSON que revierte el commit.

---

### C-02 — Corregir los errores de `astro check` y aislar la carpeta de trabajo

- **Fecha:** 2026-10-09
- **Commit:** `803b0b3` — *"fix: corregir los errores de astro check y aislar la carpeta de trabajo"*
- **Alcance:** `astro.config.mjs`, `src/lib/catalogo.ts`, `src/components/Acordeon.astro`, `src/components/SeccionEncabezado.astro`, `tsconfig.json`
- **Estado:** aplicado y desplegado

**Qué se hizo**

Se corrigieron los tres errores que reportó el CI y se excluyó la carpeta de trabajo temporal del
alcance de TypeScript.

**Por qué**

El primer push dejó el CI en rojo. Los errores eran reales, no ruido: tipos duplicados de Vite en el
plugin de Tailwind (ts 2322), `z.prettifyError` que es API de Zod 4 sobre Zod 3, y dos
importaciones sin usar. Además, `tsconfig.json` usaba `include: ["**/*"]`, así que cualquier carpeta
con copias del sitio compilado hacía que `astro check` analizara bundles minificados hasta agotar la
memoria del proceso.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Errores de `astro check` | 3 | 0 | `npm run check` |
| Avisos de `astro check` | 2 | 0 | `npm run check` |
| Archivos analizados | 37 | 37 | `npm run check` |
| Memoria al comprobar tipos | agotaba el heap | normal | Ejecución local |

**Cómo revertirlo**

```bash
git revert 803b0b3
```

Vuelven los 3 errores y el CI se pone en rojo. **No revertir sin corregir antes los tres problemas
por otra vía.**

---

### C-03 — Publicar el WhatsApp real, corregir el enlace de producto y ordenar Dependabot

- **Fecha:** 2026-10-09
- **Commit:** `c5428b4` — *"fix: publicar el WhatsApp real, corregir el enlace de producto y ordenar Dependabot"*
- **Alcance:** `src/config/site.ts`, `src/lib/whatsapp.ts`, `.github/dependabot.yml`, PR #2 de Dependabot
- **Estado:** aplicado y desplegado

**Qué se hizo**

Se publicó el número real del negocio (504 9965-3413), se corrigió el enlace de producto que
apuntaba a un 404, se añadió la configuración de Dependabot y se cerró la PR automática que propone
Astro 5 → 7.

**Por qué**

Dos motivos distintos. El primero es de negocio: WhatsApp es el único canal de venta del sitio y
apuntaba a un marcador, así que **el sitio no podía cerrar un solo pedido**. El segundo es un fallo
que ya estaba en producción: el enlace de la pieza dentro del mensaje de WhatsApp se construía con
`new URL()` contra el dominio sin el subdirectorio de GitHub Pages, así que al abrirlo desde el chat
daba 404.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Número en los enlaces `wa.me` | `50400000000` (inexistente) | `50499653413` | Inspección del HTML desplegado |
| Enlaces de producto con la ruta correcta | 0 de 24 fichas | 12 de 12 | `Select-String` sobre `dist/` |
| PR automáticas que rompen el build | 2 abiertas | 0 | `gh pr list` |
| Paquetes con salto mayor propuesto | astro, sharp | 0 | `.github/dependabot.yml` |

**Cómo revertirlo**

```bash
git revert c5428b4
```

**No hacerlo sin querer volver al marcador**: revierte el número real y el sitio deja de vender.
Además reintroduce el enlace roto y las PR automáticas de Astro 7.

---

### C-04 — Alinear la documentación con el WhatsApp publicado

- **Fecha:** 2026-10-09
- **Commit:** `1a86cf4` — *"docs: alinear la documentacion con el WhatsApp real ya publicado"*
- **Alcance:** `README.md`, `docs/GUIA-CONTENIDO.md`, `docs/CHECKLIST-LANZAMIENTO.md`, `CHANGELOG.md`, `ANALISIS.md`
- **Estado:** aplicado y desplegado

**Qué se hizo**

Se actualizaron los cinco documentos que describían el número de WhatsApp como pendiente
bloqueante, y se corrigieron dos imprecisiones del análisis.

**Por qué**

Tras C-03, la documentación afirmaba algo falso: decía que el número seguía siendo de ejemplo y que
era obligatorio cambiarlo antes de publicar. Documentación desactualizada es peor que ausente,
porque induce a error a quien la lea después.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Referencias al marcador `50400000000` en documentos | 12 | 0 (salvo el registro histórico) | Búsqueda en los `.md` |
| Pendientes bloqueantes declarados | 5 | 4 | `docs/CHECKLIST-LANZAMIENTO.md` |

**Cómo revertirlo**

```bash
git revert 1a86cf4
```

Revierte solo texto. El efecto es que la documentación vuelve a mentir sobre el estado del número.

---

### C-05 — Integrar la página de Facebook y crear el flujo de fotografías reales

- **Fecha:** 2026-10-09
- **Commit:** `778c400` — *"feat: integrar la pagina de Facebook y anadir el flujo para fotografias reales"*
- **Alcance:** `src/config/site.ts`, `src/components/Footer.astro`, `src/pages/contacto.astro`, `src/lib/iconos.ts`, `src/lib/catalogo.ts`, `src/lib/seo.ts`, `src/pages/producto/[slug].astro`, `scripts/procesar-fotos.py`, `package.json`, `.gitignore`
- **Estado:** aplicado y desplegado

**Qué se hizo**

Se publicó el enlace de la página de Facebook en el pie de todas las páginas y en una tarjeta de
contacto, con entrada `sameAs` en el marcado estructurado. Se creó `npm run fotos:procesar`, que
optimiza fotografías, elimina el EXIF y actualiza los JSON del catálogo. De paso se corrigieron dos
fallos: las rutas de imagen no pasaban por el helper de base y la imagen de Open Graph se forzaba al
SVG aunque hubiera foto.

**Por qué**

El negocio pidió usar la página de Facebook y sus fotos. Facebook no permite descargar las fotos sin
sesión iniciada (verificado en [E-08](REGISTRO-DE-RESULTADOS.md)), así que se construyó el flujo
para que cargarlas sea un solo comando. Los dos fallos corregidos no se habían manifestado todavía
porque **el catálogo aún no tenía ninguna foto real**: habrían aparecido en el primer uso.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Páginas con enlace a Facebook | 0 | 24 de 24 (49 apariciones) | `Select-String` sobre `dist/` |
| Entradas `sameAs` en el marcado estructurado | 0 | 1 | Inspección del JSON-LD |
| Rutas de imagen que aplican el `base` | 0 | todas | `dist/producto/*/index.html` |
| Prueba del flujo de fotos | sin medir | 2 de 4 fotos emparejadas, 1 suelta reportada | `python scripts/procesar-fotos.py` |

**Cómo revertirlo**

```bash
git revert 778c400
```

Desaparece el enlace de Facebook, el comando de fotos y las dos correcciones. Si para entonces ya
hay fotografías reales en el catálogo, **revertir reintroduce el 404 de imágenes**: comprobar
`dist/producto/*/index.html` después de revertir.

---

### C-06 — Cambiar la marca a Artesanías De Honduras y publicar la ciudad

- **Fecha:** 2026-10-09
- **Commit:** `dcee4ff` — *"feat: renombrar la marca a Artesanias De Honduras y publicar la ciudad de la tienda"*
- **Alcance:** 29 archivos (48 reemplazos) más `src/config/site.ts`, `src/lib/seo.ts`, `src/components/Logo.astro`, recursos regenerados
- **Estado:** aplicado y desplegado

**Qué se hizo**

Se unificó la marca a **Artesanías De Honduras**, el nombre que ya tiene audiencia en Facebook, y se
publicó la ciudad de la tienda (**Choloma, Cortés**) en el pie, en contacto, en envíos y en el
`PostalAddress` del marcado estructurado.

**Por qué**

El sitio se llamaba Arteanía Honduras y la página de Facebook Artesanías De Honduras: dos nombres
distintos para el mismo negocio, lo que confunde al buscar y al compartir. Sobre la ubicación, la
ciudad ya era información pública en Facebook, así que publicarla no revela nada nuevo y ayuda a
aparecer en búsquedas locales.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Archivos con la marca antigua | 29 | 0 | Barrido de `git ls-files` |
| Reemplazos aplicados | — | 48 | Script de renombrado |
| Ruta base `/ArteaniaHonduras` intacta | sí | sí | `git grep` sobre config y enlaces |
| Referencias a la ciudad en lo publicado | 0 | 3 páginas + JSON-LD | `Select-String` sobre `dist/` |
| Rendimiento verificado en móvil | 390 px sin desbordes | igual | Captura con viewport CSS real |

**Cómo revertirlo**

```bash
git revert dcee4ff
```

Vuelve el nombre anterior en todo el sitio. **Ojo:** el renombrado se hizo con un script que solo
toca la forma acentuada (`Arteanía`); la ruta base sin tilde (`ArteaniaHonduras`) nunca se tocó. Si
se revierte a mano en lugar de con `git revert`, hay que respetar esa distinción o se rompe el
despliegue.

---

### C-07 — Registrar todos los cambios, montar la bóveda de Obsidian y limpiar el HTML huérfano

- **Fecha:** 2026-10-09
- **Commit:** `a6556c9` — *"docs: registrar todos los cambios, montar la boveda de Obsidian y limpiar el HTML huerfano"*
- **Alcance:** `CHANGELOG.md`, `docs/INVENTARIO.md`, `docs/HISTORIAL.md`, `docs/INICIO.md`, `docs/mapa-proyecto.canvas`, `.obsidian/`, `LICENSE`, `.github/ISSUE_TEMPLATE/config.yml`, `index.html`
- **Estado:** aplicado y desplegado

**Qué se hizo**

Se reescribió el CHANGELOG para que registrara de verdad todo lo hecho, se creó el inventario
archivo por archivo, se montó la bóveda de Obsidian y se eliminó el `index.html` huérfano. También
se corrigieron dos fallos detectados durante el inventario: `LICENSE` conservaba la marca antigua y
el selector de incidencias apuntaba a un enlace roto.

**Por qué**

El CHANGELOG le faltaba más de la mitad de los cambios (Facebook, fotos, marca, ubicación,
Dependabot y 4 de los 7 errores corregidos). Y `index.html` seguía en la raíz con el "Hello, world!"
original: Astro nunca lo usó —la portada se genera desde `src/pages/index.astro`— así que era peso
muerto que podía hacer pensar que ese era el sitio.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Secciones del CHANGELOG que cubrían cambios reales | 3 de 9 | 9 de 9 | Revisión contra `git log` |
| Archivos documentados en el inventario | 0 | 100 de 100 | Verificación automática contra `git ls-files` |
| Archivos con la marca antigua | 1 (`LICENSE`) | 0 | Barrido de `git ls-files` |
| Enlaces wiki (incompatibles con GitHub) | 16 | 0 | Verificación de enlaces |
| `index.html` en la raíz | 1318 bytes versionados | eliminado | `git ls-files` |

**Cómo revertirlo**

```bash
git revert a6556c9
```

Devuelve el `index.html` huérfano, el CHANGELOG incompleto y los dos fallos corregidos. La bóveda de
Obsidian se conserva porque C-10 dejó de versionarla.

---

### C-08 — Corregir un enlace roto en la plantilla de notas

- **Fecha:** 2026-10-09
- **Commit:** `2f3c29d` — *"fix: corregir un enlace roto en la plantilla de notas de la boveda"*
- **Alcance:** `docs/plantillas/PLANTILLA-NOTA.md`
- **Estado:** aplicado y desplegado

**Qué se hizo**

El enlace pasó de `INICIO.md` a `../INICIO.md`.

**Por qué**

La plantilla vive en `docs/plantillas/` y enlazaba a `INICIO.md` sin subir un nivel, así que el
enlace no resolvía. Lo detectó la verificación automática de enlaces internos, no una lectura
manual.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Enlaces internos rotos en la documentación | 1 | 0 | Script de verificación sobre todos los `.md` |

**Cómo revertirlo**

```bash
git revert 2f3c29d
```

---

### C-09 — Sistema de memoria persistente y checklist de estado

- **Fecha:** 2026-10-15
- **Commit:** `824a2ac` — *"feat: memoria persistente del proyecto, reglas para agentes y checklist de estado"*
- **Alcance:** `AGENTS.md`, `docs/memoria/` (5 archivos), `scripts/estado.py`, `package.json`
- **Estado:** aplicado y desplegado

**Qué se hizo**

Se creó la memoria persistente del proyecto en el propio repositorio: índice, manual de cambios,
registro de resultados, log de sesiones y plantillas. Se añadió `AGENTS.md` con las tres reglas
obligatorias y `scripts/estado.py`, un checklist de solo lectura que mide el estado real.

**Por qué**

No existía forma de saber, sin reconstruirlo a mano, qué decisiones estaban vivas, con qué evidencia
se tomaron ni qué se había descartado. Cada sesión nueva empezaba de cero. La memoria vive en
archivos versionados, sin depender de ninguna herramienta opaca de terceros.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Archivos de memoria versionados | 0 | 5 | `git ls-files docs/memoria` |
| Reglas obligatorias para agentes | 0 | 3 | `AGENTS.md` |
| Bloques que cubre el checklist | 0 | 6 | `python scripts/estado.py` |
| Comprobaciones del checklist | 0 | 41 | `python scripts/estado.py` |
| Estado medido al crear la memoria | sin medición | 28 ✅ · 7 ❌ · 1 ⚠️ · 5 ➖ | `python scripts/estado.py` |

**Cómo revertirlo**

```bash
git revert <hash>   # borra los 5 archivos de memoria, AGENTS.md y scripts/estado.py
```

Al revertir se pierde el registro entero. **Exportar antes** si el motivo es rehacer el formato.

---

### C-10 — Dejar de versionar `.obsidian/`

- **Fecha:** 2026-10-15
- **Commit:** `824a2ac` — *"feat: memoria persistente del proyecto, reglas para agentes y checklist de estado"*
- **Alcance:** `.gitignore`, índice de git (4 archivos destrackeados)
- **Estado:** aplicado y desplegado

**Qué se hizo**

`.obsidian/` pasó de versionarse parcialmente a estar ignorado por completo, y sus 4 archivos se
retiraron del índice con `git rm -r --cached`.

**Por qué**

Obsidian reescribe su configuración cada vez que abre la bóveda: registra los plugins de su versión,
crea `graph.json` y elimina el salto de línea final. Al versionarla, el repositorio aparecía sucio en
cada apertura, así que la comprobación "sin commits pendientes" dejó de ser una señal fiable — y esa
comprobación es una de las reglas del proyecto. La bóveda se sigue abriendo igual: Obsidian regenera
su configuración en la primera apertura.

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Archivos de `.obsidian/` rastreados | 4 | 0 | `git ls-files .obsidian` |
| Cambios pendientes por abrir Obsidian | 4 | 0 | `git status --porcelain` |
| ¿La bóveda sigue funcionando? | sí | sí | La carpeta sigue en disco |

**Cómo revertirlo**

```bash
git revert <hash> && git add .obsidian
```

**No recomendado:** vuelve el repositorio sucio en cada apertura de la bóveda.

---

### C-11 — Distinguir un flujo en curso de una rotura real en el checklist

- **Fecha:** 2026-10-15
- **Commit:** `e3a5d24` — *"fix(estado): distinguir un flujo en curso de una rotura real"*
- **Alcance:** `scripts/estado.py`
- **Estado:** aplicado y desplegado

**Qué se hizo**

Los flujos en estado transitorio (`in_progress`, `queued`, `waiting`…) siguen contando como ❌, pero
el mensaje ahora dice **EN CURSO** y pide volver a medir, en lugar de parecer una avería.

**Por qué**

La primera medición tras publicar marcó dos ❌ porque el CI y el despliegue todavía estaban
corriendo. Es correcto que cuenten como fallo —lo no verificable se declara pendiente, y no se puede
afirmar que el proyecto esté al 100% mientras el despliegue no termine—, pero el mensaje no
distinguía "aún no terminó" de "se rompió".

**Evidencia**

| Métrica | Antes | Después | Cómo se midió |
| ------- | ----- | ------- | ------------- |
| Mensaje de un flujo en curso | `in_progress · hace 0.0 días` | `EN CURSO (in_progress) · aún no se puede verificar` | `npm run estado` |
| ¿Se confunde con una rotura? | sí | no | Inspección del informe |
| Semántica del veredicto | sin cambio | sin cambio (sigue siendo ❌) | `npm run estado` |

**Cómo revertirlo**

```bash
git revert e3a5d24
```

Vuelve el mensaje ambiguo. No afecta a ninguna otra comprobación.
