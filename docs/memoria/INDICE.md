---
titulo: Índice de la memoria del proyecto
tipo: mapa
tags:
  - proyecto
  - memoria
  - indice
actualizado: 2026-10-15
estado: vigente
---

# Índice de la memoria — Artesanías De Honduras

> **Esto es lo primero que debe leer cualquier sesión nueva.** Contiene el estado real, las
> decisiones vivas con su evidencia, las fuentes de verdad, los criterios de aceptación y los
> pendientes. No hay contexto fuera del repositorio.

---

## 1. Qué es este proyecto

**Sitio web de marca y catálogo consultivo** de artesanías, textiles y joyería hechas a mano en
Honduras. No es una tienda transaccional: la venta se cierra **por WhatsApp**.

| Dato | Valor |
| ---- | ----- |
| Sitio en vivo | <https://artesania-honuras.github.io/ArteaniaHonduras/> |
| Repositorio | `Artesania-Honuras/ArteaniaHonduras` (público) |
| Tecnología | Astro 5 · Tailwind CSS 4 · TypeScript · salida 100 % estática |
| Publicación | GitHub Pages, desplegado por GitHub Actions en cada push a `master` |
| Fase | 1 — sitio de marca y catálogo, **sin carrito** |
| Catálogo | 12 productos · 3 categorías · 10 departamentos de origen |

**Lo que no existe, y conviene no buscar:** no hay servidor propio, ni base de datos, ni proceso
permanente, ni analítica, ni bots de aviso, ni tests automatizados.

---

## 2. Cómo retomar en 3 pasos

```bash
# 1. Medir el estado real (solo lectura, ~30 s)
npm run estado

# 2. Instalar dependencias y trabajar
npm install
npm run dev          # http://localhost:4321/ArteaniaHonduras/

# 3. Antes de cerrar la sesión
npm run check && npm run catalogo:validar && npm run build
#    registrar en docs/memoria/ y subir
git add -A && git commit && git push
```

Si el paso 1 da algún ❌, **resolverlo antes de tocar cualquier otra cosa**.

---

## 3. Reglas vigentes

Las tres reglas completas están en [`AGENTS.md`](../../AGENTS.md), que es lo primero que lee un
agente. Resumen:

| Regla | En una frase |
| ----- | ------------ |
| **Registro** | Cambio → `C-NN` · Experimento → `E-NN` · Sesión → Log · **todo commiteado y subido en la misma sesión** |
| **Cambios** | Sin medición reproducible, validación fuera de muestra, registro y despliegue verificado, no hay cambio |
| **Estado** | "¿Está todo al 100%?" se responde **con la tabla del checklist**, nunca con "todo ok" |

**La memoria vive solo en esta carpeta**, en archivos versionados. Prohibido usar memoria opaca de
terceros.

---

## 4. Qué contiene cada archivo de la memoria

| Archivo | Contiene | Cuándo se escribe |
| ------- | -------- | ----------------- |
| [INDICE](INDICE.md) | Este archivo: mapa, decisiones vivas y criterios de aceptación | Al cambiar una decisión o un pendiente |
| [MANUAL-DE-CAMBIOS](MANUAL-DE-CAMBIOS.md) | Una entrada `C-NN` por cambio: qué, por qué, evidencia numérica y **cómo revertirlo** | Con cada cambio aplicado |
| [REGISTRO-DE-RESULTADOS](REGISTRO-DE-RESULTADOS.md) | Una fila `E-NN` por medición: hipótesis, método, números y veredicto. **Incluye los descartes** | Con cada medición, aunque falle |
| [LOG-DE-SESIONES](LOG-DE-SESIONES.md) | Bitácora: qué se hizo, qué se rompió, qué se decidió, qué quedó abierto | Al cerrar cada sesión |
| [PLANTILLAS](PLANTILLAS.md) | Formatos vacíos de `C-NN`, `E-NN` y entrada de sesión | Cuando cambie el formato |

---

## 5. Decisiones vivas, con su evidencia

Todas las decisiones que hoy rigen el proyecto. **Si algo contradice esta tabla, la tabla manda** y
hay que corregir el código o la tabla en la misma sesión.

