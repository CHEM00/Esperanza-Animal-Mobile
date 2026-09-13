# ADR-009 · Push móvil: FCM en Android y APNs en iOS detrás de un puerto

- **Estado:** Aceptada · **Fecha:** 2026-09-13

## Contexto

La web usa Web Push con VAPID. La app móvil necesita push nativo. El desarrollo se hace
sin Mac, así que conviene minimizar dependencias nativas en el proyecto iOS.

## Decisión

Se define un puerto `NotificationChannel` con tres adaptadores: Web Push (existente,
reescrito sobre el puerto), FCM para Android y APNs para iOS. La app obtiene el token
nativo de cada plataforma con expo-notifications y lo registra en un `Device` por
usuario. El backend enruta por plataforma.

## Alternativas consideradas

- FCM como relevo único para ambas plataformas. Reduce a un remitente, pero obliga a
  incluir el SDK de Firebase en la app iOS y a intercambiar tokens APNs por tokens FCM;
  más superficie nativa que no se puede depurar sin Mac.
- Servicio de push de Expo. Cómodo, pero añade un relevo de terceros entre el backend y
  los proveedores.

## Consecuencias

- Dos credenciales en el backend (cuenta de servicio FCM y llave APNs .p8).
- La decisión es reversible sin tocar el dominio: cambiar de proveedor es cambiar un
  adaptador.
