# Guía de contenido — Arteanía Honduras

**Para quien va a editar el sitio sin saber programar.**

Esta guía explica, paso a paso, cómo cambiar el número de WhatsApp, cómo agregar un producto,
cómo poner fotografías reales y cómo activar los precios. No hace falta saber código: solo editar
archivos de texto y escribir bien los datos.

Todo el contenido del sitio vive en **dos carpetas**:

| Quiero cambiar… | Archivo |
| ---------------- | ------- |
| Teléfono, pagos, envíos, preguntas frecuentes, textos de la marca | `src/config/site.ts` |
| Un producto (nombre, descripción, medidas…) | `src/data/productos/` (un archivo por producto) |
| Las categorías del catálogo | `src/data/categorias.json` |
| Colores y letras del sitio | `src/styles/global.css` |

> **Antes de empezar:** si no tienes un editor de texto, instala
> [Visual Studio Code](https://code.visualstudio.com/), que es gratuito. Los archivos `.json` y
> `.ts` se editan como cualquier documento de texto, pero **hay que respetar las comas, las
> comillas y las llaves**: son parte del formato.

---

## Regla de oro antes de guardar

Cuando termines de editar, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm run catalogo:validar
```

Ese comando revisa que todo esté bien escrito **sin tardar** y te dice exactamente qué está mal.
Si no aparece ningún error, tu cambio está correcto.

Cuando quieras ver el sitio en tu computadora:

```bash
npm run dev
```

Y abre en el navegador `http://localhost:4321/ArteaniaHonduras/`.

---

## 1. Cambiar el número de WhatsApp ⚠️ (el cambio más importante)

**El sitio ya tiene el número real del negocio: `50499653413` (se muestra como +504 9965-3413).**
Es el único canal de venta del sitio, así que si algún día cambia, este es el primer dato que hay
que actualizar.

> **Cómo saber si está mal configurado:** si el número queda con un valor de ejemplo, el build
> imprime un aviso por consola y el workflow de CI **falla en la rama `master`** a propósito, para
> que nunca se publique una tienda cuyo único canal de contacto no existe.

### Paso a paso

1. Abre el archivo `src/config/site.ts`.
2. Busca el bloque que empieza con `export const CONTACTO`.
3. Verás estas dos líneas (hoy con el número real):

```ts
    numero: '50499653413',
    /** Cómo se muestra el número en el sitio. */
    numeroVisible: '+504 9965-3413',
```

Reemplázalas por el número nuevo, en los dos formatos:

```ts
    numero: '50488887777',
    /** Cómo se muestra el número en el sitio. */
    numeroVisible: '+504 8888-7777',
```

### Cómo se escribe cada campo

| Campo | Regla | Ejemplo correcto | Ejemplo incorrecto |
| ----- | ----- | ---------------- | ------------------ |
| `numero` | Código de país `504` + los 8 dígitos, **todo junto, sin `+`, sin espacios, sin guiones** | `50488887777` | `+504 8888-7777` |
| `numeroVisible` | Como quieres que se lea en la pantalla | `+504 8888-7777` | `50488887777` |

### Cómo comprobar que quedó bien

1. Ejecuta `npm run dev` y abre el sitio.
2. Toca cualquier botón de WhatsApp.
3. Debe abrirse WhatsApp **con tu número y un mensaje ya escrito**. Si abre un chat vacío, un
   número equivocado o no abre nada, el `numero` está mal escrito.

> **Consejo:** pruébalo desde el celular **y** desde una computadora. En la computadora WhatsApp
> puede abrirse en la versión web y pedirte iniciar sesión: eso es normal, no es un error del
> sitio.

### Otros ajustes del mismo bloque

- `mensajePorDefecto`: lo que aparece escrito cuando alguien abre el chat general. Cámbialo si
  quieres otro saludo.
- `horario`: tu horario de atención, tal como se muestra en el sitio.
- `correo`: si algún día quieres mostrar un correo, escríbelo entre comillas (`'ventas@…'`).
  **Déjalo vacío si no lo tienes**: el sitio no lo muestra mientras esté en `''`.
- `redes` (`instagram`, `facebook`, `tiktok`): pega la dirección completa de cada red. Si dejas
  alguna vacía, esa red no aparece en el sitio.

---

## 2. Agregar un producto

Cada producto es **un archivo** dentro de `src/data/productos/`. El nombre del archivo no importa
mucho, pero se acostumbra usar el mismo texto que el campo `slug`.

### Paso a paso

1. Entra a `src/data/productos/` y abre cualquier archivo, por ejemplo
   `vasija-barro-lenca-marcala.json`.
2. **Cópialo y pégalo en la misma carpeta** (así no te equivocas con las comas ni las llaves).
3. Renombra la copia con el nombre de tu producto, por ejemplo `jarrón-barro-ojos-de-agua.json`.
   (Evita tildes, ñ y espacios en el **nombre del archivo**: usa guiones.)
4. Abre la copia y reemplaza **todos** los datos por los de tu producto.
5. Guarda y ejecuta `npm run catalogo:validar`.

**No hay que registrar el producto en ningún otro lugar.** El sitio lo detecta solo: aparece en
el catálogo, en su categoría y con su propia página.

### Los campos, uno por uno

Este es el esquema real del catálogo. Los nombres de los campos **no se cambian**: van siempre en
inglés y en minúsculas, tal como están aquí.

| # | Campo | Obligatorio | Qué se escribe |
| - | ----- | ----------- | -------------- |
| 1 | `slug` | Sí | Identificador único en minúsculas, sin tildes ni espacios. Ej.: `"jarrón-barro-ojos-de-agua"` → se escribe `"jarron-barro-ojos-de-agua"`. **No puede repetirse** en otro producto. |
| 2 | `nombre` | Sí | Nombre del producto como se muestra al público. Ej.: `"Vasija de barro lenca"`. |
| 3 | `categoria` | Sí | **Debe ser exactamente uno de los `slug` de las categorías**: `"artesanias"`, `"textiles"` o `"joyeria"`. Si escribes una categoría que no existe, el build falla. |
| 4 | `subtitulo` | Sí | Una frase corta, de 5 a 90 caracteres. Ej.: `"Barro cocido a mano con herencia lenca"`. |
| 5 | `resumen` | Sí | Dos o tres líneas para las tarjetas del catálogo, de 20 a 220 caracteres. |
| 6 | `descripcion` | Sí | **Lista de párrafos.** Cada párrafo entre comillas, separado por comas, dentro de `[ ]`. Cada párrafo debe tener al menos 40 caracteres. Ver el ejemplo más abajo. |
| 7 | `materiales` | Sí | Lista de materiales. Ej.: `["Barro rojo local", "Arena fina de río"]`. Mínimo uno. |
| 8 | `medidas` | Sí | Medidas y peso. Ej.: `"28 x 20 x 20 cm; 1.6 kg aproximadamente"`. |
| 9 | `cuidados` | Sí | Lista de recomendaciones de cuidado. Mínimo una. |
| 10 | `origen` | Sí | Bloque con `departamento` y `municipio` (obligatorios) y `pueblo` (puede quedar `""`). |
| 11 | `taller` | Sí | Bloque con `nombre`, `artesano` e `historia` (una o dos frases sobre el taller). |
| 12 | `tiempoElaboracion` | Sí | Cuánto tarda en elaborarse. Ej.: `"5 a 7 días"`. Si ya está hecha, escribe algo como `"Disponible para envío inmediato"`. |
| 13 | `personalizable` | Sí | `true` si se puede personalizar (color, tamaño, grabado) o `false` si no. **Sin comillas.** |
| 14 | `destacado` | Sí | `true` si quieres que aparezca en la portada o `false` si no. **Sin comillas.** |
| 15 | `etiquetas` | Sí | Lista de palabras clave para clasificar. Ej.: `["alfarería lenca", "barro cocido"]`. Mínimo una. |
| 16 | `colores` | Sí | Lista de colores que tiene la pieza, **en código hexadecimal de 6 dígitos entre comillas** y precedido de `#`. De 1 a 4. Ej.: `["#B4552D", "#8A3B1E"]`. |
| 17 | `icono` | Sí | Uno de los diez iconos disponibles (ver la lista abajo). |

### Campos opcionales (se pueden omitir)

| Campo | Para qué sirve |
| ----- | -------------- |
| `imagen` | La **fotografía real** del producto. Ver el paso 4 más abajo. Si se omite, el sitio usa la ilustración generada. |
| `galeria` | Lista de fotografías adicionales. Ej.: `["/imagenes/productos/jarron-1.jpg", "/imagenes/productos/jarron-2.jpg"]`. |
| `precio` | El precio en lempiras, **solo como número, sin `L` y sin comas**. Ej.: `850`. Solo se muestra si los precios están activados (paso 5). |
| `disponible` | `true` (por defecto) o `false` si está agotado. |
| `orden` | Un número para decidir el orden en que aparece (menor número = primero). Por defecto 50. Ej.: `10` para que salga de primero. |

### Lista de iconos disponibles

Se escribe uno solo, entre comillas:

```text
"vasija"   "canasta"   "tejido"   "hamaca"   "bolso"
"collar"   "aretes"    "pulsera"  "madera"   "muneca"
```

Si tu producto no encaja en ninguno, usa el más parecido. La lista no se puede ampliar sin ayuda
técnica.

### Ejemplo completo, listo para copiar

```json
{
  "slug": "jarron-barro-ojos-de-agua",
  "nombre": "Jarrón de barro Ojos de Agua",
  "categoria": "artesanias",
  "subtitulo": "Barro rojo cocido a leña en el occidente del país",
  "resumen": "Jarrón alto de barro cocido, con vertedera trabajada a mano y acabado natural sin barniz industrial.",
  "descripcion": [
    "Este jarrón nace del mismo barro rojo que se trabaja desde hace generaciones en el occidente de Honduras. La pieza se levanta a mano, sin molde, y se alisa con una concha de río antes de entrar al horno de leña.",
    "Su forma alta y su boca ancha lo hacen útil para flores de tallo largo, varas secas o simplemente como pieza de decoración sobre una mesa o una repisa."
  ],
  "materiales": [
    "Barro rojo local",
    "Arena fina de río"
  ],
  "medidas": "34 x 16 x 16 cm; 2.1 kg aproximadamente",
  "cuidados": [
    "Limpiar con paño seco o ligeramente húmedo",
    "No dejarlo en remojo ni usarlo en microondas",
    "Evitar golpes y cambios bruscos de temperatura"
  ],
  "origen": {
    "departamento": "La Paz",
    "municipio": "Marcala",
    "pueblo": ""
  },
  "taller": {
    "nombre": "Taller Barro de Marcala",
    "artesano": "Doña Marta Hernández",
    "historia": "Taller familiar donde tres generaciones de alfareras comparten el mismo horno de leña."
  },
  "tiempoElaboracion": "5 a 7 días",
  "personalizable": true,
  "destacado": false,
  "etiquetas": [
    "alfarería lenca",
    "barro cocido",
    "hecho a mano"
  ],
  "colores": [
    "#B4552D",
    "#8A3B1E"
  ],
  "icono": "vasija"
}
```

### Errores que se comen más fácil

| Error | Síntoma |
| ----- | ------- |
| Falta una coma entre dos campos | El archivo no se puede leer. Nada funciona. |
| Coma de sobra después del **último** campo | Error de lectura. La última línea de cada bloque **no lleva coma**. |
| Comillas dobles dentro de un texto | Rompe el archivo. Usa comillas simples dentro: `"una pieza de 20'' de alto"`. |
| Tildes o `ñ` en el `slug` o en el nombre del archivo | El build lo rechaza. |
| `categoria` con una palabra que no existe | El build avisa que la categoría no existe. |
| Dos productos con el mismo `slug` | El build avisa que el slug está duplicado. |
| `true` / `false` escritos como texto (`"true"`) | El build lo rechaza: van **sin comillas**. |

---

## 3. Agregar o cambiar una categoría

Las categorías son los tres grupos del catálogo. Están en `src/data/categorias.json`, que es una
**lista** entre `[ ]`.

Para agregar una categoría, añade un bloque nuevo separado por coma:

```json
  {
    "slug": "hogar",
    "nombre": "Hogar y decoración",
    "descripcion": "Piezas utilitarias y decorativas para la casa, hechas a mano en talleres hondureños y pensadas para el uso diario.",
    "icono": "canasta",
    "color": "#6E7C4B"
  }
```

| Campo | Regla |
| ----- | ----- |
| `slug` | Minúsculas, sin tildes ni espacios. Es lo que se escribe en el campo `categoria` de cada producto. |
| `nombre` | Como se muestra en el menú y en las tarjetas. |
| `descripcion` | Al menos 10 caracteres. |
| `icono` | Uno de los diez iconos de la lista del paso 2. |
| `color` | Código hexadecimal de 6 dígitos con `#`. Ej.: `"#6E7C4B"`. Es el color que identifica la categoría. |

Después de crearla, **los productos que la usen deben tener ese `slug` exacto** en su campo
`categoria`. La página `/tienda/hogar` se crea sola.

> **Cuidado al renombrar un `slug` existente:** si cambias `"textiles"` por otra palabra, todos
> los productos que decían `"textiles"` quedan con una categoría inexistente y el build falla
> hasta que los actualices uno por uno. Es más seguro no cambiar los `slug` existentes.

---

## 4. Poner fotografías reales de producto

Hoy el catálogo muestra **ilustraciones SVG** generadas automáticamente. Sirven para maquetar,
pero para vender hacen falta fotografías de verdad.

Hay dos caminos: el **automático** (recomendado, un solo comando) y el **manual** (control total
sobre cada archivo).

### 4.1 Camino automático (recomendado)

**Paso 1 — Guarda las fotos.** Crea la carpeta `fotos-originales/` en la raíz del proyecto y mete
ahí todas las fotos que quieras usar. Pueden ser `.jpg`, `.png`, `.webp`, `.bmp` o `.tiff`, del
tamaño que salgan de tu teléfono o de tu cámara.

**Paso 2 — Nombra los archivos.** El nombre es lo que conecta la foto con la pieza. Vale el `slug`
o el nombre comercial, con o sin tildes, mayúsculas o espacios:

| Nombre del archivo | Qué hace |
| ------------------ | -------- |
| `vasija-barro-lenca-marcala.jpg` | Imagen **principal** de esa pieza |
| `Vasija de barro lenca.jpg` | Lo mismo, usando el nombre comercial |
| `vasija-barro-lenca-marcala-2.jpg` | **Segunda** foto (entra a la galería) |
| `vasija barro lenca 3.png` | **Tercera** foto |

Una foto sin número siempre gana como principal; las numeradas van a la galería en orden. Así
`producto-2.jpg` nunca desplaza a `producto.jpg` solo por orden alfabético.

**Paso 3 — Ejecuta el procesador.**

```sh
npm run fotos:procesar
```

El script hace todo lo demás:

- redimensiona cada foto a **1400 px** de lado mayor,
- le quita los metadatos EXIF (incluidas las **coordenadas GPS**, que no queremos publicar),
- la convierte a **WebP**, que pesa mucho menos que un JPG,
- la publica en `public/imagenes/fotos/`,
- y **actualiza solo** el JSON del producto con los campos `imagen` y `galeria`.

Al terminar te dice qué foto quedó en qué pieza y **qué archivos no logró asignar** (esos no se
tocan: solo les cambias el nombre y vuelves a ejecutarlo). Los originales nunca se borran.

Para cambiar el tamaño o la calidad: `python scripts/procesar-fotos.py --lado 2000 --calidad 88`.

Requiere Python con Pillow (`pip install Pillow`). Si no lo tienes, usa el camino manual.

### 4.2 Camino manual

1. Prepara la fotografía: horizontal o cuadrada, **al menos 1200 píxeles de ancho**, fondo limpio
   y buena luz. Formato `.jpg` o `.webp` (más liviano).
2. Nómbrala con el `slug` del producto: `vasija-barro-lenca-marcala.jpg`.
3. Cópiala a `public/imagenes/productos/`. **Debe ser esa carpeta exacta**, no `src/`.
4. Agrega el campo `imagen` al JSON del producto:

```json
  "icono": "vasija",
  "imagen": "/imagenes/productos/vasija-barro-lenca-marcala.jpg"
```

### Cómo se escribe la ruta

| Parte | Regla |
| ----- | ----- |
| Empieza con `/` | Sí, siempre. |
| **NO** escribas `/ArteaniaHonduras/` | El sitio lo agrega solo. Si lo escribes, la imagen no carga. |
| Nombre del archivo | Igual al que copiaste, con su extensión. |

### Si quieres varias fotos

Usa `galeria`. La primera imagen de la ficha es `imagen` (o la ilustración si no hay foto):

```json
  "imagen": "/imagenes/fotos/vasija-barro-lenca-marcala.webp",
  "galeria": [
    "/imagenes/fotos/vasija-barro-lenca-marcala-2.webp",
    "/imagenes/fotos/vasija-barro-lenca-marcala-3.webp"
  ]
```

> **No borres los SVG** de `public/imagenes/productos/`. Dejan de usarse solos, en cuanto el campo
> `imagen` existe, y sirven de respaldo para las piezas que aún no tienen foto.

> **Recomendación de peso:** no dejes que una fotografía pase de 300 KB. El procesador ya se
> encarga de esto, pero si subes fotos a mano, comprímelas antes: un catálogo con fotos pesadas se
> siente lento en datos móviles.

> **Sobre las fotos de Facebook:** no se pueden descargar automáticamente; la página exige iniciar
> sesión. Bájalas tú desde tu propia página (o desde tu teléfono) y déjalas en `fotos-originales/`.

---

## 5. Activar los precios

Hoy el catálogo dice **"Consultar precio"** y el valor se da por WhatsApp. Eso se controla con una
sola línea.

1. Abre `src/config/site.ts`.
2. Busca `export const FUNCIONES`.
3. Cambia:

```ts
export const FUNCIONES = {
  mostrarPrecios: false,
```

por:

```ts
export const FUNCIONES = {
  mostrarPrecios: true,
```

4. **Ahora hay que llenar el precio de cada producto.** En cada JSON de `src/data/productos/`
   agrega el campo `precio`:

```json
  "icono": "vasija",
  "precio": 850
```

**El precio va como número puro**: sin `L`, sin comillas, sin puntos ni comas de miles. `850` es
correcto; `"L 850.00"` y `"850"` no lo son.

Los productos a los que les falte el precio se mostrarán de forma incompleta o sin precio, así
que conviene revisar todo el catálogo antes de activar esta opción.

> Si más adelante quieres volver a "Consultar precio", pon `mostrarPrecios: false` de nuevo. Los
> precios que hayas escrito se conservan y quedan ocultos.

---

## 6. Cambiar textos de la marca, pagos, envíos y preguntas frecuentes

Todo está en `src/config/site.ts`:

| Quiero cambiar… | Bloque |
| --------------- | ------ |
| Nombre, lema, descripción para Google | `SITE` |
| Teléfono, horario, redes | `CONTACTO` |
| Precios visibles, carrito, buscador | `FUNCIONES` |
| Formas de pago (transferencia, contra entrega, Tigo Money, BAC) | `METODOS_PAGO` |
| Envíos nacionales, internacionales y tienda física | `ENVIOS` |
| Preguntas frecuentes | `PREGUNTAS_FRECUENTES` |

**Reglas al editar este archivo:**

- Los textos van **entre comillas simples** (`'así'`).
- Cada elemento termina en coma, **menos el último** de cada bloque.
- Si un texto contiene un apóstrofo, escríbelo con barra invertida: `'la pieza d\'artesano'`.
- No borres las llaves `{ }`, los corchetes `[ ]` ni las palabras `export const`.

### Ejemplo: cambiar un método de pago

```ts
  {
    id: 'tigo-money',
    nombre: 'Tigo Money',
    descripcion: 'Billetera móvil ideal para montos pequeños y medianos. Te indicamos el número y el nombre de la cuenta al momento de confirmar.',
    icono: 'telefono',
    destacado: false,
  },
```

- `nombre`: como se lee en el sitio.
- `descripcion`: la explicación para el cliente.
- `icono`: uno de los iconos del sitio (`chat`, `banco`, `camion`, `telefono`, `tarjeta`, `globo`,
  `tienda`).
- `destacado`: `true` para resaltarlo entre los primeros.

### Pendientes en este archivo

- **Dirección de la tienda física** y horarios: están en la modalidad `tienda-fisica` del bloque
  `ENVIOS`, hoy con el texto "Dirección y horarios por confirmar". `TODO:` reemplazar por la
  dirección real.
- **Preguntas frecuentes:** están redactadas como borrador. `TODO:` leerlas completas y ajustar
  lo que no coincida con la forma real de trabajar del negocio.

---

## 7. Cambiar colores y letras

Los colores del sitio están en `src/styles/global.css`, en el bloque `@theme`. Los más útiles:

```css
  --color-barro-500: #b4522c;      /* Color principal de la marca */
  --color-crema-100: #faf4ec;      /* Fondo general del sitio */
  --color-ocre-500: #c8933a;       /* Detalles y filetes */
  --color-whatsapp-500: #25d366;   /* Verde de los botones de contacto */
```

Si cambias el color principal, busca también `--color-primario` en el mismo bloque y apúntalo al
tono nuevo. Y avisa a quien te apoye con la parte técnica: hay otros dos lugares donde el color
de la marca está escrito como valor fijo (el `theme-color` del navegador y el manifest).

**Recomendación:** cambia los colores con el acompañamiento de alguien técnico. Un contraste
insuficiente entre texto y fondo vuelve el sitio difícil de leer, y hay que revisarlo después.

---

## 8. Qué hacer si el build falla

Cuando ejecutes `npm run catalogo:validar` (o `npm run build`) y algo esté mal, verás un mensaje
en rojo o en inglés. **Es bueno que falle**: significa que el error se detecta aquí y no en la
computadora de un cliente.

### Cómo leer el mensaje

Casi siempre trae tres datos útiles:

1. **El archivo culpable:** por ejemplo `src/data/productos/mi-producto.json`.
2. **El campo exacto:** por ejemplo `medidas` o `colores`.
3. **El motivo:** por ejemplo "expected string, received number" (esperaba texto, recibió número).

### Traducción de los avisos más comunes

| Mensaje (en inglés) | Qué significa | Cómo se arregla |
| ------------------- | ------------- | --------------- |
| `Expected string, received number` | Escribiste un número donde va texto | Ponlo entre comillas: `"850"`, o quita las comillas si el campo pide número |
| `Expected boolean, received string` | Escribiste `"true"` en vez de `true` | Quita las comillas |
| `String must contain at least N character(s)` | El texto es demasiado corto | Escribe un texto más largo (el mensaje dice cuántos caracteres faltan) |
| `String must contain at most N character(s)` | El texto es demasiado largo | Acórtalo |
| `Invalid` en `slug` | El slug tiene mayúsculas, tildes o espacios | Escribe todo en minúsculas, con guiones y sin tildes |
| `Slug de producto duplicado` | Dos productos usan el mismo `slug` | Cambia el slug de uno de los dos |
| `usa la categoría "X", que no existe` | El campo `categoria` no coincide con ninguna categoría | Escribe uno de los `slug` de `categorias.json` |
| `Unexpected token` / error al leer JSON | Falta una coma, sobra una coma o hay una comilla mal puesta | Compara tu archivo con el ejemplo del paso 2 |
| `categorias.json no es válido` | El error está en las categorías | Revisa `src/data/categorias.json` |

### Los tres arreglos que resuelven casi todo

1. **Revisa las comas.** Cada campo termina en coma, **excepto el último** de cada bloque.
2. **Revisa las comillas.** Todo texto va entre comillas dobles `" "`. Los números y los
   `true`/`false` van sin comillas.
3. **Copia de un producto que ya funciona** y cambia solo los valores. Es la forma más segura.

### Si nada de esto resuelve

1. Guarda el mensaje de error completo (una captura de pantalla sirve).
2. Anota qué archivo estabas editando.
3. **Busca en [docs/CHECKLIST-LANZAMIENTO.md](CHECKLIST-LANZAMIENTO.md)** el estado técnico del
   proyecto.
4. Si el error menciona `Unexpected "|"`, **no es tu culpa**: es una limitación conocida de Astro
   con las uniones de tipos escritas dentro de un archivo `.astro`. No se arregla editando
   contenido; necesita apoyo técnico.

### Cómo deshacer un cambio

Si el proyecto se trabaja con Git, cualquier cambio se puede revertir:

```bash
git status                 # ver qué archivos cambiaste
git checkout -- ruta/al/archivo   # descartar los cambios de un archivo
```

Si no manejas Git, guarda una copia del archivo **antes** de editarlo. Es la red de seguridad más
simple y no falla nunca.

---

## 9. Resumen de rutas rápidas

```bash
npm run dev                # ver el sitio mientras editas
npm run catalogo:validar   # revisar los datos del catálogo (rápido)
npm run format             # ordenar el formato de los archivos
npm run verify             # revisión completa antes de publicar
```

| Quiero… | Archivo |
| ------- | ------- |
| Poner mi WhatsApp real | `src/config/site.ts` → `CONTACTO` |
| Agregar un producto | Copiar un archivo en `src/data/productos/` |
| Poner una foto real | `public/imagenes/productos/` + campo `imagen` |
| Agregar una categoría | `src/data/categorias.json` |
| Activar precios | `src/config/site.ts` → `FUNCIONES.mostrarPrecios` |
| Poner la dirección de la tienda | `src/config/site.ts` → `ENVIOS` |
| Cambiar colores | `src/styles/global.css` |
