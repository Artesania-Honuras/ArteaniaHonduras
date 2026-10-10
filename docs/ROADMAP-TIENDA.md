---
titulo: Hoja de ruta de la tienda
tags:
  - proyecto
  - roadmap
  - tienda
actualizado: 2026-10-09
estado: vigente
---

# Hoja de ruta de la tienda — Artesanías De Honduras

**De sitio de catálogo a tienda en línea.**

Documento de planificación. La **Fase 1** (sitio de marca y catálogo consultivo) ya está
construida y descrita en [ARQUITECTURA.md](ARQUITECTURA.md). Este documento planifica lo que
viene después: la Fase 2 (vender en línea) y la Fase 3 (operar y crecer).

> **Sobre las estimaciones:** todo el esfuerzo se expresa en **unidades relativas** (días de
> trabajo de una persona, o "S/M/L"), nunca en dinero ni en fechas de calendario. No se inventan
> precios, plazos de entrega ni comisiones: los costos reales de cada pasarela de pago, servidor
> o servicio deben cotizarse con cada proveedor en el momento de decidir.

---

## 0. Punto de partida y por qué el salto no es trivial

Hoy el sitio es **estático**: un conjunto de archivos HTML que GitHub Pages entrega tal cual. Eso
tiene tres consecuencias que se pierden al convertirse en tienda:

| Tiene hoy (estático) | Necesita una tienda (transaccional) |
| -------------------- | ----------------------------------- |
| Costo de infraestructura: ninguno | Servidor o plataforma con costo recurrente |
| Sin base de datos: el catálogo es un archivo | Base de datos de productos, pedidos y clientes |
| Sin estado: cada visita es independiente | Sesión: carrito, cupones, cuenta de cliente |
| Sin claves ni secretos | Credenciales de pago y datos personales que proteger |
| Publicar = subir archivos | Publicar = desplegar una aplicación con migraciones |
| Falla = no carga una página | Falla = **se pierde un pedido o un pago** |

**El cambio de fondo es de responsabilidad, no de tecnología.** Un sitio estático que falla
molesta; una tienda que falla pierde dinero y puede exponer datos de tarjetas. Eso obliga a
pruebas, respaldos, monitoreo y una política clara de datos personales.

### El modelo de negocio también cambia

Hoy: el cliente pregunta, se cotiza de forma individual y se cierra por WhatsApp. El precio
depende del envío y de la personalización.

Mañana: el cliente paga solo, sin que nadie hable con él. Eso **obliga a tener precios fijos**,
envíos calculables sin intervención y una política de devoluciones escrita. Es la decisión de
negocio más grande de todo este documento, y va antes que cualquier decisión técnica.

`TODO:` decisión del negocio: ¿se adoptan precios públicos fijos? Sin eso, la Fase 2 no puede
cobrar en línea de forma automática (solo podría seguir cerrándose por WhatsApp).

---

## 1. Fase 2 — Tienda transaccional

**Objetivo:** que una persona pueda armar su pedido y pagarlo **sin que nadie tenga que
responderle un mensaje primero**, incluyendo los métodos de pago que la marca ya usa hoy.

### 1.1 Entregables

#### Carrito

- Agregar una pieza al carrito desde la tarjeta del catálogo y desde la ficha de producto.
- Ver y editar el carrito: cantidades, retirar piezas, subtotal.
- Carrito persistente: sobrevive a recargar la página y cerrar el navegador.
- Validación de **disponibilidad** al agregar y al pagar (no vender lo que ya no existe).
- Advertencia explícita de que las piezas artesanales **varían** de la foto y de que las medidas
  pueden tener una tolerancia.
- Aviso claro para piezas **sobre pedido**: el tiempo de elaboración empieza a contar al confirmar
  el pago.

#### Checkout

- Formulario de datos de envío: nombre, teléfono, correo, dirección y departamento/municipio.
- **Cálculo del costo de envío** según destino, peso y volumen. Requiere una **tabla de tarifas
  por zona** mantenida por el negocio (`TODO`: definirla).
- Elección de **envío nacional, internacional o entrega en mano** en la tienda física.
- Selección de la forma de pago.
- Resumen final antes de pagar: piezas, subtotal, envío y total, con IVA si corresponde.
- Confirmación en pantalla y por correo, con número de pedido.

#### Pasarelas de pago

