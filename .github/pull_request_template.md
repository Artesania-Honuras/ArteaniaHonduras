# Plantilla de pull request — Arteanía Honduras

Gracias por contribuir. Marca lo que ya verificaste; si algo no aplica, explica por qué.

## Qué cambia este pull request

<!-- Describe el cambio en una o dos frases. Si es contenido, di qué producto o página. -->

## Tipo de cambio

- [ ] Contenido (productos, categorías, textos de la marca)
- [ ] Diseño o interfaz
- [ ] Corrección de un error
- [ ] Configuración, herramientas o documentación
- [ ] Otro: <!-- describe -->

## Checklist

### Antes de pedir revisión

- [ ] **El build está en verde:** `npm run verify` (astro check + build) termina sin errores.
- [ ] **El catálogo está validado:** `npm run catalogo:validar` pasa sin errores.
- [ ] **El formato está aplicado:** corrí `npm run format`.
- [ ] **Probado en móvil:** revisé el cambio en un celular, no solo reduciendo la ventana.
- [ ] **Sin datos de contacto de ejemplo:** `CONTACTO.whatsapp.numero` en `src/config/site.ts` no
      es el marcador `50400000000` (o este pull request justifica por qué sigue).

### Según lo que cambie

- [ ] **Capturas de pantalla** adjuntas si el cambio afecta el diseño (antes y después, y una
      vista en móvil).
- [ ] **Enlaces internos construidos con `enlace()`** de `src/lib/rutas.ts`. Ningún `href` o
      `src` interno escrito a mano. (El `base` `/ArteaniaHonduras` lo aplica el helper.)
- [ ] **Sin CDN externas nuevas:** las tipografías y los estilos se autoalojan o se empaquetan.
- [ ] **Contenido nuevo con datos reales:** medidas verificadas, materiales correctos, origen y
      taller confirmados, y autorización de las personas mencionadas.
- [ ] **Fotografías optimizadas** (menos de 300 KB) y con el nombre del `slug` del producto.
- [ ] **Datos de negocio en `src/config/site.ts`:** no escribí teléfonos, pagos ni envíos dentro
      de una página.
- [ ] **Accesibilidad:** probé con teclado (Tab) y el foco se ve; el texto alternativo de las
      imágenes nuevas está escrito.
- [ ] **Sin datos sensibles:** no incluí datos bancarios, claves, tokens ni archivos `.env`.
- [ ] **Documentación actualizada** si el cambio modifica cómo se usa o se edita el proyecto
      (`README.md`, `docs/`).

### Trampas conocidas

- [ ] No escribí **uniones de tipos multilínea dentro del frontmatter de un `.astro`**: Astro las
      elimina mal y esbuild falla con `Unexpected "|"`. Los tipos van en módulos `.ts`.

## Notas para quien revisa

<!-- Dudas, decisiones que tomaste, o algo que quieras que se mire con atención. -->