| Decisión | Valor vigente | Evidencia | Desde |
| -------- | ------------- | --------- | ----- |
| Nombre de la marca | **Artesanías De Honduras** | `src/config/site.ts:14` | C-06 |
| Nombre corto | Artesanías | `src/config/site.ts:15` | C-06 |
| Canal de venta | **Solo WhatsApp**, sin correo ni teléfono alternativo | `src/config/site.ts:39` | C-01 |
| Número de WhatsApp | `50499653413` (+504 9965-3413) | `src/config/site.ts:39-41` | C-03 |
| Ubicación publicada | Choloma, Cortés (Honduras). **La dirección exacta sigue pendiente** | `src/config/site.ts:231-233` | C-06 |
| Precios | **No se publican**: "Consultar precio" por WhatsApp | `src/config/site.ts:70` (`mostrarPrecios: false`) | C-01 |
| Carrito de compras | **No existe** en la fase 1 | `src/config/site.ts:70-74` | C-01 |
| Formas de pago | WhatsApp, transferencia, contra entrega, Tigo Money, BAC Credomatic | `src/config/site.ts:95-127` | C-01 |
| Entrega | Honduras, internacional y tienda física | `src/config/site.ts:142-158` | C-01 |
| Subdirectorio de publicación | `/ArteaniaHonduras` — **sin tilde**, es la ruta del repositorio | `astro.config.mjs:19` y `src/config/site.ts:24` | C-01 |
| Dominio | `https://artesania-honuras.github.io` (sin dominio propio) | `astro.config.mjs:18` | C-01 |
| Salida del build | Estática | `astro.config.mjs:21` | C-01 |
| Gestor de paquetes | **npm** (pnpm descartado) | `package-lock.json` versionado · [E-01](REGISTRO-DE-RESULTADOS.md) | C-01 |
| Servicio de imágenes de Astro | Desactivado; `sharp` no se usa | `package.json` (sin `sharp` en dependencias) | C-01 |
| Fotografías | WebP a 1400 px, **EXIF y GPS eliminados** | `scripts/procesar-fotos.py` | C-05 |
| Página de Facebook | <https://www.facebook.com/people/Artesanias-De-Honduras/100063559657469/> | `src/config/site.ts:52` · `sameAs` en el JSON-LD | C-05 |
| Bóveda de Obsidian | Sí, y **`.obsidian/` no se versiona** | `.gitignore` | C-10 |
| Marca antigua | **Prohibida**: ningún archivo puede contener `Arteanía` (con tilde) | `npm run estado`, bloque 4 | C-06 |

### 5.1 Trampas conocidas (no repetir)

| Trampa | Regla | Evidencia |
| ------ | ----- | --------- |
| Uniones de tipos multilínea en frontmatter `.astro` | **Los tipos van en módulos `.ts`** | [E-03](REGISTRO-DE-RESULTADOS.md) |
| `@apply` de clases propias en Tailwind 4 | **Agrupar selectores**, no componer clases | [E-04](REGISTRO-DE-RESULTADOS.md) |
| Símbolos Unicode en scripts de Python | **Forzar UTF-8 con reemplazo al arrancar** (`sys.stdout.reconfigure`) | `scripts/estado.py` · `scripts/procesar-fotos.py` |
| Captura de pantalla del servidor de desarrollo | Capturar el **build estático** replicando la estructura de Pages | [E-05](REGISTRO-DE-RESULTADOS.md) |
| Medir móvil con ventana estrecha en Chrome | Usar `--force-device-scale-factor=2` con el **doble** de ancho | [E-06](REGISTRO-DE-RESULTADOS.md) |
| `@apply btn` / rutas sin el helper `enlace()` | Todo enlace y toda imagen interna pasa por `enlace()` | C-05 |
| Renombrar la ruta base | La marca lleva tilde; **la ruta no** | [E-07](REGISTRO-DE-RESULTADOS.md) |
| Confundir "CI en verde" con "desplegado" | Son **flujos independientes**: verificar el despliegue por separado | [E-12](REGISTRO-DE-RESULTADOS.md) |
| Afirmar el estado sin medirlo | Correr `npm run estado` y pegar la tabla | [E-12](REGISTRO-DE-RESULTADOS.md) |

---

## 6. Herramientas fuente de verdad

