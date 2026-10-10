---
titulo: Checklist de lanzamiento
tags:
  - proyecto
  - lanzamiento
  - checklist
actualizado: 2026-10-09
estado: vigente
---

# Checklist de lanzamiento — Artesanías De Honduras

Lista de verificación para publicar el sitio. Marca cada casilla **solo cuando lo hayas
comprobado tú mismo**, no cuando creas que está hecho.

**Cómo usarla:** el bloque 1 es bloqueante. Mientras el número de WhatsApp siga siendo el de
ejemplo, **no se difunde el enlace del sitio a nadie**, ni en redes ni por chat.

Progreso sugerido: bloque 1 → bloque 2 → bloque 3 → bloque 6 (técnico) → bloque 4 (SEO) →
bloque 5 (operación).

---

## 1. Identidad y contacto 🔴 BLOQUEANTE

- [x] **Número de WhatsApp real configurado** (`50499653413`, visible como +504 9965-3413) en
      `src/config/site.ts` → `CONTACTO.whatsapp.numero` (formato `504` + 8 dígitos, sin `+`, sin
      espacios ni guiones).
- [x] **Número visible actualizado** (`CONTACTO.whatsapp.numeroVisible`) con el mismo número,
      escrito como se quiere mostrar al público.
- [ ] **Confirmar que hay alguien disponible para responder ese número** en el horario publicado
      (lunes a sábado, 8:00 a.m. a 6:00 p.m.).
- [ ] Confirmar que el build **ya no imprime el aviso** del número de ejemplo (`npm run dev` o
      `npm run build` y revisar la consola).
- [ ] **Probar el botón flotante de WhatsApp desde un celular:** debe abrir WhatsApp con el
      mensaje general ya escrito.
- [ ] **Probar el botón flotante desde una computadora:** debe abrir WhatsApp Web o la
      aplicación de escritorio con el mensaje ya escrito.
- [ ] **Probar el botón de WhatsApp de una ficha de producto:** el mensaje debe llegar **con el
      nombre de la pieza escrito**.
- [ ] **Probar el botón de WhatsApp de una categoría** del catálogo.
- [ ] Probar los botones **desde un celular con la aplicación de WhatsApp instalada** y **desde
      un celular sin ella** (debe ofrecer la versión web sin romperse).
- [ ] Revisar el horario de atención publicado (`CONTACTO.whatsapp.horario`) y que coincida con
      la realidad.
- [ ] Revisar el mensaje por defecto del chat (`mensajePorDefecto`): que suene natural y diga de
      dónde viene la persona.
- [x] **Página de Facebook publicada** en el pie de página y en la tarjeta de contacto, con el
      enlace también en el marcado estructurado (`sameAs`) para que los buscadores la asocien.
- [x] **Ciudad de la tienda física publicada** (Choloma, Cortés) en `UBICACION` y en el
      `PostalAddress` del marcado estructurado.
- [ ] **`TODO:` Completar la dirección exacta** en `UBICACION.direccion` y el enlace de Google Maps
      en `UBICACION.mapsUrl`. Mientras estén vacíos, la web solo publica la ciudad.
- [ ] **`TODO:` Publicar los horarios de la tienda física** y coordinar quién atiende las visitas
      con cita previa.
- [ ] Decidir si se publica un correo de respaldo (`CONTACTO.correo`). Si no hay, dejarlo vacío.
- [ ] Revisar el nombre, el lema y la descripción de la marca en `SITE` (la descripción es la que
      aparece en Google): que sean correctos y estén bien escritos.
- [ ] **`TODO:` Dirección de la tienda física** y horarios de atención
      (`src/config/site.ts` → `ENVIOS`, modalidad `tienda-fisica`). Hoy dice "por confirmar".
- [ ] Si la tienda física tiene ubicación en mapas, agregar el enlace correspondiente.

---

## 2. Contenido

### Fotografías

- [ ] **`TODO:` Sustituir las ilustraciones SVG por fotografías reales** de cada producto
      (campo `imagen` del JSON y archivo en `public/imagenes/productos/`).
- [ ] Cada fotografía tiene **al menos 1200 píxeles de ancho** y se ve nítida.
- [ ] Las fotos son **de la pieza real** que se vende, no de un catálogo ajeno ni de internet.
- [ ] Cada foto pesa **menos de 300 KB** (comprimirlas antes de subirlas).
- [ ] El fondo y la luz son consistentes entre productos: el catálogo debe verse como un
      conjunto, no como fotos sueltas.
- [ ] Verificar que la imagen social del sitio (`public/imagenes/og-default.png`) se ve bien al
      compartir el enlace en WhatsApp y en redes.
