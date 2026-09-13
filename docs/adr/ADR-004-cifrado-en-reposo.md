# ADR-004 · Cifrado de datos personales en reposo con cifrado de sobre

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Contexto

Los perfiles de dueño incluyen teléfonos y contactos que deben protegerse ante un volcado
de la base de datos. El servidor debe poder leerlos para avisar al dueño. El teléfono de
contacto de las publicaciones existe hoy en claro.

## Decisión

Cifrado por campo con AES-256-GCM y **cifrado de sobre**: una llave de datos por registro,
envuelta por una llave maestra que vive en un gestor de secretos. Se implementa detrás de
un puerto `KeyProvider` con un adaptador inicial basado en variables de entorno y uno
futuro para KMS. Cada descifrado de datos de contacto por un administrador queda en
bitácora. Los campos que necesitan búsqueda se indexan con HMAC, nunca en claro. El
teléfono de las publicaciones migra al mismo esquema.

## Alternativas consideradas

- Cifrado de extremo a extremo. Imposible: el servidor necesita el teléfono para notificar
  y contactar.
- Cifrado de disco o de base completa únicamente. No protege ante un volcado lógico con
  credenciales válidas.

## Consecuencias

- Protege contra volcado de base; no contra un servidor comprometido. Eso se cubre con
  control de acceso y bitácora.
- La llave maestra es un secreto de 256 bits generado al azar, con respaldo en bóveda con
  dos custodios. Perderla equivale a perder los datos cifrados.
- La rotación de la llave maestra reenvuelve llaves de datos, no recifra registros.