Cada dato tiene **un solo** origen. Si hay que cambiarlo, se cambia ahí.

| Qué | Fuente única | Cómo se consume |
| --- | ------------ | --------------- |
| Datos del negocio (marca, WhatsApp, ubicación, pagos, envíos, FAQ) | `src/config/site.ts` | Todas las páginas y el JSON-LD |
| Catálogo de productos | `src/data/productos/*.json` (12 archivos) | `src/lib/catalogo.ts` con Zod |
| Categorías | `src/data/categorias.json` | `src/lib/catalogo.ts` |
| Sistema de diseño (colores, tipografías, sombras) | `src/styles/global.css` (`@theme`) | Todas las clases del sitio |
| Enlaces internos | `src/lib/rutas.ts` → `enlace()` | Obligatorio en todo `href`/`src` interno |
| Mensajes de WhatsApp | `src/lib/whatsapp.ts` | Todos los botones de contacto |
| Datos estructurados | `src/lib/seo.ts` | JSON-LD de cada página |
| Ilustraciones SVG | `scripts/generar-imagenes.mjs` | `npm run imagenes:generar` |
| Fotografías | `scripts/procesar-fotos.py` | `npm run fotos:procesar` |
| Imagen social e icono iOS | `scripts/generar-raster.py` | `python scripts/generar-raster.py` |
| Estado del proyecto | `scripts/estado.py` | `npm run estado` |
| Historial de versiones | `CHANGELOG.md` | Se escribe a mano |
| Inventario de archivos | `docs/INVENTARIO.md` | Se escribe a mano |

**Regla derivada:** ningún componente escribe datos del negocio por su cuenta. Si un número, un
nombre o una ruta aparece en dos sitios, uno de los dos está mal.

---

## 7. Criterios de aceptación del proyecto

El proyecto está **al 100%** cuando se cumplen **todos** estos criterios. Cualquiera se puede
verificar con un comando.

| # | Criterio | Cómo se verifica | Umbral |
| - | -------- | ---------------- | ------ |
| A1 | Todas las páginas publicadas responden | `npm run estado` (bloque 2) | 23/23 rutas HTTP 200 |
| A2 | Tipos y plantillas sin errores | `npm run check` | 0 errores, 0 avisos |
| A3 | Catálogo íntegro | `npm run catalogo:validar` | 12 productos · 3 categorías · 0 errores |
| A4 | Build reproducible | `npm run build` | 24 páginas |
| A5 | Integración continua en verde | `gh run list` | último run `success` |
| A6 | Lo publicado es el código actual | `npm run estado` (bloque 3) | mismo commit |
| A7 | Sin la marca antigua publicada | `npm run estado` (bloque 4) | 0 apariciones de `Arteanía` |
| A8 | WhatsApp real en todos los enlaces | `npm run estado` (bloque 4) | `wa.me/50499653413` |
| A9 | Repositorio limpio y sincronizado | `npm run estado` (bloque 5) | 0 pendientes · `HEAD = origin/master` |
| A10 | Sin secretos versionados | `npm run estado` (bloque 4) | 0 archivos `.env` |
| A11 | Documentación sin enlaces rotos | Verificación de enlaces | 0 enlaces rotos |
| A12 | Checklist global | `npm run estado` | **0 ❌** |

> **Nota honesta:** no hay tests automatizados ni medición de rendimiento (Lighthouse). Mientras eso
> no exista, **no se declara "rendimiento verificado"**: se declara pendiente.

---

## 8. Pendientes priorizados