- [ ] Revisar que **no queden imágenes de ejemplo** en el catálogo publicado.

### Textos del catálogo

- [ ] Revisar los 12 productos **uno por uno**:
  - [ ] El **nombre** coincide con lo que se vende.
  - [ ] El **resumen** se entiende solo, sin contexto.
  - [ ] La **descripción** no promete nada que no se cumpla (colores exactos, tiempos, acabados).
  - [ ] Los **materiales** son los reales.
  - [ ] Las **medidas son exactas**, incluido el peso. Verificarlas con cinta métrica y balanza,
        no "a ojo": una medida equivocada genera devoluciones.
  - [ ] Los **cuidados** corresponden al material (barro, textil, plata y madera no se cuidan
        igual).
  - [ ] El **origen** (departamento, municipio, pueblo) es correcto.
  - [ ] El **taller** y el **artesano** existen y **autorizaron aparecer** en el sitio.
  - [ ] El **tiempo de elaboración** es realista.
  - [ ] `personalizable` y `destacado` están como se quiere.
  - [ ] Las **etiquetas** sirven para que la gente encuentre la pieza.
  - [ ] Los **colores** del bloque `colores` corresponden a la pieza.
  - [ ] El **icono** elegido es el más parecido.
- [ ] **Revisar el precio de referencia** de cada pieza aunque no se publique: es la base de la
      respuesta por WhatsApp, y si está desactualizado se cotiza mal.
- [ ] Marcar como `disponible: false` las piezas agotadas, o retirarlas del catálogo.
- [ ] Revisar el **orden** en que aparecen las piezas: las más atractivas primero.
- [ ] Revisar que las piezas marcadas como `destacado` sean las que conviene enseñar en la
      portada.

### Textos generales del sitio

- [ ] Revisar la historia de la marca en `/nosotros`: que sea verdadera y que se pueda sostener.
- [ ] Revisar los textos de la portada.
- [ ] Revisar `/envios-y-pagos`: que describa la forma real de trabajar.
- [ ] **Revisar las preguntas frecuentes una por una.** Son un borrador: ajustar lo que no
      coincida con la operación real (tiempos, zonas de contra entrega, política de daños).
- [ ] Revisar que **no quede ningún texto de ejemplo** ni marcador `TODO:` visible en el sitio
      publicado.
- [ ] Revisar la ortografía y las tildes de todo el sitio (leerlo en voz alta ayuda).
- [ ] Verificar que el trato al cliente sea consistente: el sitio usa "usted" o "tú", pero no
      mezcla los dos.

---

## 3. Legal y confianza

> **Aviso honesto:** los textos legales del sitio son un **punto de partida redactado por el
> equipo de desarrollo. No constituyen asesoría legal.** Revísalos con criterio propio y, si el
> volumen del negocio lo justifica, con un abogado.

- [ ] **Revisar la política de privacidad** (`/privacidad`) y ajustarla a lo que el sitio hace
      realmente.
- [ ] **Revisar los términos y condiciones** (`/terminos`).
- [ ] Confirmar que la política de privacidad dice la verdad sobre los datos: **el sitio de la
      Fase 1 no tiene formularios ni base de datos**, y la conversación ocurre en WhatsApp.
- [ ] Confirmar que **no hay cookies de rastreo ni analítica** instalada. Si más adelante se
      instala, **hay que actualizar la política de privacidad** y avisar al visitante.
- [ ] Definir y publicar la **política de cambios, devoluciones y piezas dañadas**: qué se acepta,
      en qué plazo y quién paga el envío de retorno.
- [ ] Definir qué pasa si una pieza se agota después de confirmado el pedido.
- [ ] Verificar que se cumple lo que promete la política de daños: fotografías del empaque, aviso
      el mismo día de la entrega.
- [ ] Verificar que **ningún dato bancario esté publicado en el sitio**. Los datos de pago se
      comparten solo al confirmar cada pedido.
- [ ] Revisar la titularidad de las fotografías: que sean propias o que haya permiso de quien las
      tomó.
- [ ] Revisar que los artesanos y talleres mencionados **autorizaron** el uso de su nombre.
- [ ] Revisar el archivo `LICENSE`: confirmar la reserva de derechos del contenido y decidir si
      se quiere abrir el código (hoy no hay licencia de código abierto declarada).

---

## 4. SEO y visibilidad

- [ ] Verificar que **la URL canónica de cada página es la correcta** (con
      `/ArteaniaHonduras/`), empezando por la portada.
- [ ] Verificar que el **sitemap se genera** y se puede abrir:
      `https://artesania-honuras.github.io/ArteaniaHonduras/sitemap-index.xml`.