**Locales (las que el negocio ya usa):**

| Método | Cómo funciona en línea | Consideración principal |
| ------ | ---------------------- | ----------------------- |
| **Transferencia bancaria** | El cliente ve los datos de la cuenta al cerrar el pedido, transfiere y **sube el comprobante**. El pedido queda "pendiente de verificación". | No es automático: alguien debe conciliar el pago. El pedido no se despacha hasta que se confirma el ingreso. |
| **Pago contra entrega** | Se registra el pedido sin cobro en línea y se cobra en efectivo al entregar. | Solo en zonas de cobertura y con límite de monto. Es la modalidad con mayor riesgo de pedidos no recibidos. |
| **Tigo Money** | Billetera móvil. Se integra por su API, si el negocio califica para el servicio de comercio; si no, se opera como pago manual con comprobante. | Depende de que el comercio tenga habilitada la cobranza por ese canal. `TODO:` verificar requisitos con el proveedor. |
| **BAC Credomatic** | Cobro con tarjeta a través de la pasarela del banco. | Es el camino que normalmente exige un contrato de comercio afiliado y un proceso de alta. `TODO:` cotizar y verificar requisitos directamente con el banco. |

**Internacionales (para las ventas al exterior):**

| Método | Para qué sirve | Consideración principal |
| ------ | -------------- | ----------------------- |
| **Stripe** | Cobro con tarjeta internacional, con buena experiencia de integración. | `TODO:` verificar la disponibilidad de cuentas para Honduras; es un país con cobertura limitada, y hay que confirmarlo antes de planificar sobre él. |
| **PayPal** | Alternativa conocida por el comprador del exterior y frecuente en la diáspora hondureña. | Comisiones y política de retención propias. `TODO:` verificar la disponibilidad de cuenta de comercio para el país. |

> **Ninguna de estas integraciones se asume disponible.** Cada una depende de que el negocio pueda
> abrir una cuenta de comercio, y eso se verifica con el proveedor, no en este documento.

#### Pedidos

- Estados del pedido: `pendiente de pago` → `pagado` → `en preparación` → `enviado` → `entregado`
  (y `cancelado` / `devuelto`).
- Registro de cada pedido: piezas, datos del cliente, forma de pago, costo de envío y número de
  guía del courier.
- Aviso al negocio cuando entra un pedido nuevo.
- Historial de pedidos consultable por el negocio.

#### Inventario básico

- Descontar existencias al confirmar el pago.
- Marcar una pieza como agotada automáticamente cuando llega a cero.
- Permitir **piezas únicas**: cada artesanía existe una sola vez (cantidad 1), algo que un carrito
  común no contempla por defecto.
- Permitir piezas **hechas sobre pedido** sin límite de existencias, pero con tiempo de
  elaboración visible.

#### Cupones

- Códigos de descuento por porcentaje o monto fijo.
- Vigencia (fecha de inicio y fin) y límite de usos.
- Descuento aplicable al subtotal o al envío.

#### Cuentas de cliente

- Registro e inicio de sesión por correo, o compra como invitado.
- Recuperación de contraseña.
- Historial de pedidos y direcciones guardadas.
- **Decisión de negocio:** `TODO:` ¿se exige crear cuenta o se permite comprar como invitado?
  Obligar a registrarse reduce conversiones; permitir invitado obliga a que el rastreo del pedido
  funcione sin sesión.

#### Correos transaccionales

- Confirmación de pedido.
- Confirmación de pago recibido y de pago verificado.
- Aviso de envío con número de guía.
- Aviso de entrega.
- Recuperación de carrito abandonado *(opcional, pero es de las acciones que más pedidos
  recupera)*.

#### Analítica

- Medir el embudo completo: visita → producto → carrito → checkout → pago.
- Identificar en qué paso se abandona.
- Registrar el origen del tráfico (búsqueda, redes, enlace directo).

### 1.2 Implicaciones técnicas y de costos

**Infraestructura.** Un sitio estático no necesita servidor; una tienda sí. Hay que decidir entre
alojar la aplicación (con su base de datos) o usar una plataforma de comercio ya hecha. Aparecen
costos recurrentes —servidor, base de datos, respaldos y dominio— que hoy no existen.
`TODO:` cotizar ambas rutas antes de elegir.

