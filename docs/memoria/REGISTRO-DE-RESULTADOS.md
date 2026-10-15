---
titulo: Registro de resultados
tipo: registro
tags:
  - proyecto
  - memoria
  - experimentos
actualizado: 2026-10-15
estado: vigente
---

# Registro de resultados

Una fila por cada experimento o medición, **incluidos los descartados**, para no repetir el trabajo.
Formato en [PLANTILLAS](PLANTILLAS.md).

**Regla:** una idea sin resultado es una hipótesis, no una opción. Ver [INDICE](INDICE.md).

| # | Pregunta | Veredicto |
| - | -------- | --------- |
| E-01 | ¿pnpm sirve como gestor de paquetes en este entorno? | ❌ refutada — descartado |
| E-02 | ¿Astro compila dentro del sandbox de escritura? | ❌ refutada — requiere permisos ampliados |
| E-03 | ¿Astro admite uniones de tipos multilínea en el frontmatter? | ❌ refutada |
| E-04 | ¿Tailwind 4 permite `@apply` de clases propias? | ❌ refutada |
| E-05 | ¿Chrome headless captura el servidor de desarrollo? | ❌ refutada — se usa el build estático |
| E-06 | ¿El layout móvil desborda a 390 px? | ❌ refutada — era un artefacto del navegador |
| E-07 | ¿El renombrado por expresión regular toca la ruta base? | ✅ confirmada — 0 afectaciones |
| E-08 | ¿Se pueden descargar las fotos de Facebook sin sesión? | ❌ refutada |
| E-09 | ¿El plugin `dsh-find-plugin` es compatible con el runtime? | ⚠️ inconclusa — incompatibilidad nominal |
| E-10 | ¿Dependabot propone saltos que rompen el build? | ✅ confirmada |
| E-11 | Estado medido del proyecto al crear la memoria | 📊 medición base |
| E-12 | ¿El checklist detecta fallos que "el CI está verde" oculta? | ✅ confirmada |

---

### E-01 — ¿pnpm sirve como gestor de paquetes en este entorno?

- **Fecha:** 2026-10-09
- **Hipótesis:** pnpm instala y resuelve el árbol de dependencias igual que npm.
- **Método:** `pnpm install` sobre el proyecto recién creado, en Windows 11 con `LongPathsEnabled=0`.
- **Veredicto:** ❌ **refutada — descartado**

**Números**

| Medición | Valor |
| -------- | ----- |
| Resultado de la instalación | falló dos veces |
| Paquetes añadidos antes de abortar | 382 |
| `node_modules/.bin` creado | 0 ejecutables |
| `pnpm-lock.yaml` | no se generó |
| Longitud de la ruta del almacén virtual | 164 caracteres solo en el nombre del paquete |

**Conclusión**

Las *junctions* que pnpm crea con nombres largos no resuelven porque la ruta supera el límite de
260 caracteres y `LongPathsEnabled` está en 0. Se adoptó **npm**, que crea un árbol plano. **No
volver a proponer pnpm en Windows con esta configuración.**

---

### E-02 — ¿Astro compila dentro del sandbox de escritura?

- **Fecha:** 2026-10-09
- **Hipótesis:** el build funciona sin permisos especiales.
- **Método:** `node node_modules/astro/astro.js build` bajo política de escritura restringida.
- **Veredicto:** ❌ **refutada — requiere permisos ampliados**

**Números**

| Medición | Valor |
| -------- | ----- |
| Primer error | `EPERM: mkdir 'AppData\Roaming\astro\Config'` (telemetría) |
| Segundo error | `spawn EPERM` en `optimizeSafeRealPathSync` de Vite |
| Causa raíz | el sandbox bloquea procesos hijos con stdio por tubería |
| Solución aplicada | `ASTRO_TELEMETRY_DISABLED=1` + ejecución con permisos ampliados |

**Conclusión**