- [ ] Confirmar que **la página 404 no aparece en el sitemap**.
- [ ] Abrir `robots.txt` y confirmar que apunta al sitemap correcto.
- [ ] Verificar que cada página tiene **título y descripción propios**, no repetidos de otra.
- [ ] Verificar que el **título no pasa de unos 60 caracteres** y la descripción de unos 155, para
      que no se corten en Google.
- [ ] **`TODO:` Dar de alta el sitio en Google Search Console** y verificar la propiedad.
- [ ] **Enviar el sitemap manualmente** en Search Console después de la primera publicación.
- [ ] Comprobar cómo se ve el enlace al compartirlo: pegar la URL en WhatsApp y verificar que
      aparezcan título, descripción e imagen.
- [ ] Revisar los datos estructurados (Organization/Store, Product, FAQ, Breadcrumb) con la
      herramienta de resultados enriquecidos de Google.
- [ ] Confirmar que el `lang` del documento es `es-HN`.
- [ ] **`TODO:` Decidir si se adopta dominio propio.** Si sí, actualizar `site` y `base` en
      `astro.config.mjs` **y** en `src/config/site.ts`, y volver a verificar canónicas, sitemap y
      datos estructurados.
- [ ] Si se adopta dominio propio, configurar la redirección desde la URL de GitHub Pages.
- [ ] Revisar las búsquedas por las que debería aparecer el sitio y comprobar que el texto del
      catálogo usa esas palabras (por ejemplo "artesanía hondureña", "barro de Marcala").

---

## 5. Operación (antes de recibir el primer pedido)

### Envíos y costos

- [ ] **`TODO:` Definir los costos de envío por zona.** Hoy el sitio dice que el costo se calcula
      según destino, peso y volumen: hay que tener una tabla real, no estimaciones al momento.
- [ ] Confirmar qué courier o couriers se usan y qué cubren.
- [ ] Definir las **zonas donde sí hay pago contra entrega** y desde qué monto.
- [ ] Definir **quién paga el envío** en caso de devolución o cambio.
- [ ] Confirmar los **tiempos reales de entrega** publicados (1 a 3 días en zona urbana, hasta 5
      en zonas alejadas) con el courier.
- [ ] Revisar los **costos de envío internacional**: peso, aduana y quién paga los aranceles.
- [ ] Definir el **peso y volumen de empaque** de cada pieza, no solo de la pieza sola: el
      courier cobra por el paquete.

### Atención al cliente

- [ ] Definir **cuánto se tarda en responder** un mensaje de WhatsApp y cumplirlo.
- [ ] Definir **quién atiende** y qué pasa cuando esa persona no está disponible.
- [ ] Tener respuestas listas para las consultas repetidas: precio, medidas, envío, tiempo de
      elaboración, personalización.
- [ ] Definir qué se responde cuando una pieza **no está disponible**.
- [ ] Definir cómo se **confirma un pedido**: qué datos se piden (nombre, dirección, teléfono,
      forma de pago).
- [ ] Definir **cómo se registran los pedidos** (libreta, hoja de cálculo o sistema) para no
      perder ninguno.
- [ ] Definir el **proceso de personalización**: qué se puede personalizar, cuánto cuesta y
      cuánto tarda.

### Pagos

- [ ] Confirmar la cuenta bancaria que recibe transferencias y que esté activa.
- [ ] Confirmar la cuenta de Tigo Money y el nombre del titular.
- [ ] Confirmar cómo se procesan los pagos con BAC Credomatic.
- [ ] Definir **hasta cuándo se guarda** un pedido cuando el cliente no completa el pago.
- [ ] Verificar que los datos bancarios **se compartan solo en el chat**, nunca publicados.

### Empaque y logística

- [ ] **`TODO:` Definir el empaque** por tipo de pieza. El barro y el textil no se empacan igual.
- [ ] Conseguir el material de empaque antes de la primera venta.
- [ ] Definir cómo se protegen las piezas frágiles (barro, cerámica).
- [ ] Definir si se incluye una **tarjeta con la historia del taller** y quién la escribe.
- [ ] Definir **quién empaca** y en qué horario.
- [ ] Hacer una **prueba de empaque y envío** con una pieza propia antes de vender: pesarla,
     cotizarla y enviarla a otra ciudad.
- [ ] Definir qué hacer si una pieza se daña en el camino (reposición, ajuste o devolución).

---

## 6. Técnico

- [ ] **`TODO:` Confirmar que `npm run verify` (check + build) termina en verde**, sin errores ni
      advertencias pendientes.
- [ ] Ejecutar `npm run catalogo:validar` y confirmar que los 12 productos y las 3 categorías son
      válidos.
