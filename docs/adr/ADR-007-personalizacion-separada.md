# ADR-007 · La personalización de tags es una herramienta interna separada

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Decisión

Cambiar llaves de fábrica, configurar SDM y escribir la URL plantilla se hace con una app
Android interna en Kotlin sobre TapLinx, el SDK oficial de NXP, usada solo por sysosa. La
herramienta pide al backend las llaves derivadas para el UID que tiene enfrente; la llave
maestra nunca sale del servidor.

## Alternativas consideradas

- Incluir la personalización en la app pública. Expone gestión de llaves a cualquier
  usuario y agranda la superficie de ataque.
- Lector USB en escritorio. Válido como respaldo; se documenta pero no es el camino
  principal porque los teléfonos ya traen lector.

## Consecuencias

- Existe un endpoint interno de emisión de llaves, protegido con rol y bitácora.
- La primera prueba con chips reales puede hacerse con NXP TagWriter y llaves de fábrica,
  sin la herramienta (documento 10).
