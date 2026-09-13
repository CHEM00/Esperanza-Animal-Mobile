# ADR-002 · El tag NFC se vincula a la mascota, no al dueño

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Contexto

Un dueño puede tener varias mascotas; una familia comparte una mascota; los animales
cambian de dueño por adopción. Lo que ve el público al escanear es al animal.

## Decisión

La entidad central es **Mascota**. El **Tag** se asigna a una mascota a la vez, con
historial de asignaciones. Los usuarios se relacionan con la mascota mediante
**Guardián** (rol `DUENO`, único, o `GUARDIAN`). Las alertas se envían a todos los
guardianes.

## Alternativas consideradas

- Vincular el tag al dueño y colgar mascotas como datos complementarios. Obliga a
  reprogramar chips ante cambios de dueño y expone al humano en vez del animal.

## Consecuencias

- La transferencia de mascota es una operación de dominio con aceptación del receptor o
  resolución administrativa con bitácora.
- Una sola URL de tag abre vistas distintas según quién la lea (documento 02 §5).