- [ ] Ejecutar `npm run format` y confirmar que no quedan cambios de formato pendientes.
- [ ] Confirmar que **el workflow de CI pasa en `master`**, incluido el paso que falla si el
      número de WhatsApp sigue siendo el de ejemplo.
- [ ] Confirmar que **el despliegue automático publica** la versión nueva en GitHub Pages.
- [ ] Abrir la URL publicada y confirmar que carga la versión más reciente.
- [ ] **Revisar el sitio completo en un celular real** (no solo reduciendo la ventana del
      navegador): portada, catálogo, una ficha de producto y una categoría.
- [ ] Revisar que **nada se desborde horizontalmente** en pantalla pequeña.
- [ ] Revisar que los botones sean cómodos de tocar con el dedo.
- [ ] Revisar el sitio en **al menos dos navegadores** (por ejemplo Chrome y Safari en iPhone).
- [ ] **Comprobar todos los enlaces**: menú, pie de página, tarjetas de producto, categorías,
      migas de pan y enlaces dentro de los textos. Ninguno debe dar 404.
- [ ] Revisar que las imágenes carguen en todas las páginas (incluido el catálogo completo).
- [ ] Revisar que no haya **imágenes rotas** ni textos alternativos vacíos.
- [ ] **Probar con lector de pantalla** (NVDA en Windows o VoiceOver en Mac/iPhone): recorrer la
      portada y una ficha de producto y confirmar que todo se entiende.
- [ ] **Navegar el sitio solo con el teclado** (Tab y Enter): el enlace de salto debe aparecer al
      primer Tab, el foco debe verse siempre y no debe quedar atrapado en ningún lugar.
- [ ] Verificar con el sistema configurado en **"reducir movimiento"** que las animaciones se
      detienen.
- [ ] Revisar el contraste de texto sobre fondo en las páginas principales.
- [ ] Confirmar que la página 404 se muestra bien y ofrece volver al catálogo.
- [ ] Revisar la velocidad de carga en un celular con datos móviles (no en wifi de casa).
- [ ] Confirmar que el sitio funciona **sin JavaScript** en lo esencial: el contenido y los
      enlaces deben leerse igual.
- [ ] Revisar que la consola del navegador **no muestre errores** en ninguna página.
- [ ] Confirmar que el repositorio **no incluye** `node_modules/`, `dist/` ni archivos `.env`.
- [ ] Guardar una **copia de respaldo** del repositorio antes de difundir el sitio.

---

## 7. Después de publicar (primeras semanas)

- [ ] Enviar el enlace a **tres personas de confianza** y pedirles que intenten comprar. Anotar
      dónde se trabaron.
- [ ] Revisar en Search Console si el sitio empieza a recibir impresiones.
- [ ] Contar **cuántas conversaciones de WhatsApp** llegan por semana y de qué pieza hablan.
- [ ] Anotar **qué preguntan más seguido** y agregar esa respuesta a las preguntas frecuentes.
- [ ] Registrar **qué piezas se consultan y no se compran**, y revisar por qué (foto, precio,
      disponibilidad).
- [ ] Revisar si alguien llegó a la página 404 desde un enlace mal construido.
- [ ] Medir el **tiempo real de respuesta** a los mensajes y ajustar el horario publicado.
- [ ] Comparar el **costo de envío cotizado** con el realmente pagado, por zona.
- [ ] Revisar si hace falta una pieza más fotografiada o mejor descrita.
- [ ] Revisar una vez al mes que todos los botones de WhatsApp sigan abriendo el chat correcto.

---

## Resumen: lo que impide publicar hoy

| # | Pendiente | Dónde |
| - | --------- | ----- |
| 1 | 🔴 **Número de WhatsApp real** | `src/config/site.ts` → `CONTACTO.whatsapp.numero` |
| 2 | 🟠 **Dirección de la tienda física** | `src/config/site.ts` → `ENVIOS` (`tienda-fisica`) |
| 3 | 🟠 **Fotografías reales de producto** | Campo `imagen` de cada JSON + `public/imagenes/productos/` |
| 4 | 🟡 **Revisar privacidad y términos** | Páginas `/privacidad` y `/terminos` |
| 5 | ⚪ **Dominio propio (opcional)** | `astro.config.mjs` y `src/config/site.ts` |
| 6 | ⚪ **Alta en Google Search Console** | Fuera del código |
| 7 | ⚪ **Costos de envío por zona** | Fuera del código: operación |

**Los pendientes 1 a 4 están marcados con `TODO:` en el código.** Búscalos con una búsqueda de
texto por `TODO:` para no dejar ninguno atrás.