**Base de datos.** El catálogo deja de ser un archivo y pasa a ser una tabla. Eso trae consigo
migraciones, respaldos automáticos y la obligación de proteger copias de seguridad: la base
contiene **datos personales de clientes**.

**Comisiones por transacción.** Cada pasarela cobra por cobrar, y cada una cobra distinto
(porcentaje, monto fijo, o ambos) y con plazos de liquidación diferentes. Eso significa que el
margen por pieza **baja** al vender en línea, y que el precio publicado debe cubrir esa comisión.
`TODO:` pedir a cada proveedor su esquema de comisiones real y calcular el precio con eso incluido.

**PCI DSS si se manejan tarjetas.** Manejar datos de tarjeta obliga a cumplir el estándar de
seguridad de la industria de tarjetas (PCI DSS), que es un requisito técnico y de auditoría serio.
**La forma de evitarlo casi por completo es no tocar nunca los datos de la tarjeta:** el cliente
los escribe directamente en el formulario del proveedor de pago (Stripe, la pasarela del banco),
y el sitio solo recibe una confirmación. Esa decisión hay que tomarla **antes** de escribir la
primera línea de código de pago, porque deshacerla después es costoso.

> **Regla del proyecto:** los datos de tarjeta **nunca** pasan por nuestros servidores ni se
> guardan en nuestra base de datos.

**Seguridad.** Con pagos y datos personales aparecen obligaciones nuevas: HTTPS, protección de
secretos y claves, validación de datos en el servidor, límite de intentos de acceso, y registro de
quién hizo qué. Ya no basta con que el sitio se vea bien.

**Legal y privacidad.** Pasar de un sitio sin formularios a uno que recoge nombre, dirección,
teléfono y correo **obliga a reescribir la política de privacidad** y a definir cuánto tiempo se
guardan los datos, quién los ve y cómo se borran a petición del cliente.

**Operación.** Alguien tiene que verificar transferencias, actualizar estados, imprimir guías y
responder reclamos. Si nadie atiende la tienda a diario, la tienda funciona peor que el modelo
actual por WhatsApp.

### 1.3 Criterios de aceptación

La Fase 2 se considera terminada cuando:

- [ ] Se completa **una compra de prueba real de principio a fin**, con pago verdadero (de monto
      mínimo) y pedido creado correctamente en el sistema.
- [ ] El cliente recibe **correo de confirmación** con número de pedido.
- [ ] El negocio **ve el pedido** con todos los datos necesarios para despacharlo.
- [ ] La **transferencia bancaria** se puede enviar con comprobante y el pedido no se despacha
      hasta que un humano la verifica.
- [ ] El **pago contra entrega** solo aparece en las zonas donde está habilitado y respeta el
      límite de monto.
- [ ] **Los datos de tarjeta no pasan por nuestros servidores** en ninguna ruta del checkout.
- [ ] Los **correos transaccionales** llegan (no a la carpeta de correo no deseado) en Gmail,
      Outlook y un correo institucional.
- [ ] **El inventario se descuenta** al pagar y una pieza única no se puede vender dos veces.
- [ ] Un **cupón** aplica el descuento correcto y deja de funcionar al vencer.
- [ ] **El carrito sobrevive** a recargar la página y a cerrar el navegador.
- [ ] El checkout **funciona en celular** con datos móviles, sin errores.
- [ ] **Se puede cancelar un pedido** y devolver el inventario.
- [ ] Existen **respaldos automáticos** de la base de datos y se probó **restaurar** uno.
- [ ] La **política de privacidad fue actualizada** y menciona los datos que ahora se recogen.
- [ ] El **costo de envío** se calcula solo, con la tabla de tarifas del negocio, y coincide con
      lo que cobra el courier.
- [ ] Un cliente **solicita el borrado de sus datos** y el proceso funciona.

### 1.4 Riesgos

