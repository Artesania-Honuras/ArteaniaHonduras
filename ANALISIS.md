# Análisis del repositorio Arteanía Honduras

**Documento de análisis técnico y de decisiones**
Repositorio: `Artesania-Honuras/ArteaniaHonduras`
Fecha del análisis: 2026-10-09
Autor del análisis: equipo de desarrollo del sitio

---

## 1. Estado encontrado

Al abrir el repositorio, lo que había era esto:

- **1 solo commit:** `46774af` — *"Initial commit"*.
- **Rama única:** `master` (con `origin/master` como remoto de seguimiento).
- **3 archivos versionados** (26 líneas en total):

| Archivo | Líneas | Contenido |
| ------- | ------ | --------- |
| `index.html` | 22 | Plantilla HTML con Bootstrap **4.3.1** y **jQuery** cargados por CDN. El `<body>` mostraba únicamente un encabezado `<h1>` con el texto **"Hello, world!"**. |
| `README.md` | 2 | Título `# ArteaniaHonduras` y una línea en blanco. |
| `.gitattributes` | 2 | Normalización de finales de línea (`* text=auto`). |

Todo lo demás que hoy compone el proyecto —configuración de Astro, catálogo, componentes,
páginas, estilos, scripts y flujos de trabajo— **no existía**.

### 1.1 El commit original, con precisión

```text
46774af  Initial commit
 .gitattributes |  2 ++
 README.md      |  2 ++
 index.html     | 22 ++++++++++++++++++++++
 3 files changed, 26 insertions(+)
```

El `index.html` era un documento de ejemplo: `<html lang="en">`, título genérico del tipo
"Hello, world!" y sin una sola referencia a la marca, al producto ni al mercado hondureño.

---

## 2. Diagnóstico

**Lo que había no era una tienda: era una plantilla de prueba.** El repositorio se había creado
como ejercicio para comprobar que GitHub Pages servía contenido, no como base de un sitio
comercial. El diagnóstico detallado:

### 2.1 Ausencias estructurales

| Elemento | Estado | Consecuencia |
| -------- | ------ | ------------ |
| `.gitignore` | Ausente | `node_modules/`, `dist/` y archivos de entorno podían terminar versionados en el primer commit con dependencias. |
| Licencia | Ausente | Sin condiciones de uso declaradas para contenido ni código. |
| CI/CD | Ausente | Ninguna verificación automática; cualquier cambio llegaba a producción sin validarse. |
| SEO | Ausente | Sin descripción, canónicas, Open Graph, sitemap ni `robots.txt`. El sitio era invisible e incomprensible para buscadores. |
| `lang` correcto | Ausente | `<html lang="en">` en un sitio que debía hablar español de Honduras. |
| Título real | Ausente | Título de marcador de posición. |
| Contenido de marca | Cero | Ni nombre comercial presentado, ni propuesta de valor, ni historia. |
| Catálogo | Cero | Ningún producto, categoría ni estructura de datos. |
| Imágenes | Cero | Ninguna pieza mostraba cómo se veía. |
| Accesibilidad | Ausente | Ni enlace de salto, ni etiquetas `aria`, ni foco visible gestionado, ni soporte de `prefers-reduced-motion`. |
| Sistema de diseño | Ausente | Sin paleta, tipografías ni tokens; solo el aspecto por defecto de Bootstrap. |

### 2.2 Consecuencia de negocio

Con lo que había en el repositorio **era imposible vender**: no se podía mostrar un producto, no
se podía consultar un precio y no existía ningún canal de contacto. El sitio no cumplía ninguna
función comercial ni de marca.

---

## 3. Activos aprovechables

No todo era deuda. El punto de partida tenía tres ventajas reales:

1. **GitHub Pages ya estaba habilitado.** La infraestructura de publicación funcionaba y era
   gratuita para un sitio estático. Eso eliminó por completo la necesidad de contratar hosting.
2. **Repositorio público y en una organización.** Base adecuada para trabajar con ramas y pull
   requests desde el inicio.
3. **Sin deuda técnica que arrastrar.** Los 3 archivos originales (26 líneas) no imponían nada: no
   había código legado que respetar, ni dependencias internas, ni decisiones previas que
   dificultaran rehacer el proyecto con criterio. Empezar de nuevo era más barato que reparar.