El build **sí funciona** con permisos ampliados. La telemetría de Astro se desactiva siempre con
`ASTRO_TELEMETRY_DISABLED=1`. **No confundir este error con un problema del código**: es del
entorno.

---

### E-03 — ¿Astro admite uniones de tipos multilínea en el frontmatter?

- **Fecha:** 2026-10-09
- **Hipótesis:** el frontmatter de un `.astro` acepta TypeScript completo.
- **Método:** build con una unión de tipos multilínea en `Icono.astro`.
- **Veredicto:** ❌ **refutada**

**Números**

| Medición | Valor |
| -------- | ----- |
| Error | `Unexpected "|"` en `src/components/Icono.astro:38:2` |
| Miembros de la unión | 23 |
| Solución | mover los tipos a `src/lib/iconos.ts` |

**Conclusión**

El compilador de Astro elimina las declaraciones de tipo del frontmatter **línea por línea**, así
que una unión multilínea deja las líneas `| 'valor'` colgando. **Regla: los tipos van en módulos
`.ts`, nunca en el frontmatter de un `.astro`.** Las anotaciones en una sola línea sí funcionan.

---

### E-04 — ¿Tailwind 4 permite `@apply` de clases propias?

- **Fecha:** 2026-10-09
- **Hipótesis:** se puede componer `.btn-primario { @apply btn ... }` como en Tailwind 3.
- **Método:** build con el sistema de diseño original.
- **Veredicto:** ❌ **refutada**

**Números**

| Medición | Valor |
| -------- | ----- |
| Error | `Cannot apply unknown utility class 'btn'` |
| Clases afectadas | 8 (`btn-*`, `etiqueta-*`, `tarjeta-interactiva`) |
| Solución | agrupar selectores en lugar de componer clases |

**Conclusión**

En Tailwind v4 solo se puede `@apply` de **utilidades reales**, no de clases definidas en
`@layer components`. **Regla: compartir base agrupando selectores, no con `@apply` de clases
propias.**

---

### E-05 — ¿Chrome headless captura el servidor de desarrollo?

- **Fecha:** 2026-10-09
- **Hipótesis:** se puede capturar `localhost:4321` igual que el sitio publicado.
- **Método:** Chrome headless con `--screenshot` contra el servidor de desarrollo de Astro.
- **Veredicto:** ❌ **refutada — se usa el build estático**

**Números**

| Medición | Valor |
| -------- | ----- |
| Intentos | 3 (con y sin `--virtual-time-budget`) |
| Capturas generadas | 0 |
| Causa | el servidor mantiene abierta la conexión de recarga en vivo y la página nunca se considera terminada |
| Alternativa que sí funciona | servir `dist/` con `python -m http.server` y capturar eso |

**Conclusión**

Para verificar visualmente se compila, se replica la estructura de GitHub Pages
(`sitio/ArteaniaHonduras/`) y se captura el resultado estático. **No perder tiempo capturando el
servidor de desarrollo.**

---

### E-06 — ¿El layout móvil desborda a 390 px?

- **Fecha:** 2026-10-09
- **Hipótesis:** la portada tiene desbordamiento horizontal en móvil.
- **Método:** capturas a 390, 412 y 500 px, en modo headless nuevo y antiguo.
- **Veredicto:** ❌ **refutada — era un artefacto del navegador**

**Números**

| Anchura | Resultado |
| ------- | --------- |
| 390 px | contenido recortado a la derecha |
| 412 px | contenido recortado a la derecha |
| 500 px | **layout correcto, sin desbordes** |
| 390 px con escala 2 (viewport CSS real) | **layout correcto, sin desbordes** |

**Conclusión**

Chrome en Windows impone un ancho mínimo de ventana de unos 500 px, así que a 390 estaba **maquetando
a 500 y recortando la imagen**. El layout siempre estuvo bien. **Para medir móvil de verdad, usar
`--force-device-scale-factor=2` con el doble de ancho de ventana.**

---

### E-07 — ¿El renombrado por expresión regular toca la ruta base de GitHub Pages?