| Riesgo | Impacto | Mitigación |
| ------ | ------- | ---------- |
| **Pasarela no disponible para Honduras** (Stripe, PayPal) | Alto: cambia el plan de pagos internacionales | Verificar con cada proveedor **antes** de diseñar el checkout |
| **Requisitos de afiliación comercial** (BAC, Tigo Money) con trámites largos | Alto: retrasa el lanzamiento | Iniciar los trámites en paralelo, no al final |
| **Fraude en pagos con tarjeta** (contracargos) | Medio-alto: pérdida de producto y dinero | No manejar tarjetas directamente; usar las herramientas antifraude del proveedor; pedir CVV y dirección de facturación |
| **Pedidos falsos de contra entrega** | Medio: costo de envío perdido | Límite de monto, cobertura limitada y confirmación telefónica de pedidos grandes |
| **Comisiones que se comen el margen** | Medio: se vende a pérdida sin notarlo | Calcular el precio con la comisión incluida; revisarlo al cambiar de proveedor |
| **Precios fijos mal calculados** | Medio: pérdida por pieza | Revisar los precios con la tabla de envío real antes del lanzamiento |
| **Piezas artesanales distintas a la foto** | Medio: reclamos y devoluciones | Advertir con claridad en la ficha y en el carrito; política de cambio visible |
| **Piezas únicas agotadas durante el pago** | Medio: venta de algo inexistente | Bloquear la pieza al iniciar el pago y liberarla si el pago no se completa |
| **Pérdida de la base de datos** | Alto: se pierden pedidos y clientes | Respaldos automáticos **y** prueba de restauración periódica |
| **Fuga de datos de clientes** | Muy alto: daño legal y de reputación | HTTPS, cifrado, mínimo acceso, no guardar datos de tarjeta |
| **Sin personal que atienda la tienda** | Alto: los pedidos se estancan | Definir el proceso operativo **antes** de abrir la tienda |
| **El sitio se vuelve lento o se cae** | Medio: se pierden ventas | Monitoreo con aviso, y un plan de qué hacer cuando falle |

### 1.5 Esfuerzo relativo

Escala: **S** = unas jornadas de trabajo · **M** = semanas · **L** = meses de una persona
dedicada, trabajando con acompañamiento técnico.

| Entregable | Esfuerzo | Nota |
| ---------- | -------- | ---- |
| Carrito y persistencia | M | Es donde más casos límite aparecen (una sola pieza, piezas sobre pedido, medidas variables) |
| Checkout con cálculo de envío | M | Depende de que exista la tabla de tarifas por zona |
| Transferencia bancaria + carga de comprobante | S–M | Lo más simple de implementar; necesita proceso manual de verificación |
| Pago contra entrega | S | Poco código, pero requiere reglas de zona y monto |
| Tigo Money | M | Depende de la API y del alta como comercio |
| BAC Credomatic | M–L | Depende del proceso del banco y de su integración |
| Stripe / PayPal | M | Solo si la disponibilidad para el país se confirma |
| Gestión de pedidos y estados | M | Trabajo sencillo pero extenso; incluye avisos al negocio |
| Inventario (incluidas piezas únicas) | M | La "pieza única" complica el modelo estándar de cantidades |
| Cupones | S | Una vez que el carrito existe, es acotado |
| Cuentas de cliente y autenticación | L | Trae seguridad, recuperación de contraseña y soporte |
| Correos transaccionales | M | La parte difícil es que **lleguen** y no caigan en spam |
| Analítica del embudo | S–M | Requiere decidir la herramienta y actualizar la privacidad |
| **Actualizar privacidad, términos y operación** | M | No es código, pero sin esto la tienda no es lanzable |

**Observación honesta:** la suma de los puntos técnicos es considerable, y la parte de **operación
y legal** suele ser la que más retrasa el lanzamiento, no la de programación. Conviene planificar
la Fase 2 como un proyecto con responsables claros, no como "agregarle un carrito al sitio".

---

## 2. Fase 3 — Operación y crecimiento

**Objetivo:** que el negocio **opere la tienda sin depender de un programador** y que las
decisiones de surtido se tomen con datos medidos, no con impresiones.

### 2.1 Entregables

#### Catálogo dinámico con base de datos

- Migrar los 12 productos (y los que vengan) de los JSON a las tablas de la base de datos.
- Categorías, etiquetas y talleres como datos administrables, no como archivos.
- Búsqueda y filtros reales, resueltos en el servidor (a diferencia del filtrado simple del
  cliente que existe hoy).
- Variantes por pieza: tamaño, color, acabado.

#### Panel de administración para cargar productos sin tocar código

Es el entregable que más cambia el día a día del negocio.

- Formulario de producto con validación: los mismos campos que hoy tiene el JSON, pero con ayudas
  y mensajes de error en español, no un archivo de texto.