El único elemento que se conservó fue `.gitattributes`, porque la normalización de finales de
línea sigue siendo útil en un proyecto que se edita desde Windows y se publica desde Linux.

---

## 4. Riesgos detectados

| # | Riesgo | Detalle | Mitigación aplicada |
| - | ------ | ------- | ------------------- |
| 1 | **Dependencias por CDN de terceros** | Bootstrap y jQuery se cargaban desde una CDN externa: si la CDN falla, se cae el sitio, y el usuario entrega datos de navegación a un tercero. | Se eliminaron. Todo el CSS y las tipografías se empaquetan o se autoalojan (`@fontsource`); cero CDN externas. |
| 2 | **Versiones obsoletas** | Bootstrap 4.3.1 y la versión de jQuery de la plantilla tenían años sin actualizarse. | Se reemplazó el enfoque completo: Astro 5 + Tailwind CSS 4, gestionados por `package-lock.json`. |
| 3 | **Sin accesibilidad** | Una plantilla de ejemplo no contempla navegación por teclado, lectores de pantalla ni contraste. | Enlace de salto, `aria` en la navegación y los controles, foco visible y respeto de `prefers-reduced-motion`. |
| 4 | **Sin metadatos** | Sin descripción ni datos de negocio, el sitio no aparecía bien en buscadores ni al compartirse en redes. | SEO completo: canónicas, Open Graph, Twitter Card, JSON-LD y sitemap. |
| 5 | **Imposibilidad de vender** | Ningún producto, ningún precio y ningún canal de contacto. | Catálogo validado con Zod y WhatsApp como canal único, integrado en cada ficha y en cada categoría. |
| 6 | **Riesgo de perder el trabajo** | Sin `.gitignore`, el primer `git add .` tras instalar dependencias podía subir `node_modules/` completo. | `.gitignore` con dependencias, salida de build, `.env`, cachés y la carpeta `_revision/`. |
| 7 | **Riesgo de publicar un sitio sin canal real** | El número de WhatsApp es un dato externo al código: es fácil desplegar con el marcador de posición. | Aviso en consola durante el build y un paso de CI que falla en `master` si el número sigue siendo el de ejemplo. |

---

## 5. Decisiones tomadas con el usuario y su justificación

Estas decisiones se acordaron explícitamente con el negocio. No son supuestos del equipo.

### 5.1 Contenido y negocio

| Decisión | Justificación |
| -------- | ------------- |
| **Precios no visibles.** Cada ficha muestra "Consultar precio". | Cada pieza es única y su valor depende del tamaño, los materiales y el tiempo del artesano. Se prefiere dar un precio exacto —con envío incluido en la conversación— antes que publicar una cifra que después haya que corregir. Técnicamente se controla con `FUNCIONES.mostrarPrecios = false`. |
| **WhatsApp como único canal de contacto.** | Es donde el negocio ya atiende. Multiplicar canales sin equipo de atención dispersa los mensajes y hace perder pedidos. El correo y las redes quedan desactivados por configuración, no por olvido. |
| **Envíos a todo Honduras, internacionales y tienda física.** | Cubre los tres escenarios reales de venta: courier nacional, exportación y entrega en mano. |
| **Estilo visual artesanal cálido premium.** | La marca vende objetos hechos a mano; la estética debe transmitir oficio y calidez, no comercio electrónico genérico. Paleta de barro, crema, olivo, añil y ocre, con tipografías con carácter (Fraunces para títulos, Figtree para texto). |
| **Fase 1 sin carrito de compras.** | El volumen actual no justifica la complejidad de un checkout, y buena parte de las ventas necesita conversación previa (medidas, personalización, envío). El sitio debe informar y dirigir al chat, no cobrar. Esto queda aplazado, no descartado: ver `docs/ROADMAP-TIENDA.md`. |

### 5.2 Decisiones técnicas

