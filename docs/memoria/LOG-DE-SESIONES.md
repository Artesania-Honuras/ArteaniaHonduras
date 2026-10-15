---
titulo: Log de sesiones
tipo: bitacora
tags:
  - proyecto
  - memoria
  - sesiones
actualizado: 2026-10-15
estado: vigente
---

# Log de sesiones

Bitácora de lo que se hizo, lo que se rompió, lo que se decidió y lo que quedó abierto.
Formato en [PLANTILLAS](PLANTILLAS.md). Lo más reciente, arriba.

---

### S-06 — 2026-10-15 · Memoria persistente, reglas y checklist de estado

- **Objetivo declarado:** que el proyecto tenga memoria persistente, auditable y dentro del propio repositorio; reglas obligatorias para agentes; y un checklist automatizado de estado.

**Qué se hizo**

Inventario de solo lectura del proyecto y su entorno; luego los tres pasos que el usuario aprobó:
la carpeta de memoria con 5 archivos, `AGENTS.md` con las tres reglas, y `scripts/estado.py` como
instrumento de medición. Se sembró el índice con el estado medido, no con descripciones. Todo
commiteado y subido en la misma sesión.

**Qué se rompió**

- `scripts/estado.py` llamaba a `http_estado()` esperando tres valores cuando devuelve dos. Dos
  veces, en dos funciones distintas.
- El informe fallaba al imprimirse: la consola de Windows (cp1252) no puede representar `➖`. Es la
  **segunda vez** que aparece este problema en el proyecto (ya pasó en `procesar-fotos.py`).
- La detección de `npm` fallaba: en Windows es un `.cmd` y `CreateProcess` no lo ejecuta directo.
- La medición de RAM no funcionaba en Windows porque `os.sysconf` no existe ahí.

**Qué se decidió**

- La carpeta de memoria vive en `docs/memoria/`, con nombres con guiones en vez de espacios
  (URLs y scripts).
- `docs/INICIO.md` pasa a ser puntero del índice; `docs/HISTORIAL.md` se absorbe en este log.
- `.obsidian/` deja de versionarse (C-10): era la causa de que el repositorio apareciera sucio en
  cada apertura de la bóveda.
- El checklist **no inventa latidos**: como el sitio es estático y no tiene demonios, la frescura se
  mide con la antigüedad del último commit, del último CI y del último despliegue.

**Qué quedó abierto**

- [ ] Dirección exacta y horarios de la tienda (`UBICACION` en `src/config/site.ts`)
- [ ] Fotografías reales de producto
- [ ] Revisión legal de privacidad y términos
- [ ] Decidir si el checklist se ejecuta también en CI
- [ ] Fase 2: carrito, checkout y pasarelas de pago

**Evidencia de cierre**

Medición base de [E-11](REGISTRO-DE-RESULTADOS.md): 28 ✅ · 7 ❌ · 1 ⚠️ · 5 ➖, con los 7 ❌
esperados (6 archivos de memoria que se estaban creando y 1 por cambios sin commitear).

---

### S-05 — 2026-10-09 · Registro completo, bóveda de Obsidian y limpieza

- **Objetivo declarado:** registrar todo lo modificado y actualizado, y añadir una bóveda de Obsidian.

**Qué se hizo**

Se reescribió el CHANGELOG (le faltaba más de la mitad de los cambios), se creó el inventario de los
100 archivos, y se montó la bóveda: configuración, nota raíz, lienzo visual, plantilla y propiedades
en las notas. Se eliminó el `index.html` huérfano de la raíz.

**Qué se rompió**

Un subagente que hizo el inventario encontró **dos fallos que yo había pasado por alto**:
`LICENSE` conservaba la marca antigua (mi script de renombrado filtraba por extensión y `LICENSE` no
tiene) y el selector de incidencias apuntaba a `wa.me/NUMERO_POR_CONFIRMAR`. Después, la propia
verificación de enlaces detectó uno roto en la plantilla de notas.

**Qué se decidió**

- Los enlaces de la documentación se escriben en **Markdown normal, no en formato wiki**, para que
  funcionen igual en Obsidian y en GitHub.
- `README`, `CHANGELOG` y `ANALISIS` van sin frontmatter: son la cara pública en GitHub y ahí el
  frontmatter se renderiza como una tabla en la primera línea.

**Qué quedó abierto**

Los mismos pendientes de negocio de S-04, más ninguno técnico nuevo.

**Evidencia de cierre**

33 comprobaciones automáticas: bóveda válida, 8 notas con frontmatter, 0 enlaces wiki, 0 enlaces
rotos, inventario completo. CI y despliegue en verde.

---

### S-04 — 2026-10-09 · Cambio de marca y ubicación

- **Objetivo declarado:** unificar la marca con la página de Facebook y publicar la ciudad de la tienda.

**Qué se hizo**

Renombrado de "Arteanía Honduras" a "Artesanías De Honduras" (48 reemplazos en 29 archivos),
logotipo nuevo, y regeneración de favicon, manifest, robots, las 13 ilustraciones y la tarjeta de
Open Graph. Se publicó Choloma, Cortés en el pie, contacto, envíos y en el `PostalAddress`.

**Qué se rompió**

Nada. El riesgo estaba identificado antes de empezar: la ruta base de GitHub Pages se escribe **sin
tilde** (`ArteaniaHonduras`) y la marca **con tilde**, así que el script pudo distinguirlas. Se
verificó después: 0 rutas dañadas.