| Prioridad | Pendiente | Por qué importa | Dónde se resuelve |
| --------- | --------- | --------------- | ----------------- |
| **P1** | Fotografías reales de producto | El catálogo usa ilustraciones SVG generadas: sirven para maquetar, **no para vender** | `fotos-originales/` + `npm run fotos:procesar` |
| **P1** | Dirección exacta y horarios de la tienda | El sitio anuncia una tienda física sin dirección; quien quiera ir tiene que preguntar | `UBICACION.direccion` y `UBICACION.mapsUrl` en `src/config/site.ts` |
| **P1** | Confirmar que el WhatsApp tiene atención real | Es el **único** canal de venta; un número sin respuesta equivale a una tienda cerrada | Verificación manual del negocio |
| **P2** | Revisión legal de privacidad y términos | Son textos base redactados como punto de partida, **no son asesoría legal** | `src/pages/privacidad.astro`, `src/pages/terminos.astro` |
| **P2** | Ejecutar el checklist en CI | Hoy es una herramienta manual; automatizarlo detecta roturas antes | `.github/workflows/ci.yml` |
| **P3** | Dominio propio | La URL actual es larga y no es de marca | `site` y `base` en `astro.config.mjs` y `src/config/site.ts` |
| **P3** | Analítica | Sin medición no hay datos de qué piezas se miran | Implica cookies → actualizar privacidad |
| **P4** | Fase 2: carrito, checkout y pasarelas | Es el siguiente nivel del negocio | [ROADMAP-TIENDA](../ROADMAP-TIENDA.md) |

---

## 9. Documentación de referencia

La memoria es el **registro operativo**. Estos documentos son la **referencia**:

| Documento | Para qué |
| --------- | -------- |
| [INVENTARIO](../INVENTARIO.md) | Qué es cada uno de los archivos del proyecto |
| [ARQUITECTURA](../ARQUITECTURA.md) | Cómo funciona el sitio por dentro |
| [GUIA-CONTENIDO](../GUIA-CONTENIDO.md) | Cómo editar el sitio **sin saber programar** |
| [CHECKLIST-LANZAMIENTO](../CHECKLIST-LANZAMIENTO.md) | Verificación antes de difundir el enlace |
| [ROADMAP-TIENDA](../ROADMAP-TIENDA.md) | Fases 2 y 3: carrito, pagos, panel de administración |
| [mapa-proyecto.canvas](../mapa-proyecto.canvas) | El proyecto como lienzo visual de Obsidian |
| [README](../../README.md) | Portada pública del repositorio |
| [ANALISIS](../../ANALISIS.md) | Diagnóstico del repositorio original |
| [CHANGELOG](../../CHANGELOG.md) | Historial público por versión |

> El antiguo `docs/HISTORIAL.md` se absorbió en [LOG-DE-SESIONES](LOG-DE-SESIONES.md) para no
> mantener dos líneas de tiempo en paralelo.

### Bóveda de Obsidian

El repositorio se abre como bóveda: *Abrir carpeta como bóveda* → la raíz del proyecto. La
configuración de `.obsidian/` **no se versiona** (ver C-10); Obsidian la regenera al abrir. Los
enlaces se escriben en **Markdown normal**, no en formato wiki, para que funcionen igual en Obsidian
y en GitHub.

---

## 10. Cómo se mide el estado

`scripts/estado.py` es el instrumento oficial. **Solo lectura, sin dependencias, 41 comprobaciones
en 6 bloques:**

| Bloque | Qué mide |
| ------ | -------- |
| 1. Procesos y servicios | Herramientas instaladas y declaración de que el proyecto no tiene demonios |
| 2. Conectividad externa | GitHub Pages, registro npm, API de GitHub, WhatsApp y Facebook |
| 3. Frescura | Antigüedad del último commit, del CI y del despliegue, y si lo publicado es el código actual |
| 4. Configuración viva | Marca, WhatsApp, subdirectorio, catálogo, memoria y secretos |
| 5. Repositorio | Cambios pendientes, sincronía con `origin`, archivos grandes y HTML huérfano |
| 6. Hardware y sistema | SO, disco y RAM, marcando como **no aplica** la dependencia de esta máquina |

```bash
npm run estado              # informe completo
python scripts/estado.py --sin-red    # sin comprobaciones de red
python scripts/estado.py --json       # salida legible por máquina
```

Devuelve `0` si no hay ningún ❌ y `1` si hay al menos uno.

**Última medición:** 2026-10-15 13:59 (hora de Honduras) — **37 ✅ · 0 ❌ · 0 ⚠️ · 4 ➖**,
veredicto *todo al 100%*. Ver [E-11](REGISTRO-DE-RESULTADOS.md) y [E-12](REGISTRO-DE-RESULTADOS.md).

> **Un flujo en curso cuenta como ❌.** Si el CI o el despliegue aún no han terminado, el proyecto
> **no** está al 100%: lo no verificable se declara pendiente. Volver a medir cuando terminen.
