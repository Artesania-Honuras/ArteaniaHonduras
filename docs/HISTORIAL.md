---
titulo: Historial del proyecto
tipo: cronologia
tags:
  - proyecto
  - historial
  - decisiones
actualizado: 2026-10-09
estado: vigente
---

# Historial del proyecto

Qué se hizo, en qué orden y por qué. Para el registro formal por versión, consulta el
[CHANGELOG](../CHANGELOG.md).

---

## Punto de partida

El repositorio tenía **un solo commit** (`46774af`, *Initial commit*) con 3 archivos y 26 líneas:
un `index.html` con Bootstrap 4.3.1 y jQuery cargados por CDN mostrando "Hello, world!", un
`README.md` de dos líneas y un `.gitattributes`. No era una tienda: era una prueba de que GitHub
Pages servía contenido. El diagnóstico completo está en [ANALISIS](../ANALISIS.md).

Lo aprovechable de ese punto de partida: GitHub Pages ya estaba habilitado, el repositorio era
público y **no había deuda técnica que arrastrar**.

---

## Línea de tiempo

| # | Commit | Qué hizo |
| - | ------ | -------- |
| 1 | `257c68b` | **Construcción del sitio completo.** Astro 5 + Tailwind 4, 24 páginas, catálogo de 12 productos validado con Zod, identidad visual, SEO con datos estructurados, accesibilidad, documentación y CI/CD. |
| 2 | `803b0b3` | **Corrección de los errores que encontró el CI** (`astro check`) y aislamiento de la carpeta de trabajo en `tsconfig.json` para que no analizara artefactos compilados. |
| 3 | `c5428b4` | **Publicación del WhatsApp real** y corrección del enlace de producto que daba 404. Se cierra la PR automática de Astro 5 → 7 y se configura Dependabot. |
| 4 | `1a86cf4` | **Alineación de la documentación** con el número ya publicado. |
| 5 | `778c400` | **Integración de la página de Facebook** y creación del flujo para fotografías reales. Se corrigen las rutas de imagen y la imagen de Open Graph. |
| 6 | `dcee4ff` | **Cambio de marca a "Artesanías De Honduras"** para unificarla con Facebook, y publicación de la ciudad (Choloma, Cortés). |
| 7 | *(este)* | **Eliminación del `index.html` huérfano**, registro completo de cambios y alta de la bóveda de Obsidian. |

---

## Problemas que aparecieron y cómo se resolvieron

Ninguno de estos se detectó "leyendo el código": todos salieron de **ejecutar** el proyecto.

| Problema | Cómo se detectó | Solución |
| -------- | --------------- | -------- |
| El enlace de la pieza dentro del mensaje de WhatsApp daba **404** | Leyendo el HTML ya desplegado en GitHub Pages | Usar `urlAbsoluta()`, que respeta el subdirectorio |
| `astro check` fallaba con 3 errores (tipos duplicados de Vite, `z.prettifyError` de Zod 4 sobre Zod 3, imports sin usar) | Primera ejecución del CI | Corregir los tres; el comando pasa con 0 errores |
| Las rutas de `imagen`/`galeria` no pasaban por el helper de base | Al construir el flujo de fotos | Añadir `rutaImagen()` en `catalogo.ts` |
| La imagen de Open Graph se forzaba al SVG aunque hubiera foto | Al construir el flujo de fotos | Usar la foto principal cuando existe |
| `astro check` agotaba la memoria | Ejecución local | Excluir `_revision`, `dist`, `node_modules` y `.npm-cache` en `tsconfig.json` |
| El script de fotos fallaba al imprimir `✓` en consola Windows (cp1252) | Prueba del propio script | Forzar UTF-8 con reemplazo y usar marcadores ASCII |
| `producto-2.jpg` se volvía imagen principal por orden alfabético | Prueba con nombres reales | La coincidencia exacta con el nombre del producto siempre tiene prioridad |
| Astro **no admite uniones de tipos multilínea** en el frontmatter de un `.astro` | Build fallido con `Unexpected "\|"` | Mover los tipos a `src/lib/iconos.ts` |
| Tailwind 4 **no permite `@apply` de clases propias** | Build fallido | Agrupar selectores en lugar de componer clases |

---

## Decisiones tomadas

| Decisión | Motivo |
| -------- | ------ |
| **Astro** en lugar de HTML a mano o un framework con servidor | Salida estática (compatible con GitHub Pages), contenido separado del diseño y base sólida para la fase transaccional |
| **npm** en lugar de pnpm | pnpm falla en Windows con `LongPathsEnabled=0` por un problema real de *junctions* en su almacén |
| **Sin carrito** en la fase 1 | Decisión del negocio: cerrar la venta por WhatsApp, sin fricción ni pasarela todavía |
| **Sin precios publicados** | Cada pieza se cotiza según tamaño, material y tiempo del artesano; el precio se da por WhatsApp |
| **Un solo canal de contacto** | WhatsApp; no se publican correo ni teléfonos alternativos |
| **Marca unificada a "Artesanías De Honduras"** | Es el nombre que ya tiene audiencia en Facebook; dos nombres distintos confundirían a los clientes |
| **Publicar la ciudad, no la dirección** | Choloma ya es información pública de la página de Facebook; la dirección exacta está pendiente y no se inventa |
| **Fotografías en WebP con EXIF eliminado** | Peso bajo en datos móviles y sin coordenadas GPS publicadas |
| **Documentación también como bóveda de Obsidian** | Permite navegar el proyecto como grafo, con propiedades y lienzo, sin duplicar archivos |

---

## Descartado, y por qué

- **pnpm** — problema real de *junctions* en Windows, ver arriba.
- **`sharp`** — no se usa: el sitio trabaja con SVG y el servicio de imágenes de Astro está
  desactivado.
- **Bootstrap y jQuery por CDN** — dependencias externas que se caen con la CDN y que ya no
  aportaban nada.
- **Astro 7** (PR automática de Dependabot) — salto de versión mayor que rompe el build; exige
  migración planificada.
- **Plugin de DSH `dsh-find-plugin`** — se auditó y el código era limpio, pero declara
  compatibilidad hasta `dsh-tools 0.1.7` y el runtime instalado es `0.2.0-rc.2`. El negocio decidió
  esperar a que el autor publique una versión compatible en lugar de forzar el runtime.

---

## Ver

- [INICIO](INICIO.md) — mapa del proyecto
- [INVENTARIO](INVENTARIO.md) — todos los archivos
- [ARQUITECTURA](ARQUITECTURA.md) — cómo funciona por dentro
- [CHANGELOG](../CHANGELOG.md) — registro oficial de cambios
