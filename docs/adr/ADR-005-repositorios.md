# ADR-005 · Repositorios: uno móvil, uno de personalización, contrato en el backend

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Decisión

- `esperanza-animal` (existente): backend Next.js, web, contrato OpenAPI generado.
- Este repositorio: app móvil React Native para Android e iOS.
- Repositorio interno separado: herramienta de personalización de tags en Kotlin.

El contrato se genera en el backend y cada cliente fija la versión que consume.

## Alternativas consideradas

- Monorepo con paquete de esquemas compartido. Es el destino correcto a mediano plazo,
  pero hoy la regla del lockfile en Linux del proyecto web complica la migración. Se
  revisará cuando la duplicación de un esquema Zod duela por segunda vez.

## Consecuencias

- El directorio local se renombró a `alakito-Mobile` el 2026-09-25 (ADR-014); el remoto
  sigue siendo `CHEM00/Esperanza-Animal-Mobile` hasta que se renombre en GitHub.