- Subida de **fotografías** desde el panel, con recorte y compresión automática.
- Gestión de categorías, etiquetas, precios y disponibilidad.
- Vista previa antes de publicar.
- Publicar y despublicar una pieza sin ayuda técnica.

#### Inventario

- Entradas y salidas de existencias con historial de movimientos.
- Alertas de existencias bajas.
- Registro de piezas en elaboración con su tiempo estimado.
- Costo por pieza y, si el negocio lo define, margen por producto.

#### Cupones y promociones

- Ampliación de la Fase 2: promociones por categoría, por monto mínimo, y envío gratis por umbral.
- Control de abuso: límite por cliente y por pedido.

#### Cuentas de cliente

- Perfil con direcciones y métodos de pago guardados (nunca datos de tarjeta propios).
- Historial completo y repetición de un pedido anterior.
- Seguimiento del pedido con número de guía.
- Lista de deseos *(opcional)*.

#### Correos transaccionales

- Plantillas de marca para todos los avisos del ciclo de compra.
- Correos de recuperación de carrito y de cliente inactivo.
- Confirmación de suscripción a novedades, si se decide tener boletín.

#### Analítica y reportes

- Panel de ventas: por periodo, por categoría, por pieza y por departamento de destino.
- Productos más vistos y **productos vistos que no se compran** (para decidir qué mejorar).
- Tasa de conversión por paso del embudo.
- Costo de envío real frente a lo cobrado.
- Reporte de cupones usados y su efecto en el margen.

#### Remarketing

- Audiencias para volver a mostrar el catálogo a quien visitó y no compró.
- Campañas de piezas vistas y carritos abandonados.
- **Requiere consentimiento del visitante** para cookies de seguimiento: hay que actualizar la
  política de privacidad y mostrar el aviso correspondiente.

### 2.2 Implicaciones técnicas y de costos

**Multiplicación de la superficie crítica.** Ya no hay un solo camino crítico (el pago): ahora
también lo son el panel de administración, el inventario y los correos. Un fallo en el panel puede
dejar al negocio sin poder publicar.

**Permisos y roles.** Con un panel de administración aparece la pregunta de quién puede ver y
hacer qué: el negocio no debería compartir una sola clave entre varias personas.

**Correos que llegan.** El problema real de los correos transaccionales no es enviarlos, sino que
no caigan en spam: exige configurar correctamente el dominio, los registros de autenticación y
usar un servicio de envío confiable. Es un costo recurrente.

**Analítica y privacidad.** Medir y hacer remarketing implica cookies y seguimiento, con
obligaciones de consentimiento y de transparencia. Cuanta más personalización, más obligaciones.

**Costos acumulados.** A los de la Fase 2 (servidor, base de datos) se suman: servicio de correo,
herramienta de analítica, herramienta de remarketing, almacenamiento de imágenes y respaldos. Cada
uno es pequeño, pero se acumulan y hay que revisarlos periódicamente.

**Dependencia de proveedores.** Cuantos más servicios externos se integren, más hay que vigilar
sus cambios de precio, de condiciones y sus interrupciones.

### 2.3 Criterios de aceptación

- [ ] El negocio **publica un producto nuevo sin ayuda técnica**, con fotografía, en menos de 15
      minutos y sin errores de validación.
- [ ] El negocio **retira o marca como agotada** una pieza sin ayuda técnica.
- [ ] Se puede **consultar el inventario** y ver el historial de movimientos de una pieza.
- [ ] Las **alertas de existencias bajas** avisan antes de quedarse sin producto vendible.
- [ ] Los **correos transaccionales** llegan a la bandeja de entrada en los tres proveedores
      principales de correo.
- [ ] El **panel de ventas** muestra datos correctos de un periodo ya cerrado, conciliables con
      los pedidos reales.
- [ ] Se identifica **en qué paso del embudo** se pierden más clientes, y esa cifra cuadra con la
      analítica de la tienda.
- [ ] Se conoce el **costo real de envío por zona** comparado con lo cobrado.
- [ ] El **consentimiento de cookies** funciona y se puede **rechazar** el seguimiento sin perder
      la capacidad de comprar.
- [ ] Existe **separación de permisos**: no todos los usuarios del panel pueden hacer todo.
- [ ] Los **respaldos** cubren base de datos y fotografías, y se probó **restaurarlos**.
- [ ] Existe un **procedimiento escrito** de qué hacer cuando la tienda o el pago fallan.

### 2.4 Riesgos

