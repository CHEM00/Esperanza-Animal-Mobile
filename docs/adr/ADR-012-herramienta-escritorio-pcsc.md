# ADR-012 · La herramienta de personalización corre en escritorio con un lector PC/SC

- **Estado:** Aceptada · **Fecha:** 2026-09-24 · Cambia la implementación fijada en ADR-007

## Contexto

ADR-007 fijó una app Android en Kotlin sobre TapLinx para personalizar los chips. Desde
entonces cambiaron tres cosas: sysosa ya tiene un lector USB **ACR122U**; TapLinx exige
registro en el portal de NXP y una clave de licencia por paquete; y el backend ya
implementa y prueba en TypeScript la criptografía del NTAG 424 DNA (`src/lib/nfc`:
AES-CMAC, PICCData, diversificación AN10922) con los vectores oficiales. No hay entorno
Android Studio configurado y la herramienta la usará una sola persona.

## Decisión

La herramienta es un paquete Node de línea de comandos en `tools/personalizador/` del
repositorio `esperanza-animal`, con su propio `package.json` (queda fuera del `Dockerfile`
de la web), que habla con el ACR122U por PC/SC (`nfc-pcsc`) y reutiliza `src/lib/nfc` sin
duplicarlo. Los comandos del chip se envían como APDU ISO 7816-4 según la hoja de datos
NT4H2421Gx y AN12196, que documentan cada comando con vectores de prueba.

Lo que no cambia de ADR-007: sigue siendo una herramienta interna separada de la app
pública, la llave maestra no sale del servidor y la herramienta pide al backend las llaves
derivadas por UID (sección S8).

## Alternativas consideradas

- **Kotlin + TapLinx (ADR-007).** SDK oficial y probado, pero licencia, un stack más, un
  repositorio más y un teléfono dedicado para una operación de escritorio.
- **Repositorio separado para la herramienta Node.** Obligaría a publicar `lib/nfc` como
  paquete o a duplicarlo. Se revisará si aparece un segundo consumidor.
- **NXP TagWriter a mano.** Válido para la primera lectura con llaves de fábrica
  (documento 10 §3); no sirve para dejar chips `LISTO` en lote ni para verificar con el
  servidor.

## Consecuencias

- Requisitos de máquina: driver de ACS para el ACR122U en Windows (y desactivar el
  driver genérico que Windows instala para ese lector). Se documenta en el 08.
- El alcance del ACR122U es de pocos centímetros y no lee a través de metal: el chip se
  personaliza antes de montarlo en el collar y la lectura final se valida con un teléfono.
- El documento 07 conserva el flujo y las reglas; cambia el ejecutor y el stack.
- La cuenta del portal de NXP deja de ser necesaria.
- ADR-005 queda matizada: la herramienta vive en el repo del backend, no en uno propio.