**Qué se decidió**

Publicar la ciudad pero **no la dirección exacta**: la ciudad ya es información pública de Facebook,
la dirección no está confirmada y no se inventa. Mientras `UBICACION.direccion` esté vacía, el
marcado estructurado la omite.

**Qué quedó abierto**

- [ ] Dirección exacta y horarios
- [ ] Fotografías reales
- [ ] Revisión legal

**Evidencia de cierre**

16 de 16 comprobaciones sobre el sitio en vivo, incluida la ausencia total del nombre antiguo.

---

### S-03 — 2026-10-09 · Facebook, fotografías y correcciones de imagen

- **Objetivo declarado:** añadir el enlace de la página de Facebook y usar sus fotos. Antes, en un
  turno corto, se había levantado el servidor local de desarrollo.

**Qué se hizo**

Enlace de Facebook en el pie de las 24 páginas, tarjeta en contacto y entrada `sameAs` en el marcado
estructurado. Se creó `npm run fotos:procesar` (redimensiona, elimina EXIF, convierte a WebP y
actualiza los JSON). Se corrigieron dos fallos latentes: las rutas de imagen no pasaban por el
helper de base y la imagen de Open Graph se forzaba al SVG.

**Qué se rompió**

- El script de fotos fallaba al imprimir `✓` en consola Windows (cp1252).
- El archivo numerado `producto-2.jpg` se asignaba como imagen principal solo por orden alfabético.

**Qué se decidió**

- Las fotos no se pueden descargar de Facebook (ver [E-08](REGISTRO-DE-RESULTADOS.md)); el flujo
  queda esperando que se suban a mano a `fotos-originales/`.
- Los originales nunca se borran y `fotos-originales/` está ignorada por git: pueden llevar
  coordenadas GPS en el EXIF.

**Qué quedó abierto**

- [ ] Que el negocio descargue las fotos y las deje en `fotos-originales/`

**Evidencia de cierre**

Prueba del flujo con imágenes sintéticas: 2 de 4 fotos emparejadas, 1 suelta reportada sin tocarla.
Datos de prueba borrados después. CI y despliegue en verde.

---

### S-02 — 2026-10-09 · Auditoría del plugin de DSH y arranque del servidor local

- **Objetivo declarado:** revisar e instalar el plugin `dsh-find-plugin` de GitHub.

**Qué se hizo**

Auditoría completa de seguridad (sin hallazgos), intento real de instalación, y —ante el rechazo por
incompatibilidad— extracción de la API del `app.asar` del runtime para comprobar si el código
serviría. Después se levantó el servidor de desarrollo local a petición del usuario.

**Qué se rompió**

Nada del proyecto. El instalador rechazó el plugin por incompatibilidad declarada de versiones.

**Qué se decidió**

**No instalar.** El plugin declara soporte hasta `dsh-tools 0.1.7` y el runtime instalado es
`0.2.0-rc.2`. La extracción del `app.asar` demostró que la API que usa no cambió, así que habría
funcionado, pero DSH exige aceptar el riesgo explícitamente y el usuario decidió esperar. El perfil
quedó intacto.

**Qué quedó abierto**

- [ ] Volver a intentar cuando el autor publique una versión compatible (ver E-09)

**Evidencia de cierre**

Perfil de DSH sin modificar (`dependencies: {}`, plugin ausente) y servidor local respondiendo 200.

---

### S-01 — 2026-10-09 · Inventario, decisiones y construcción completa del sitio

- **Objetivo declarado:** analizar el repositorio y llevarlo "al siguiente nivel, más encaminado a la tienda".

**Qué se hizo**

Inventario del repositorio (1 commit, 3 archivos, 26 líneas), ronda de preguntas de negocio, y
construcción completa del sitio: Astro 5 + Tailwind 4, 24 páginas, catálogo de 12 productos,
identidad visual, SEO, accesibilidad, documentación, CI/CD y publicación en GitHub Pages.
Esta sesión fue interrumpida por S-02.

**Qué se rompió**

- El clonado falló por el backend TLS de git (`schannel`); se resolvió con `-c http.sslBackend=openssl`.
- pnpm no resolvía el árbol de dependencias ([E-01](REGISTRO-DE-RESULTADOS.md)); se cambió a npm.
- El primer build no compilaba ([E-02](REGISTRO-DE-RESULTADOS.md), [E-03](REGISTRO-DE-RESULTADOS.md), [E-04](REGISTRO-DE-RESULTADOS.md)).
- El primer push dejó el CI en rojo con 3 errores reales de tipos.

**Qué se decidió con el usuario**

| Decisión | Valor elegido |
| -------- | ------------- |
| Arquitectura | Sitio estático con catálogo; **sin carrito** en la fase 1 |
| Estilo | Artesanal cálido y premium |
| Precios | **No publicados**: "Consultar precio" por WhatsApp |
| Contacto | **Solo WhatsApp** |
| Envíos | Honduras, internacionales y tienda física |
| Contenido | Se crea todo desde cero |
| Alcance | Construir y publicar |

**Qué quedó abierto**

La lista de siempre: dirección, fotos reales, revisión legal, dominio propio.

**Evidencia de cierre**

90 archivos, 18 158 líneas, 24 páginas, 12 productos validados, CI y despliegue en verde,
`astro check` con 0 errores.
