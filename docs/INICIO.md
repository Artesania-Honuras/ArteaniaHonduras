---
titulo: Inicio — mapa del proyecto
tipo: mapa
tags:
  - proyecto
  - indice
  - obsidian
actualizado: 2026-10-09
estado: vigente
---

# Artesanías De Honduras — mapa del proyecto

Este repositorio es **a la vez el sitio web y una bóveda de Obsidian**. No hay que copiar nada:
Obsidian puede abrir esta misma carpeta como bóveda y todos los documentos aparecen enlazados
entre sí.

> **Cómo abrirla:** en Obsidian, *Abrir carpeta como bóveda* → selecciona la raíz de este
> repositorio. La configuración ya está en `.obsidian/`, con el código, las dependencias y los
> artefactos de compilación excluidos del grafo para que solo veas documentación.

---

## Estado en una vista

| Dato | Valor |
| --- | --- |
| **Sitio en vivo** | <https://artesania-honuras.github.io/ArteaniaHonduras/> |
| **Marca** | Artesanías De Honduras |
| **Ciudad** | Choloma, Cortés, Honduras |
| **Canal de venta** | WhatsApp [+504 9965-3413](https://wa.me/50499653413) |
| **Página de Facebook** | [Artesanías De Honduras](https://www.facebook.com/people/Artesanias-De-Honduras/100063559657469/) |
| **Tecnología** | Astro 5 · Tailwind CSS 4 · TypeScript · salida estática |
| **Publicación** | GitHub Pages con GitHub Actions |
| **Fase actual** | 1 — sitio de marca y catálogo consultivo, sin carrito |
| **Catálogo** | 12 piezas · 3 categorías · 10 departamentos de origen |

---

## Documentos

### Empezar aquí

- [README](../README.md) — qué es el proyecto, requisitos, comandos y estructura de carpetas.
- [ANALISIS](../ANALISIS.md) — qué había en el repositorio al empezar, diagnóstico y decisiones.
- [INVENTARIO](INVENTARIO.md) — todos los archivos del proyecto y para qué sirve cada uno.
- [HISTORIAL](HISTORIAL.md) — línea de tiempo: qué se hizo, en qué orden y qué problemas aparecieron.

### Trabajar en el sitio

- [GUIA-CONTENIDO](GUIA-CONTENIDO.md) — cómo cambiar el WhatsApp, agregar productos, poner fotos
  reales y activar precios **sin saber programar**.
- [ARQUITECTURA](ARQUITECTURA.md) — cómo está construido por dentro: datos, componentes, rutas,
  SEO y accesibilidad.
- [CHECKLIST-LANZAMIENTO](CHECKLIST-LANZAMIENTO.md) — qué falta antes de difundir el enlace.

### Planificación

- [ROADMAP-TIENDA](ROADMAP-TIENDA.md) — fase 2 y 3: carrito, checkout, Tigo Money, BAC
  Credomatic, panel de administración e inventario.
- [CHANGELOG](../CHANGELOG.md) — registro oficial de todos los cambios, por versión.
- [mapa-proyecto.canvas](mapa-proyecto.canvas) — el mismo contenido en lienzo visual.

---

## Lo que falta

1. **Dirección exacta y horarios** de la tienda física. La ciudad ya está publicada; falta la calle
   y el enlace de Google Maps (`UBICACION` en `src/config/site.ts`).
2. **Fotografías reales.** El catálogo usa ilustraciones SVG generadas. Se sustituyen dejando las
   fotos en `fotos-originales/` y ejecutando `npm run fotos:procesar`.
3. **Revisión legal** de privacidad y términos. Son textos base y no constituyen asesoría legal.
4. **Dominio propio** (opcional).

El detalle accionable está en [CHECKLIST-LANZAMIENTO](CHECKLIST-LANZAMIENTO.md).

---

## Convenciones de esta bóveda

- **Propiedades (frontmatter):** las notas de `docs/` llevan título, etiquetas, fecha de
  actualización y estado. Los archivos de la raíz (`README`, `CHANGELOG`, `ANALISIS`) se dejan sin
  frontmatter a propósito, porque son la cara pública del repositorio en GitHub y ahí el
  frontmatter se renderiza como una tabla en la primera línea.
- **Enlaces:** se usan enlaces Markdown normales, no enlaces wiki, para que **funcionen igual en
  Obsidian y en GitHub**. Obsidian está configurado con `useMarkdownLinks: true`, de modo que las
  notas nuevas que crees desde aquí también serán así.
- **Nombres de archivo:** en mayúsculas y con guiones para los documentos (`GUIA-CONTENIDO.md`),
  porque el nombre es también la URL en GitHub.
- **Notas nuevas:** usa la plantilla de [plantillas/PLANTILLA-NOTA](plantillas/PLANTILLA-NOTA.md).

## Ver también

- [HISTORIAL](HISTORIAL.md) · [INVENTARIO](INVENTARIO.md) · [ARQUITECTURA](ARQUITECTURA.md)
- [mapa-proyecto.canvas](mapa-proyecto.canvas) — la misma información como lienzo visual