- **Fecha:** 2026-10-09
- **Hipótesis:** un reemplazo global de la marca rompería la ruta `/ArteaniaHonduras`.
- **Método:** reemplazar solo `Arteanía` (con tilde) y comprobar las rutas después.
- **Veredicto:** ✅ **confirmada — 0 afectaciones**

**Números**

| Medición | Valor |
| -------- | ----- |
| Archivos modificados | 29 |
| Reemplazos aplicados | 48 |
| Archivos que conservaron la ruta `/ArteaniaHonduras` | 13 |
| Rutas dañadas | 0 |

**Conclusión**

La marca se escribe **con tilde** (`Arteanía`) y la ruta del repositorio **sin tilde**
(`ArteaniaHonduras`). Eso permite distinguirlas con seguridad en un reemplazo. **Regla: nunca
renombrar la ruta base; siempre verificar `git grep ArteaniaHonduras` después de un renombrado.**

---

### E-08 — ¿Se pueden descargar las fotos de Facebook sin sesión?

- **Fecha:** 2026-10-09
- **Hipótesis:** el enlace de la página devuelve el contenido público, incluidas las imágenes.
- **Método:** `web_fetch` sobre el enlace de compartir y sobre la URL canónica del perfil; `Invoke-WebRequest` con *user-agent* de navegador.
- **Veredicto:** ❌ **refutada**

**Números**

| Intento | Resultado |
| ------- | --------- |
| Enlace de compartir | resuelve al perfil `people/Artesanias-De-Honduras/100063559657469/` |
| Contenido devuelto | solo el `<title>` (`Artesanias De Honduras \| Choloma`) |
| Petición desde PowerShell | HTTP 400 |
| Imágenes obtenidas | 0 |
| Muro de inicio de sesión | presente |

**Conclusión**

No hay forma de descargar las fotos sin credenciales. **No reintentar**: el flujo construido
(`npm run fotos:procesar`) está esperando que las fotos se suban a mano a `fotos-originales/`.

---

### E-09 — ¿El plugin `dsh-find-plugin` es compatible con el runtime instalado?

- **Fecha:** 2026-10-09
- **Hipótesis:** el plugin se instala sin problemas; es la última versión publicada.
- **Método:** auditoría estática del código, intento real de instalación y extracción de la API del `app.asar` del runtime.
- **Veredicto:** ⚠️ **inconclusa — incompatibilidad nominal, código compatible**

**Números**

| Medición | Valor |
| -------- | ----- |
| Versión auditada | 0.4.0 (última publicada, 25-sep-2026) |
| Rango declarado de `@deepseek-ai/dsh-tools` | hasta `0.1.7-alpha.1` |
| Versión real del runtime | `0.2.0-rc.2` |
| Resultado de la instalación | rechazada por incompatibilidad de versión |
| `defineTool` presente en el runtime | sí, con la misma firma |
| Scripts de instalación peligrosos | 0 |
| Hallazgos de seguridad | 0 |

**Conclusión**

Se extrajo `@deepseek-ai/dsh-tools` del `app.asar` y se comprobó que **la API que usa el plugin no
cambió**: la incompatibilidad es solo de la lista declarada en `package.json`. Aun así, DSH exige
aceptar el riesgo explícitamente y **el negocio decidió esperar** a una versión oficialmente
compatible. No se instaló nada; el perfil quedó intacto. Informe completo en
`_revision/AUDITORIA-dsh-find-plugin.md`.

---

### E-10 — ¿Dependabot propone saltos que rompen el build?

- **Fecha:** 2026-10-09
- **Hipótesis:** las actualizaciones automáticas son seguras de revisar y aceptar.
- **Método:** observación de las PR abiertas automáticamente y su resultado en CI.
- **Veredicto:** ✅ **confirmada**

**Números**