| Riesgo | Impacto | Mitigación |
| ------ | ------- | ---------- |
| **Panel de administración mal protegido** | Muy alto: cualquiera podría alterar precios o ver pedidos | Autenticación robusta, roles separados, límite de intentos y registro de acciones |
| **Migración de datos con pérdida de contenido** | Alto: se pierden descripciones y fotos trabajadas | Migrar con respaldo y verificar producto por producto contra la versión estática |
| **Complejidad que el negocio no puede sostener** | Alto: se vuelve a depender de un técnico | Priorizar la simplicidad del panel sobre la cantidad de funciones |
| **Costos recurrentes que se acumulan** | Medio: el margen se estrecha sin que se note | Revisar los costos de servicios cada cierto periodo |
| **Remarketing mal usado (publicidad invasiva)** | Medio: daño de reputación de una marca artesanal | Limitar la frecuencia y el tono; recordar que la marca vende oficio, no presión |
| **Correos que caen en spam** | Medio: el cliente no sabe el estado de su pedido | Configurar autenticación de dominio y probar con varios proveedores |
| **Pérdida de la cercanía de la marca** | Medio: la tienda se siente impersonal | Mantener el relato del taller en cada ficha y el WhatsApp visible como canal humano |
| **Dependencia de un solo proveedor de pago** | Alto: si falla, no se vende | Tener al menos dos métodos activos (uno local y uno internacional) |

### 2.5 Esfuerzo relativo

| Entregable | Esfuerzo |
| ---------- | -------- |
| Migración del catálogo a base de datos | M |
| Panel de administración de productos y fotos | L |
| Inventario con movimientos y alertas | M |
| Cupones y promociones ampliados | S–M |
| Cuentas de cliente completas | M |
| Correos transaccionales con plantillas de marca | M |
| Analítica, reportes y panel de ventas | M–L |
| Remarketing y consentimiento de cookies | M |
| Roles, permisos y auditoría | M |
| **Total de la Fase 3** | **L** |

---

## 3. Orden recomendado de trabajo

```text
Fase 1  ✅ Sitio de marca y catálogo consultivo
        └── Requisito de salida: número de WhatsApp real y fotos reales

Paso 0  Decisiones de negocio (sin código)
        ├── ¿Precios públicos fijos?              ← habilita o bloquea todo lo demás
        ├── Tabla de costos de envío por zona
        ├── Política de devoluciones y piezas dañadas
        └── ¿Quién opera la tienda y en qué horario?

Fase 2  Tienda transaccional (por orden)
        ├── 1. Carrito
        ├── 2. Checkout + cálculo de envío
        ├── 3. Transferencia bancaria con comprobante   ← habilita vender ya
        ├── 4. Pago contra entrega + Tigo Money
        ├── 5. Pedidos, estados y correos transaccionales
        ├── 6. Inventario básico
        ├── 7. Cupones
        ├── 8. BAC Credomatic / Stripe / PayPal (según disponibilidad)
        └── 9. Cuentas de cliente
        └── Requisito de salida: una compra real completa y privacidad actualizada

Fase 3  Operación y crecimiento
        ├── Catálogo dinámico y panel de administración
        ├── Inventario ampliado y reportes
        ├── Correos y cuentas de cliente completos
        ├── Analítica del embudo
        └── Remarketing con consentimiento
```

**Razonamiento del orden:** los métodos de pago locales que el negocio ya usa (transferencia y
contra entrega) permiten **vender en línea antes** de resolver la integración con tarjeta, que es
la parte más lenta por depender de terceros. Y el panel de administración llega en la Fase 3, no
antes: al principio el volumen es bajo y mantener 12 productos a mano sigue siendo viable, aunque
sea menos cómodo.

---

## 4. Lo que NO se debe olvidar

- **Sin precio público no hay cobro automático.** Es la primera decisión, y es de negocio.
- **Sin tabla de envío no hay checkout que funcione solo.** Es la segunda.
- **La privacidad deja de ser un texto de relleno** en cuanto se recogen datos de clientes.
- **El WhatsApp debe seguir visible** incluso con tienda en línea: la marca vende piezas hechas a
  mano y mucha gente quiere preguntar antes de comprar. La tienda automatiza el cierre, no
  reemplaza la conversación.
- **Nada de esto vale la pena si nadie atiende la tienda todos los días.**
