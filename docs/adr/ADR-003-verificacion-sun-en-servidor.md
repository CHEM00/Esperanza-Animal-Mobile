# ADR-003 · La verificación SUN vive en el servidor; la app no hace criptografía NFC

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Contexto

El NTAG 424 DNA genera en cada lectura una URL con datos cifrados y una firma CMAC
calculada con llaves AES que no salen del chip. El sistema operativo del teléfono lee la
URL en segundo plano sin app instalada.

## Decisión

Toda la verificación (descifrado de PICCData, derivación de llave por tag, CMAC, contador
anti-replay) se hace en el backend. Las llaves maestras solo existen en el servidor. La app
de consumo únicamente abre URLs y, como respaldo, lee la URL del tag en primer plano; no
autentica con el chip ni conoce llaves.

## Alternativas consideradas

- Autenticación mutua chip-app con llaves en el dispositivo. Distribuye llaves a teléfonos
  de terceros, rompe el flujo sin app y no aporta seguridad adicional.
- Guardar el perfil en el chip. No se puede actualizar, cualquiera lo extrae y es un dato
  personal circulando físicamente.

## Consecuencias

- El tag contiene solo una URL firmada; cero datos personales.
- Cada endpoint sensible exige un token de escaneo emitido tras verificar (documento 04).
- El verificador se prueba con vectores públicos antes de tener chips.