| Decisión | Justificación |
| -------- | ------------- |
| **Astro 5 como generador de sitio estático.** | El contenido cambia poco y no necesita servidor. Astro entrega HTML sin JavaScript innecesario, admite TypeScript y valida el contenido en el momento del build. |
| **Tailwind CSS 4 con tokens propios.** | Permite construir un sistema de diseño coherente sin CSS disperso, y cambiar la paleta desde un solo archivo. |
| **Contenido en JSON + validación con Zod.** | Quien edita el catálogo no toca plantillas: escribe un JSON y el build le dice exactamente qué campo está mal. Un error de dedo se detecta antes de publicar, no en producción. |
| **Publicación como *project site* de GitHub Pages.** | Es la infraestructura ya disponible y con costo cero. A cambio, hay que respetar el subdirectorio `base` en todos los enlaces (ver `docs/ARQUITECTURA.md`). |
| **npm como gestor de paquetes.** | Ver 5.3: pnpm resultó inviable en este entorno. |
| **`.github/workflows` para CI y despliegue.** | Evita publicar a mano y hace imposible subir un sitio que no compila. |

### 5.3 Qué se descartó y por qué

| Descartado | Motivo real |
| ---------- | ----------- |
| **pnpm como gestor de paquetes** | Se probó y **falló por un problema real de *junctions* en Windows con `LongPathsEnabled=0`**: el almacén de paquetes de pnpm usa enlaces simbólicos y directorios profundos que el sistema no puede resolver con la configuración por defecto. Se adoptó npm, que trabaja con árbol de directorios planos y no requiere ese privilegio. No es una preferencia de estilo. |
| **`sharp` como dependencia** | No se usa el servicio de imágenes de Astro: las ilustraciones se generan como **SVG** con `scripts/generar-imagenes.mjs`, y las fotografías reales se sirven tal cual desde `public/`. Instalar `sharp` habría añadido una dependencia binaria pesada —y otra fuente de fallos de instalación en Windows— sin aportar nada. |
| **Carrito de compras en la Fase 1** | Aplazado a la Fase 2 por decisión de negocio (ver 5.1). No se descartó por dificultad técnica, sino porque el modelo de venta actual es consultivo. |
| **Bootstrap y jQuery** | Reemplazados por completo. Eran la causa del riesgo 1 y no aportaban nada que el nuevo sistema de diseño no resuelva. |
| **CDN externas para fuentes** | Las tipografías se autoalojan con `@fontsource`, para no depender de un tercero ni filtrar la visita del usuario. |

---

## 6. Arquitectura propuesta para la Fase 1

```text
JSON de contenido        Validación             Render                Publicación
──────────────────       ──────────             ──────                ───────────
src/data/
  categorias.json  ─┐
  productos/*.json ─┴─►  src/lib/catalogo.ts  ─►  src/pages/**       ─►  dist/  ─►  GitHub Pages
                          import.meta.glob        src/components/**     (estático)   (project site)
                          + Zod (build falla      src/layouts/Base.astro
                            con mensaje claro)
                                 │
                                 └─► src/lib/rutas.ts (enlace())
                                     aplica el `base` /ArteaniaHonduras en
                                     todos los enlaces internos
```

Principios de la propuesta:

1. **El contenido vive aparte del diseño.** Los productos son datos (`src/data/productos/*.json`);
   las páginas solo los presentan.
2. **Los datos se validan al construir.** Zod revisa cada JSON; un campo faltante detiene el
   build con un mensaje que nombra el archivo y el campo.
3. **Un solo lugar para los datos del negocio.** `src/config/site.ts` reúne contacto, pagos,
   envíos, funciones y preguntas frecuentes. Ninguna página escribe un dato de contacto.
4. **Una sola función para los enlaces.** `enlace()` de `src/lib/rutas.ts` resuelve el problema
   del subdirectorio de GitHub Pages.
5. **Salida estática.** Sin servidor, sin base de datos y sin costo de infraestructura. El
   despliegue ocurre en GitHub Actions al hacer push a `master`.