| Medición | Valor |
| -------- | ----- |
| PR automáticas abiertas | 2 |
| PR con CI en rojo | 2 de 2 |
| Salto propuesto | Astro 5.18.2 → 7.2.8 (dos versiones mayores) |
| PR cerradas con explicación | 1 (la otra quedó obsoleta al agruparse) |
| Paquetes con salto mayor ahora bloqueado | 6 |

**Conclusión**

Dependabot proponía saltos de versión mayor que rompen el build. Se cerró la PR explicando el motivo
y se configuró `.github/dependabot.yml` para agrupar lo menor y no proponer mayores de `astro`,
`@astrojs/*`, `tailwindcss`, `@tailwindcss/*`, `typescript` ni `sharp`. **Los saltos mayores se
hacen a mano y en su propia rama.**

---

### E-11 — Estado medido del proyecto al crear la memoria

- **Fecha:** 2026-10-15
- **Hipótesis:** no aplica. Es la medición base del instrumento.
- **Método:** `python scripts/estado.py`, 41 comprobaciones en 6 bloques.
- **n / ventana:** 1 ejecución · 2026-10-15 13:49 (hora de Honduras)
- **Veredicto:** 📊 **medición base**

**Números**

| Medición | Valor |
| -------- | ----- |
| Comprobaciones ✅ | 28 |
| Comprobaciones ❌ | 7 |
| Avisos ⚠️ | 1 |
| No aplica ➖ | 5 |
| Fallos bloqueantes | 6 por archivos de memoria aún no creados + 1 por cambios sin commitear |
| Último commit | hace 5,8 días |
| Último CI y despliegue | `success`, hace 5,8 días |
| Despliegue al día | sí (commit `2f3c29d`) |
| URLs publicadas en el sitemap | 23 |
| Catálogo | 12 productos · 3 categorías · 0 errores |

**Conclusión**

Los 7 ❌ iniciales eran **esperados**: 6 por los archivos de memoria que se estaban creando en esa
misma sesión y 1 por los cambios sin commitear. Tras aplicar C-09 y C-10 y subir el commit, la
medición debe dar **0 ❌**. Esta es la línea base contra la que comparar las próximas mediciones.

---

### E-12 — ¿El checklist detecta fallos que "el CI está verde" oculta?

- **Fecha:** 2026-10-15
- **Hipótesis:** tener un checklist propio aporta algo sobre mirar si la integración continua está en verde.
- **Método:** ejecutar `npm run estado` inmediatamente después de publicar el commit `824a2ac`.
- **n / ventana:** 1 medición · 2026-10-15 13:55 (hora de Honduras)
- **Veredicto:** ✅ **confirmada**

**Números**

| Componente | Estado |
| ---------- | ------ |
| Integración continua del commit `824a2ac` | ✅ `success` |
| **Despliegue del commit `824a2ac`** | ❌ **`failure`** |
| Paso "Construir el sitio" del despliegue | ✅ `success` en 20 s |
| Paso "Publicar en GitHub Pages" | ❌ error 500 de la API de GitHub |
| Mensaje del error | *"Failed to create deployment (status: 500) … is githubstatus.com reporting a Pages outage?"* |
| Detección | el checklist lo marcó como ❌ en el bloque 3 |
| Tras relanzar el flujo | ✅ `success` en 18 s |
| Medición final | **37 ✅ · 0 ❌ · 0 ⚠️ · 4 ➖** |

**Conclusión**

**El CI y el despliegue son flujos independientes: el CI puede estar en verde con el sitio sin
actualizar.** Mirando solo "el CI está verde" —que es lo que yo habría hecho— el proyecto se habría
declarado al 100% con la publicación caída. El fallo fue de **infraestructura de GitHub** (HTTP 500
al crear el despliegue), no del código: relanzar el flujo lo resolvió sin tocar nada.

**Regla derivada:** *"CI en verde" no equivale a "desplegado".* Hay que verificar el flujo de
despliegue por separado y confirmar que lo publicado corresponde al commit actual (comprobación
"Despliegue al día" del bloque 3).
