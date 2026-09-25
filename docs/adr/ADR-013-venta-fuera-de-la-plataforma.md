# ADR-013 · La venta del collar ocurre fuera de la plataforma

- **Estado:** Aceptada · **Fecha:** 2026-09-24

## Contexto

Con la apertura nacional (sección S18) el collar se venderá en todo México. La plataforma
no tiene pedidos, pagos ni envíos, y construirlos antes de validar la demanda sería deuda.
Se evaluó además la propuesta de crear el perfil de la mascota desde sysosa al recibir el
pedido y dejarlo sin edición como medida antifraude.

## Decisión

Los primeros meses la venta se hace por canales externos (mensajería, marketplace o enlace
de pago) y el envío es manual. La plataforma cubre solo lo que ya existe: el dueño registra
a su mascota, el collar llega personalizado (`LISTO`) y se activa acercando el teléfono con
sesión.

No se crea el perfil al pedir el collar ni se congela su edición. La protección contra
clonación y suplantación vive en el chip y en la activación física (ADR-003, documento 04
§8), no en los datos del perfil: llaves únicas por chip que no salen de él, firma distinta
en cada lectura, contador anti-replay, activación solo con lectura verificada y sesión,
transferencia con aceptación y bitácora, y marcado de sospecha que congela el tag. Lo que
sí se protege es la identidad de la mascota (sección S19: microchip inmutable e historial
de cambios).

## Alternativas consideradas

- **Pedido dentro de la app con perfil creado por sysosa.** Convierte a sysosa en
  capturista nacional (cada foto o teléfono nuevo es un ticket), acopla el registro de la
  mascota a una compra y no cierra ninguna amenaza real. Una mascota sin collar debe poder
  existir por el camino QR (ADR-008).
- **Tienda propia con pagos.** Se revisará cuando haya volumen que la justifique.

## Consecuencias

- El collar se entrega con una tarjeta de tres pasos: abrir la web o instalar la app,
  registrar a la mascota, acercar el teléfono al collar.
- Si algún día hay pedidos en la plataforma, nacen como entidad propia (`Order`) sin tocar
  el modelo de mascota ni el de tag.
- Los textos de venta (sección S16) explican qué hace y qué no hace el collar.
