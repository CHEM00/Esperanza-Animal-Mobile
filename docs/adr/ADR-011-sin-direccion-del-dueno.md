# ADR-011 · No se almacena la dirección del dueño

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Contexto

La devolución de un animal se coordina por contacto, no publicando dónde vive el dueño.
La colonia y el municipio, que ya existen en el modelo, bastan para el radio de búsqueda.
Una dirección completa es un pasivo bajo la LFPDPPP y un riesgo ante fugas.

## Decisión

El perfil de dueño no tiene campo de dirección. Se conservan colonia y municipio.

## Consecuencias

- Menos datos personales que cifrar, custodiar y declarar en el aviso de privacidad.