El detalle completo —flujo de datos, sistema de diseño, SEO y accesibilidad— está en
[docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

---

## 7. Hoja de ruta por fases

### Fase 1 — Sitio de marca y catálogo consultivo ✅ (código terminado, datos pendientes)

**Objetivo:** que la marca exista en internet con un catálogo presentable y un canal de contacto
que funcione.

Entregables: sitio estático con 11 rutas (`/`, `/tienda`, `/tienda/[categoria]`,
`/producto/[slug]`, `/nosotros`, `/envios-y-pagos`, `/preguntas-frecuentes`, `/contacto`,
`/privacidad`, `/terminos` y `/404`), 12 productos y 3 categorías validados con Zod, SEO completo,
accesibilidad y despliegue automático.

**Criterios de aceptación:**

- [ ] `npm run verify` (check + build) termina sin errores.
- [ ] `npm run catalogo:validar` valida los 12 productos y las 3 categorías.
- [ ] `CONTACTO.whatsapp.numero` tiene el número real y el aviso de consola desaparece.
- [ ] Todos los enlaces internos pasan por `enlace()`; ninguno se rompe en producción.
- [ ] Cada producto tiene al menos una fotografía real.
- [ ] El sitio se revisa en móvil y con lector de pantalla.
- [ ] GitHub Pages publica desde GitHub Actions y la URL responde.

### Fase 2 — Tienda transaccional 🟡 (planificada)

**Objetivo:** cobrar en línea sin depender de que alguien responda un chat.

Incluye carrito, checkout, pasarelas de pago locales e internacionales, inventario y cupones.
Detalle, criterios de aceptación, riesgos y esfuerzo relativo en
[docs/ROADMAP-TIENDA.md](docs/ROADMAP-TIENDA.md).

**Criterios de aceptación (resumen):** una compra de prueba completa de principio a fin, con
confirmación al cliente y pedido visible para el negocio; y ningún dato de tarjeta tocando
nuestros servidores.

### Fase 3 — Operación y crecimiento ⚪ (planificada)

**Objetivo:** operar la tienda sin tocar código y crecer con datos.

Incluye catálogo dinámico con base de datos, panel de administración, cuentas de cliente,
correos transaccionales, analítica y remarketing. Detalle en
[docs/ROADMAP-TIENDA.md](docs/ROADMAP-TIENDA.md).

**Criterios de aceptación (resumen):** el negocio publica y retira productos sin ayuda técnica; y
las decisiones de surtido se toman con datos medidos, no con impresiones.

---

## 8. Indicadores a medir

Sin cifras inventadas: estos son los indicadores que el proyecto debería empezar a observar
cuando el sitio se publique. Ninguno tiene meta fijada todavía porque no existe línea base.

| Indicador | Qué responde | Cómo se obtiene (Fase 1) |
| --------- | ------------ | ------------------------ |
| **Clics en los botones de WhatsApp** | ¿El sitio convierte visitas en conversaciones? | Analítica de eventos (pendiente de instalar) o el propio registro de chats del negocio. |
| **Conversaciones iniciadas por semana** | ¿Cuánta demanda real genera el sitio? | Conteo manual en el teléfono del negocio. |
| **Pedidos cerrados y su origen** | ¿Qué canal y qué categoría venden de verdad? | Registro simple (hoja de cálculo) con categoría y origen del pedido. |
| **Piezas más consultadas** | ¿Qué conviene fotografiar mejor y surtir más? | Analítica de páginas de producto, o el conteo de consultas por pieza. |
| **Tiempo de primera respuesta** | ¿Se están perdiendo clientes por demora? | Muestreo manual sobre los chats. |
| **Visitas orgánicas** | ¿El SEO está funcionando? | Google Search Console. |
| **Errores 404 y enlaces rotos** | ¿Hay rutas mal construidas o enlaces a mano? | Informe de cobertura de Search Console. |
| **Costo de envío por zona** | ¿El envío se está cobrando por debajo de su costo? | Comparación entre lo cotizado y lo pagado al courier. |

> **Nota:** los indicadores de tráfico requieren instalar una herramienta de analítica. Esa
> instalación es una decisión pendiente del negocio, porque implica cookies y, por lo tanto,
> actualizar la política de privacidad.

---

## 9. Conclusión

El repositorio pasó de una plantilla de prueba de 26 líneas —sin `.gitignore`, sin licencia, sin
CI, sin SEO, en inglés y sin un solo producto— a un sitio de marca estático, validado,
accesible y desplegado automáticamente. El cambio de fondo no es estético: es que ahora el
contenido está separado del diseño y **validado antes de publicarse**, de modo que el negocio
puede crecer el catálogo sin romper el sitio.

Lo que falta ya no es código: son **datos y contenido del negocio**. El canal de venta quedó
resuelto con el número real de WhatsApp (+504 9965-3413), así que el sitio ya puede cerrar
pedidos. Los pendientes que quedan —dirección de la tienda física, fotografías reales de producto
y revisión legal de las políticas— están listados en
[docs/CHECKLIST-LANZAMIENTO.md](docs/CHECKLIST-LANZAMIENTO.md).
