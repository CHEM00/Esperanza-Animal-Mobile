# ADR-006 · Contrato OpenAPI generado desde Zod; clientes generados

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Contexto

El backend valida con Zod. La app móvil necesita tipos y cliente HTTP sin duplicar
modelos a mano ni depender de Server Actions, que son un protocolo interno de React.

## Decisión

Los handlers bajo `/api/v1` se declaran con una fábrica que recibe sus esquemas Zod; de
esa declaración se genera un documento OpenAPI versionado. La app móvil genera tipos y un
cliente tipado desde ese documento. Errores en formato Problem Details (RFC 9457).
Autenticación por `Authorization: Bearer`.

## Consecuencias

- Un cambio incompatible en el contrato rompe la compilación del cliente: es el
  comportamiento deseado.
- Las Server Actions existentes siguen sirviendo a la web; los handlers delegan al mismo
  `service.ts` de cada feature para no duplicar reglas.
