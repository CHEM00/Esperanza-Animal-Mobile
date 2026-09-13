# ADR-010 · La pantalla de quien encuentra es web primero; App Clip después

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Decisión

La pantalla que ve quien encuentra al animal se sirve desde la web del backend: ligera,
sin login, rápida en redes lentas. Si la app está instalada, el enlace universal la abre
con el mismo token. El App Clip de iOS se agrega en una fase posterior cuando exista
entorno macOS.

## Consecuencias

- El flujo completo funciona el día uno para cualquier teléfono con navegador.
- La app móvil es para guardianes y comunidad.
